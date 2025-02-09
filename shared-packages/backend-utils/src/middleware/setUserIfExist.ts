import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../jwtToken';
import { CustomRequest, defaultT } from './customRequest';


export const setUserIfExist = (req: CustomRequest, res: Response, next: NextFunction) => {
    req.t = req.t || defaultT;
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            next();
            return;
        }
        const user = verifyAccessToken(accessToken);
        if (!user) {
            res.status(401).send(req.t('errors.unauthorized'));
            return;
        }
        req.user = user;
        next();
    } catch {
        res.status(500).send(req.t('errors.internalServerError'));
        return;
    }
}
