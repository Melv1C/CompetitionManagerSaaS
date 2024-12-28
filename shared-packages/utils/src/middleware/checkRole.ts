import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../jwtToken';
import { AuthenticatedRequest, UserFromToken } from './authenticatedRequest';
import { Role, RoleLevel } from '@competition-manager/schemas';
import { Key } from './parseRequest';

const isAuthorized = (user: UserFromToken, levelRequire: Role) => {
    return RoleLevel[user.role] >= RoleLevel[levelRequire];
}

//if use req[key][needRole] is a boolean to now if the role is required
export const checkRole = (levelRequire: Role, key: Key = Key.Query, needRole: string = "") => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (needRole) {
        if (!req[key][needRole]) {
            next();
            return;
        }
    }
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
