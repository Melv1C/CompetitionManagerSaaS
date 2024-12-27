import { Response } from 'express';
import { ACCESS, BaseAdmin } from '@competition-manager/schemas';



const isAdminAuthorized = (admin: BaseAdmin, levelRequire: ACCESS) => {
    if (admin.access.includes(ACCESS.OWNER)) {
        return true;
    }
    return admin.access.includes(levelRequire);
}

export const checkAdminRole = async (levelRequire: ACCESS, userId: number, admins: BaseAdmin[], res: Response) => {
    const admin = admins.find(admin => admin.userId === userId);
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
