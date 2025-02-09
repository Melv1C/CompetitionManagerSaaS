import { Response, NextFunction } from 'express';
import { CustomRequest } from './customRequest';
import { Role } from '@competition-manager/schemas';
import { setUserIfExist } from './setUserIfExist';
import { isAuthorized } from '@competition-manager/utils';

export const checkRole = (levelRequire: Role) => (req: CustomRequest, res: Response, next: NextFunction) => {
    setUserIfExist(req, res, () => {
        if (!req.user) {
            res.status(401).send(req.t('errors.unauthorized'));
            return;
        }
        if (!isAuthorized(req.user, levelRequire)) {
            res.status(401).send(req.t('errors.unauthorized'));
            return;
        }
        next();
    });
}
