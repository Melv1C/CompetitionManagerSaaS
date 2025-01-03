import { Request, Response, NextFunction } from 'express';
import { createLog } from '../createLog';
import { CreateLog$, STATUS, SERVICE, logMetadata } from '@competition-manager/schemas';
import { verifyAccessToken } from '../jwtToken';

const getUserId = (accessToken: string) => {
    if (!accessToken) return null;
    const user = verifyAccessToken(accessToken);
    if (!user) return null;
    return user.id;
}

export const logRoute = (service: SERVICE, logRequestData: Boolean = false, logUserId: Boolean = false) => (req: Request, res: Response, next: NextFunction) => {
    const metadata: logMetadata = {};
    if (logUserId) {
        metadata.userId = req.headers.authorization ? getUserId(req.headers.authorization.split(' ')[1]) : null;
    }
    if (!logRequestData) {
        createLog(CreateLog$.parse({
            service: service,
            status: STATUS.INFO,
            message: req.method + ' : ' + req.originalUrl,
            metadata: metadata
        }))
        next();
        return;
    }
    createLog(CreateLog$.parse({
        service: service,
        status: STATUS.INFO,
        message: req.method + ' : ' + req.originalUrl,
        metadata: {
            ...metadata,
            body: req.body,
            params: req.params,
            query: req.query,
        }
    }))
    next();
};

