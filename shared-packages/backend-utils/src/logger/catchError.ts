import { LEVEL, LogInfo } from "@competition-manager/schemas";
import { Logger } from "winston";
import { z } from "zod";

export const catchError = (logger: Logger, severity: LEVEL = LEVEL.error) => (
    error: unknown, 
    logInfo: Omit<LogInfo, 'level'>
) => {
    if (error instanceof Error) {
        logger.log({
            level: severity,
            ...logInfo,
            metadata: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                ...logInfo.metadata
            }
        });
    } else if (error instanceof z.ZodError) {
        logger.log({
            level: severity,
            ...logInfo,
            metadata: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                errors: error.errors,
                ...logInfo.metadata
            }
        });
    } else {
        logger.log({
            level: severity,
            ...logInfo,
            metadata: {
                name: 'UnknownError',
                error,
                ...logInfo.metadata
            }
        });
    }
}