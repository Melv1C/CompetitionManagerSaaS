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
    Athlete$,
    athleteInclude,
    AttemptValue,
    BaseAdmin$,
    CompetitionEvent$,
    competitionEventInclude,
    CreateResultDetail,
    Eid$,
    EventType,
    Result$,
    ResultCode,
    ResultDetail$,
    ResultDetailCode,
    resultInclude,
    Role,
    UpsertResult$,
    UpsertResultType,
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
                    BaseAdmin$.array().parse(competition.admins),
                    res,
                    req.t
                )
            ) {
                return;
            }

            const upsertedResults = [];
            for (const resultInfo of results) {
                const {
                    competitionEventEid,
                    athleteLicense,
                    details,
                    points,
                    finalOrder,
                    ...rest
                } = resultInfo;

                const competitionEvent = CompetitionEvent$.parse(
                    competition.events.find(
                        (event) => event.eid === competitionEventEid
                    )
                );

                if (!competitionEvent) {
                    res.status(404).send(
                        req.t('errors.competitionEventNotFound')
                    );
                    return;
                }

                //check if event is a subevent
                const isSubEvent = competitionEvent.parentId !== null;
                const parentEvent = isSubEvent
                    ? CompetitionEvent$.parse(
                          competition.events.find(
                              (event) => event.id === competitionEvent.parentId
                          )
                      )
                    : null;

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
                    const eventType = competitionEvent.event.type;

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
                    const eventType = competitionEvent.event.type;
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

                // Check if result already exists
                const existingResult = await prisma.result.findUnique({
                    where: {
                        competitionEventId_athleteId: {
                            competitionEventId: competitionEvent.id,
                            athleteId: athlete.id,
                        },
                    },
                    include: resultInclude,
                });

                const getResultValue = (
                    bestDetail: CreateResultDetail | undefined
                ) => {
                    if (!bestDetail)
                        return {
                            value: null,
                            wind: null,
                        };
                    if (bestDetail.value > 0) {
                        return {
                            value: bestDetail.value,
                            wind: bestDetail.wind,
                        };
                    }
                    switch (bestDetail.value) {
                        case ResultDetailCode.X:
                            return {
                                value: ResultCode.NM,
                                wind: null,
                            };
                        case ResultDetailCode.PASS:
                            return {
                                value: null,
                                wind: null,
                            };
                        case ResultDetailCode.R:
                            return {
                                value: ResultCode.DNF,
                                wind: null,
                            };
                        default:
                            return {
                                value: null,
                                wind: null,
                            };
                    }
                };

                const { value, wind } = getResultValue(bestDetail);

                const resultData = {
                    ...rest,
                    points:
                        type === UpsertResultType.FILE
                            ? points
                            : existingResult?.points || null,
                    finalOrder:
                        type === UpsertResultType.FILE
                            ? finalOrder
                            : existingResult?.finalOrder || null,
                    value,
                    wind,
                    competitionEventId: competitionEvent.id,
                    athleteId: athlete.id,
                    clubId: athlete.club.id,
                    competitionId: competition.id,
                    inscriptionId: inscription?.id || null,
                };

                // Determine if we should update details based on type and comparison
                let shouldUpdateDetails = false;
                if (type === UpsertResultType.FILE) {
                    // For FILE type, update if:
                    // 1. No existing result, or
                    // 2. Existing result value differs from the new best value, or
                    // 3. We have more processed details than existing details
                    if (
                        !existingResult ||
                        existingResult.value !== bestDetail?.value ||
                        (existingResult.details &&
                            processedDetails.length >=
                                existingResult.details.length)
                    ) {
                        shouldUpdateDetails = true;
                    }
                } else {
                    // For other types, always update details
                    shouldUpdateDetails = true;
                }

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
                        details: shouldUpdateDetails
                            ? {
                                  deleteMany: {},
                                  create: processedDetails,
                              }
                            : undefined,
                    },
                    include: resultInclude,
                });

                req.app
                    .get('io')
                    .to(`competition:${competitionEid}`)
                    .emit('result:new', Result$.parse(result));

                if (parentEvent) {
                    const existingParentResultData =
                        await prisma.result.findUnique({
                            where: {
                                competitionEventId_athleteId: {
                                    competitionEventId: parentEvent.id,
                                    athleteId: athlete.id,
                                },
                            },
                            include: resultInclude,
                        });

                    const existingParentResult = existingParentResultData
                        ? Result$.parse(existingParentResultData)
                        : null;

                    const parentInscription = existingParentResult
                        ? await prisma.inscription.findFirst({
                              where: {
                                  athleteId: athlete.id,
                                  competitionEventId: parentEvent.id,
                                  competitionId: competition.id,
                              },
                          })
                        : null;

                    const updateParentDetails = existingParentResult
                        ? existingParentResult.details.map((detail) => {
                              if (detail.tryNumber === competitionEvent.id) {
                                  return {
                                      ...detail,
                                      value: points || 0,
                                  };
                              }

                              return detail;
                          })
                        : undefined;

                    const parentResult = await prisma.result.upsert({
                        where: {
                            competitionEventId_athleteId: {
                                competitionEventId: parentEvent.id,
                                athleteId: athlete.id,
                            },
                        },
                        create: {
                            competitionEventId: parentEvent.id,
                            athleteId: athlete.id,
                            bib: result.bib,
                            clubId: athlete.club.id,
                            competitionId: competition.id,
                            inscriptionId: parentInscription?.id || null,
                            value: points,
                            points: points,
                            initialOrder: 0,
                            tempOrder: 0,
                            heat: 1,
                            details: {
                                create: ResultDetail$.omit({
                                    id: true,
                                })
                                    .array()
                                    .parse([
                                        {
                                            tryNumber: competitionEvent.id,
                                            value: points,
                                        },
                                    ]),
                            },
                        },
                        update: {
                            value: updateParentDetails?.reduce(
                                (acc, detail) => {
                                    if (detail.value) {
                                        return acc + detail.value;
                                    }
                                    return acc;
                                },
                                0
                            ),
                            points: updateParentDetails?.reduce(
                                (acc, detail) => {
                                    if (detail.value) {
                                        return acc + detail.value;
                                    }
                                    return acc;
                                },
                                0
                            ),
                            details: {
                                deleteMany: {},
                                create: updateParentDetails,
                            },
                        },
                    });

                    req.app
                        .get('io')
                        .to(`competition:${competitionEid}`)
                        .emit('result:new', Result$.parse(parentResult));
                }

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
