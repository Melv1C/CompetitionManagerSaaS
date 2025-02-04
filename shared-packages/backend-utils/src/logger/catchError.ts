import { LogInfo } from "@competition-manager/schemas";
import { Logger } from "winston";
import { z } from "zod";

export const catchError = (logger: Logger) => (
    error: unknown, 
    logInfo: Omit<LogInfo, 'level'>
) => {
    const { message, ...logInfoWithoutMessage } = logInfo;
    if (error instanceof Error) {
        logger.error(message, {
            ...logInfoWithoutMessage,
            metadata: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                ...logInfoWithoutMessage.metadata
            }
        });
    } else if (error instanceof z.ZodError) {
        logger.error(message, {
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
        logger.error(message, {
            ...logInfoWithoutMessage,
            metadata: {
                name: 'UnknownError',
                error,
                ...logInfoWithoutMessage.metadata
            }
        });
    }
}