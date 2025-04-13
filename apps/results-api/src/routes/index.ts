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
import { router as createResultRouter } from './createResult';
import { router as getCompetitionResultsRouter } from './getCompetitionResults';

const router = Router();

// Mount result route handlers
router.use('/', createResultRouter);
router.use('/', getCompetitionResultsRouter);

export default router; 