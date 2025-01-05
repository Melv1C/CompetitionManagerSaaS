import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticatedRequest';
import { Role } from '@competition-manager/schemas';
import { isAuthorized } from '../isAuthorize';
import { setUserIfExist } from './setUserIfExist';

export const checkRole = (levelRequire: Role) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    setUserIfExist(req, res, () => {
        if (!req.user) {
            res.status(401).send('Unauthorized');
            return;
        }
        if (!isAuthorized(req.user, levelRequire)) {
            res.status(401).send('Unauthorized');
            return;
        }
        next();
    });
}
