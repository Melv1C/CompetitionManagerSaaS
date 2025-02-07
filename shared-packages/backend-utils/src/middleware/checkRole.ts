import { Response, NextFunction } from 'express';
import { AuthentificatedRequest } from './authentificatedRequest';
import { Role } from '@competition-manager/schemas';
import { setUserIfExist } from './setUserIfExist';
import { isAuthorized } from '@competition-manager/utils';

export const checkRole = (levelRequire: Role) => (req: AuthentificatedRequest, res: Response, next: NextFunction) => {
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
