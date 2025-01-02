import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../jwtToken';
import { AuthenticatedRequest } from './authenticatedRequest';


export const setUserIfExist = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try{
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            next();
            return;
        }
        const user = verifyAccessToken(accessToken);
        if (!user) {
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
