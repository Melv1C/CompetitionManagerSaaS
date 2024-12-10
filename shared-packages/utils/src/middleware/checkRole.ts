import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../jwtToken';
import { AuthenticatedRequest, UserFromToken } from './authenticatedRequest';
import { ROLE, Role } from '@competition-manager/schemas';

const isAuthorized = (user: UserFromToken, levelRequire: Role) => {
    return ROLE.indexOf(user.role) >= ROLE.indexOf(levelRequire);
}

export const checkRole = (levelRequire: Role) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
}
