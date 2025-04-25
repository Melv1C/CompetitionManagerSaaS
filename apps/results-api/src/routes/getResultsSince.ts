/**
 * File: src/routes/getResultsSince.ts
 *
 * Route handler for retrieving results updated since a specific timestamp.
 * Used to sync missed socket events after reconnection.
 *
 * Endpoint: GET /competitions/:eid/since/:timestamp
 * Returns results that have been updated after the specified timestamp.
 */

import { catchError, CustomRequest } from '@competition-manager/backend-utils';
import { prisma } from '@competition-manager/prisma';
import { Result$ } from '@competition-manager/schemas';
import { Router } from 'express';
import { logger } from '../logger';

export const router = Router();

router.get(
    '/competitions/:eid/since/:timestamp',
    async (req: CustomRequest, res) => {
        try {
            const { eid, timestamp } = req.params;

            // Convert timestamp to Date
            const since = new Date(Number(timestamp));

            // Validate timestamp
            if (isNaN(since.getTime())) {
                return res.status(400).send(req.t('errors.invalidTimestamp'));
            }

            // Fetch results updated after the timestamp
            const results = await prisma.result.findMany({
                where: {
                    competition: { eid },
                    updatedAt: {
                        gt: since,
                    },
                },
                include: {
                    competitionEvent: {
                        include: {
                            event: true,
                            category: true,
                        },
                    },
                    athlete: true,
                    club: true,
                    details: true,
                },
                orderBy: {
                    updatedAt: 'asc',
                },
            });

            // Return the validated results
            res.json(Result$.array().parse(results));
        } catch (error) {
            catchError(logger)(error, {
                message: 'Error fetching results since timestamp',
                path: `GET /competitions/:eid/since/:timestamp`,
                status: 500,
            });
            res.status(500).send(req.t('errors.internalServerError'));
        }
    }
);
