/**
 * File: src/routes/getCompetitionResults.ts
 * 
 * Route handler for retrieving all results for a specific competition.
 * Returns results with related entities (competition event, athlete, club).
 * No special permissions required to view results.
 * 
 * Endpoint: GET /competitions/:eid
 * Params:
 * - eid: Entity ID of the competition
 * 
 * Process:
 * 1. Validates request parameters
 * 2. Fetches all results for the competition
 * 3. Includes related entities in response
 * 
 * Response:
 * - 200: Array of results with relationships
 * - 500: Internal server error
 * 
 * Related Entities Included:
 * - competitionEvent
 * - athlete
 * - club
 */

import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { Eid$, Result$, resultInclude } from '@competition-manager/schemas';
import { catchError, Key, parseRequest } from '@competition-manager/backend-utils';
import { logger } from '../logger';
import { z } from 'zod';

export const router = Router();

const Param$ = z.object({
    eid: Eid$,
});

router.get(
    '/competitions/:eid',
    parseRequest(Key.Params, Param$),
    async (req, res) => {
        try {
            // Extract validated fields from request params
            const { eid } = Param$.parse(req.params);
            // Fetch all results for the competition with related entities
            const results = await prisma.result.findMany({
                where: {
                    competitionEvent: {
                        competition: {
                            eid: eid
                        }
                    }
                },
                include: resultInclude
            });
            
            // Return array of validated results
            res.json(Result$.array().parse(results));
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'GET /competitions/:eid',
                status: 500
            });
            res.status(500).send(req.t('errors.internalServerError'));
        }
    }
); 