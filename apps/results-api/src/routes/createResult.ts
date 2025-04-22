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

                const processedDetails = details.map((detail, idx, arr) => {
                    const isBestPerf = arr.every(
                        (d) =>
                            d === detail ||
                            isBestResult(
                                detail.value,
                                d.value,
                                competitionEvent.event.type as EventType
                            )
                    );
                    return {
                        tryNumber: detail.tryNumber,
                        value: detail.value,
                        attempts: detail.attempts,
                        wind: detail.wind,
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

                console.log('Result:', result);

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
