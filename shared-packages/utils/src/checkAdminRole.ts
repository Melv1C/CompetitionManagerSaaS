import { Response } from 'express';
import { AdminFromCompetition, AdminFromCompetiton$, Access } from '@competition-manager/schemas';



const isAdminAuthorized = (admin: AdminFromCompetition, levelRequire: Access) => {
    if (admin.access.includes('owner')) {
        return true;
    }
    return admin.access.includes(levelRequire);
}

export const checkAdminRole = async (levelRequire: Access, userId: number, admins: AdminFromCompetition[], res: Response) => {
    const admin = AdminFromCompetiton$.parse(admins.find(admin => admin.userId === userId));
    if (!admin) {
        res.status(401).send('Unauthorized');
        return false;
    }
    if (!isAdminAuthorized(admin, levelRequire)) {
        res.status(401).send('Unauthorized');
        return false;
    }
    return true;
}
