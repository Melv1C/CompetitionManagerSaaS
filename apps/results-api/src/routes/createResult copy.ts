/**
 * File: src/routes/createResult.ts
 *
 * Route handler for upserting competition results.
 * Validates input using Zod schemas and emits real-time updates via Socket.IO.
 * Requires ADMIN role and proper competition admin access rights.
 *
 * Endpoint: POST /
 * Body: CreateResult schema containing:
 *   - competitionEid: Competition entity ID
 *   - competitionEventEid: Competition event entity ID
 *   - athleteLicense: Athlete's license number
 *   - Other result fields (bib, heat, orders, values, etc.)
 *
 * Process:
 * 1. Validates request body
 * 2. Checks user permissions (ADMIN role + competition admin access)
 * 3. Verifies competition and event existence
 * 4. Finds athlete by license
 * 5. Upserts result with all relationships
 * 6. Emits real-time update
 *
 * Response:
 * - 200/201: Upserted result with all relationships
 * - 404: Competition/Event/Athlete not found
 * - 403: Insufficient permissions
 * - 500: Internal server error
 *
 * Socket Events:
 * - result:new/update - Emitted to competition room when a result is created/updated
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
    competitionEventInclude,
    CreateResult$,
    EventType,
    Result$,
    resultInclude,
    Role,
} from '@competition-manager/schemas';
import { isAuthorized, isFirstPerfBetter } from '@competition-manager/utils';
import { Router } from 'express';
import { logger } from '../logger';

export const router = Router();

router.post(
    '/',
    parseRequest(Key.Body, CreateResult$),
    checkRole(Role.ADMIN),
    async (req: CustomRequest, res) => {
        try {
            // Extract validated fields from request body
            const {
                competitionEid,
                competitionEventEid,
                athleteLicense,
                details,
                ...rest
            } = CreateResult$.parse(req.body);

            // Fetch competition with related admins and events
            const competition = await prisma.competition.findUnique({
                where: { eid: competitionEid },
                include: {
                    admins: true,
                    events: { include: competitionEventInclude },
                    oneDayAthletes: true,
                },
            });

            // Return 404 if competition not found
            if (!competition) {
                res.status(404).send(req.t('errors.competitionNotFound'));
                return;
            }

            // Find matching competition event
            const competitionEvent = competition.events.find(
                (event) => event.eid === competitionEventEid
            );

            // Return 404 if event not found
            if (!competitionEvent) {
                res.status(404).send(req.t('errors.competitionEventNotFound'));
                return;
            }

            const athlete = await findAthleteWithLicense(
                athleteLicense,
                Athlete$.array().parse(competition.oneDayAthletes)
            );

            // Return 404 if athlete not found
            if (!athlete) {
                res.status(404).send(req.t('errors.athleteNotFound'));
                return;
            }

            // Check if user has required permissions
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

            // Find the inscription for this athlete and event
            const inscription = await prisma.inscription.findFirst({
                where: {
                    athleteId: athlete.id,
                    competitionEventId: competitionEvent.id,
                    competitionId: competition.id,
                },
            });

            // Process details to compute best performances
            const processedDetails = details.map((detail, idx, arr) => {
                const isBestPerf = arr.every(
                    (d) =>
                        d === detail ||
                        isFirstPerfBetter(
                            detail.value,
                            d.value,
                            competitionEvent.event.type as EventType
                        )
                );
                return {
                    tryNumber: detail.tryNumber,
                    value: detail.value,
                    attempts: detail.attempts?.map((a) => a.toString()) || [],
                    wind: detail.wind,
                    isBest: isBestPerf,
                    isOfficialBest: isBestPerf, // For now, assuming official best is same as best (TODO)
                };
            });

            // Find best performance for result-level values
            const bestDetail = processedDetails.find((d) => d.isBest);

            // Prepare base result data
            const resultData = {
                ...rest,
                value: bestDetail?.value,
                wind: bestDetail?.wind,
                competitionEventId: competitionEvent.id,
                athleteId: athlete.id,
                clubId: athlete.club.id,
                competitionId: competition.id,
                inscriptionId: inscription?.id || null,
                initialOrder: rest.tempOrder, // Using tempOrder as initial order if not provided (TODO)
            };

            // Upsert result
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

            // Emit appropriate event
            req.app
                .get('io')
                .to(`competition:${competitionEid}`)
                .emit('result:new', Result$.parse(result));

            // Return response with appropriate status code
            res.status(201).json(Result$.parse(result));
            return;
        } catch (error) {
            // Log error and return 500 response
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
