import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticatedRequest';
import { prisma } from '@competition-manager/prisma';
import { Admin, Access } from '@competition-manager/schemas/src/Admin';

const isAdminAuthorized = (admin: Admin, levelRequire: Access) => {
    if (admin.access.includes('owner')) {
        return true;
    }
    return admin.access.includes(levelRequire);
}

//need to be used after authMiddleware
export const adminAuthMiddleware = (levelRequire: Access) => async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        res.status(401).send('Unauthorized');
        return;
    }
    const competitionEid = req.params.competitionEid;
    const competition = await prisma.competition.findUnique({
        where: {
            eid: competitionEid
        },
        select: {
            admins: true
        }
    });
    if (!competition) {
        res.status(404).send('Competition not found');
        return;
    }
    const admin = competition.admins.find(admin => admin.userId === req.user!.id) as Admin;
    if (!admin) {
        res.status(401).send('Unauthorized');
        return;
    }
    if (!isAdminAuthorized(admin, levelRequire)) {
        res.status(401).send('Unauthorized');
        return;
    }
    
    
    next();
}
