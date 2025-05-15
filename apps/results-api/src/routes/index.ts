/**
 * File: src/routes/index.ts
 *
 * Routes configuration for the Results API.
 * Combines all result-related route handlers into a single router.
 *
 * Available Routes:
 * - POST /         - Create new result
 * - PUT /:eid     - Update existing result
 * - GET /competitions/:eid - Get all results for a competition
 */

import { Router } from 'express';
import { router as upsertResultsRouter } from './upsertResults';
import { router as getCompetitionResultsRouter } from './getCompetitionResults';
import { router as getResultsSinceRouter } from './getResultsSince';

const router = Router();

// Mount result route handlers
router.use('/', upsertResultsRouter);
router.use('/', getCompetitionResultsRouter);
router.use('/', getResultsSinceRouter);

export default router;
