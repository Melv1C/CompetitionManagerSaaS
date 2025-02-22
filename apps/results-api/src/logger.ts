/**
 * File: src/logger.ts
 * 
 * Logger configuration for the Results API service.
 * Creates a standardized logger instance using the backend utilities.
 */

import { createLogger } from "@competition-manager/backend-utils";
import { SERVICE } from "@competition-manager/schemas";

export const logger = createLogger(SERVICE.RESULTS); 