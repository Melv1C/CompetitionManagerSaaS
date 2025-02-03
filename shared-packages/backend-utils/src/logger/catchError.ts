import { LogInfo } from "@competition-manager/schemas";
import { Logger } from "winston";
import { z } from "zod";

export const catchError = (logger: Logger) => (
    error: unknown, 
    logInfo: Omit<LogInfo, 'level'>
) => {
    if (error instanceof Error) {
        logger.error(logInfo.message, {
            ...logInfo,
            metadata: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                ...logInfo.metadata
            }
        });
    } else if (error instanceof z.ZodError) {
        logger.error(logInfo.message, {
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
        logger.error(logInfo.message, {
            ...logInfo,
            metadata: {
                name: 'UnknownError',
                error,
                ...logInfo.metadata
            }
        });
    }
}