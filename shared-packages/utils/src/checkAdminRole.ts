import { Response } from 'express';
import { Access, BaseAdmin } from '@competition-manager/schemas';



const isAdminAuthorized = (admin: BaseAdmin, levelRequire: Access) => {
    if (admin.access.includes(Access.OWNER)) {
        return true;
    }
    return admin.access.includes(levelRequire);
}

export const checkAdminRole = async (levelRequire: Access, userId: number, admins: BaseAdmin[], res: Response) => {
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
