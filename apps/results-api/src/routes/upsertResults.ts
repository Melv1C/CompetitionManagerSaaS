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
    UpsertResult$,
    EventType,
    Result$,
    resultInclude,
    Role,
    UpsertResultType,
    Eid$,
} from '@competition-manager/schemas';
import { isAuthorized, sortPerf } from '@competition-manager/utils';
import { Router } from 'express';
import { z } from 'zod';
import { logger } from '../logger';

export const router = Router();

const Query$ = z.object({
    competitionEid: Eid$,
    type: z.nativeEnum(UpsertResultType).default(UpsertResultType.FILE),
});

router.post(
    '/',
    parseRequest(Key.Query, Query$),
    parseRequest(Key.Body, UpsertResult$.array()),
    checkRole(Role.ADMIN),
    async (req: CustomRequest, res) => {
        try {
            const { type, competitionEid } = Query$.parse(req.query);
            const results = UpsertResult$.array().parse(req.body);

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

            // Check if all results belong to the same competition
            const allResultsSameCompetition = results.every((result) => {
                return result.competitionEid === competitionEid;
            });

            if (!allResultsSameCompetition) {
                res.status(400).send(req.t('errors.resultsNotBelongToCompetition'));
                return;
            }

            const upsertedResults = [];
            for (const resultInfo of results) {
                const {
                    competitionEventEid,
                    athleteLicense,
                    details,
                    ...rest
                } = resultInfo;

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

                const sortedDetails = updatedDetails.sort((a, b) =>
                    sortPerf(
                        a.value,
                        b.value,
                        competitionEvent.event.type as EventType
                    )
                );

                // Update the field isBest for each detail
                const processedDetails = sortedDetails.map(
                    (detail, idx, arr) => ({
                        ...detail,
                        isBest: idx === 0,
                        isOfficialBest: idx === 0, // Assuming the first detail is the official best for now
                    })
                );

                // Find the best detail for result-level values
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
