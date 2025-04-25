/**
 * File: src/routes/createResult.ts
 *
 * Description: Route handler for upserting competition results.
 */

import {
    catchError,
    checkAdminRole,
    checkRole,
    CustomRequest,
    findAthleteWithLicense,
    Key,
    parseRequest,
} from '@competition-manager/backend-utils';
import { prisma } from '@competition-manager/prisma';
import {
    Access,
    Admin$,
    Athlete$,
    athleteInclude,
    AttemptValue,
    competitionEventInclude,
    CreateResult$,
    EventType,
    Result$,
    resultInclude,
    Role,
} from '@competition-manager/schemas';
import { isAuthorized, isBestResult } from '@competition-manager/utils';
import { Router } from 'express';
import { logger } from '../logger';

export const router = Router();

router.post(
    '/',
    parseRequest(Key.Body, CreateResult$.array()),
    checkRole(Role.ADMIN),
    async (req: CustomRequest, res) => {
        try {
            const results = CreateResult$.array().parse(req.body);
            const upsertedResults = [];
            for (const resultInfo of results) {
                const {
                    competitionEid,
                    competitionEventEid,
                    athleteLicense,
                    details,
                    ...rest
                } = resultInfo;

                const competition = await prisma.competition.findUnique({
                    where: { eid: competitionEid },
                    include: {
                        admins: true,
                        events: { include: competitionEventInclude },
                        oneDayAthletes: {
                            include: athleteInclude,
                        },
                    },
                });

                if (!competition) {
                    res.status(404).send(req.t('errors.competitionNotFound'));
                    return;
                }

                const competitionEvent = competition.events.find(
                    (event) => event.eid === competitionEventEid
                );

                if (!competitionEvent) {
                    res.status(404).send(
                        req.t('errors.competitionEventNotFound')
                    );
                    return;
                }

                const athlete = await findAthleteWithLicense(
                    athleteLicense,
                    Athlete$.array().parse(competition.oneDayAthletes)
                );
                if (!athlete) {
                    res.status(404).send(req.t('errors.athleteNotFound'));
                    return;
                }

                if (
                    !isAuthorized(req.user!, Role.SUPERADMIN) &&
                    !checkAdminRole(
                        Access.RESULTS,
                        req.user!.id,
                        Admin$.array().parse(competition.admins),
                        res,
                        req.t
                    )
                ) {
                    return;
                }
                const inscription = await prisma.inscription.findFirst({
                    where: {
                        athleteId: athlete.id,
                        competitionEventId: competitionEvent.id,
                        competitionId: competition.id,
                    },
                });

                // Filter and process details based on event type
                const validDetails = details.filter((detail) => {
                    const eventType = competitionEvent.event.type as EventType;

                    // For Distance events
                    if (eventType === EventType.DISTANCE) {
                        // Remove if value is 0
                        return detail.value !== 0;
                    }

                    // For Height events
                    if (eventType === EventType.HEIGHT) {
                        // Remove if attempts is empty
                        return detail.attempts && detail.attempts.length > 0;
                    }

                    // For other event types, keep all details
                    return true;
                });

                // First map to update values based on event types
                const updatedDetails = validDetails.map((detail) => {
                    const eventType = competitionEvent.event.type as EventType;
                    let updatedDetail = { ...detail };

                    // Process based on event type
                    if (eventType === EventType.DISTANCE) {
                        // For Distance events, ensure attempts is empty
                        updatedDetail.attempts = [];
                    } else if (eventType === EventType.HEIGHT) {
                        // For Height events, set value based on attempts
                        const hasSuccessfulAttempt = detail.attempts.includes(
                            AttemptValue.O
                        );
                        updatedDetail.value = hasSuccessfulAttempt
                            ? detail.tryNumber
                            : 0;
                    }

                    return updatedDetail;
                });

                // Then calculate best performances using the updated values
                const processedDetails = updatedDetails.map((updatedDetail) => {
                    const eventType = competitionEvent.event.type as EventType;

                    // Calculate if this is the best performance using updated values
                    const isBestPerf = updatedDetails.every(
                        (d) =>
                            d === updatedDetail ||
                            isBestResult(
                                updatedDetail.value,
                                d.value,
                                eventType
                            )
                    );

                    return {
                        tryNumber: updatedDetail.tryNumber,
                        value: updatedDetail.value,
                        attempts: updatedDetail.attempts,
                        wind: updatedDetail.wind,
                        isBest: isBestPerf,
                        isOfficialBest: isBestPerf,
                    };
                });

                const bestDetail = processedDetails.find((d) => d.isBest);

                const resultData = {
                    ...rest,
                    value: bestDetail?.value,
                    wind: bestDetail?.wind,
                    competitionEventId: competitionEvent.id,
                    athleteId: athlete.id,
                    clubId: athlete.club.id,
                    competitionId: competition.id,
                    inscriptionId: inscription?.id || null,
                    initialOrder: rest.tempOrder,
                };
                const result = await prisma.result.upsert({
                    where: {
                        competitionEventId_athleteId: {
                            competitionEventId: competitionEvent.id,
                            athleteId: athlete.id,
                        },
                    },
                    create: {
                        ...resultData,
                        details: {
                            create: processedDetails,
                        },
                    },
                    update: {
                        ...resultData,
                        details: {
                            deleteMany: {},
                            create: processedDetails,
                        },
                    },
                    include: resultInclude,
                });

                req.app
                    .get('io')
                    .to(`competition:${competitionEid}`)
                    .emit('result:new', Result$.parse(result));

                upsertedResults.push(Result$.parse(result));
            }
            res.status(201).json(upsertedResults);
            return;
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'POST /',
                status: 500,
                userId: req.user!.id,
            });
            res.status(500).send(req.t('errors.internalServerError'));
            return;
        }
    }
);
