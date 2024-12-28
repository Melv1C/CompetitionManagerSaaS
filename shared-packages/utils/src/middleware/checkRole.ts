import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../jwtToken';
import { AuthenticatedRequest } from './authenticatedRequest';
import { Role } from '@competition-manager/schemas';
import { isAuthorized } from '../isAuthorize';

export const checkRole = (levelRequire: Role) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try{
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            res.status(401).send('Unauthorized');
            return;
        }
        const user = verifyAccessToken(accessToken);
        if (!user) {
            res.status(401).send('Unauthorized');
            return;
        }
        if (!isAuthorized(user, levelRequire)) {
            res.status(401).send('Unauthorized');
            return;
        }
        req.user = user;
        next();
    } catch {
        res.status(500).send('Unauthorized');
        return;
    }
}
