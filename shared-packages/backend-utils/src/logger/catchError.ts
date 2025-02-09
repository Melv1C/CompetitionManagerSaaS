import { LEVEL, LogInfo } from "@competition-manager/schemas";
import { Logger } from "winston";
import { z } from "zod";

export const catchError = (logger: Logger, severity: LEVEL = LEVEL.error) => (
    error: unknown, 
    logInfo: Omit<LogInfo, 'level'>
) => {
    const { message, ...logInfoWithoutMessage } = logInfo;
    if (error instanceof Error) {
        logger.log(message, {
            level: severity,
            ...logInfoWithoutMessage,
            metadata: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                ...logInfoWithoutMessage.metadata
            }
        });
    } else if (error instanceof z.ZodError) {
        logger.log(message, {
            level: severity,
            ...logInfoWithoutMessage,
            metadata: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                errors: error.errors,
                ...logInfoWithoutMessage.metadata
            }
        });
    } else {
        logger.log(message, {
            level: severity,
            ...logInfoWithoutMessage,
            metadata: {
                name: 'UnknownError',
                error,
                ...logInfoWithoutMessage.metadata
            }
        });
    }
}