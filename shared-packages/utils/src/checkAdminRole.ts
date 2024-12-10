import { Response } from 'express';
import { BaseAdmin, BaseAdmin$, Access } from '@competition-manager/schemas';



const isAdminAuthorized = (admin: BaseAdmin, levelRequire: Access) => {
    if (admin.access.includes('owner')) {
        return true;
    }
    return admin.access.includes(levelRequire);
}

export const checkAdminRole = async (levelRequire: Access, userId: number, admins: BaseAdmin[], res: Response) => {
    const admin = BaseAdmin$.parse(admins.find(admin => admin.userId === userId));
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
