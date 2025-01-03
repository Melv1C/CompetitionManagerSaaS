import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest, Key } from '../middleware';
import { Logger } from 'winston';

export type OmitType = {
    key: Key | 'response';
    field?: string;
}[];

export const logRequestMiddleware = (logger: Logger, omits: OmitType = []) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const metadata: any = {};

    const originalSend = res.send;
    res.send = function (body: any) {
        metadata["response"] = body.message || body;
        return originalSend.call(this, body);
    };

    res.on('finish', () => {
        const { method, originalUrl } = req;
        const { statusCode } = res;
        const userId = req.user?.id || null;

        metadata["body"] = Object.keys(req.body).length !== 0 ? req.body : undefined;
        metadata["params"] = Object.keys(req.params).length !== 0 ? req.params : undefined;
        metadata["query"] = Object.keys(req.query).length !== 0 ? req.query : undefined;

        for (const omit of omits) {
            const key = metadata[omit.key];
            if (key) {
                if (omit.field) {
                    key[omit.field] = "***";
                } else {
                    delete metadata[omit.key];
                }
            }
        }

        logger.http(`Request processed`, {
            path: `${method} ${originalUrl}`,
            status: statusCode,
            userId: userId,
            metadata: metadata,
        });
    });

    next();
};
