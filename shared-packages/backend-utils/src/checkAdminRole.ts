import { Response } from 'express';
import { Access, BaseAdmin } from '@competition-manager/schemas';
import { TFunction } from 'i18next';

const isAdminAuthorized = (admin: BaseAdmin, levelRequire: Access) => {
    if (admin.access.includes(Access.OWNER)) {
        return true;
    }
    return admin.access.includes(levelRequire);
}

export const checkAdminRole = (
    levelRequire: Access, 
    userId: number, 
    admins: BaseAdmin[], 
    res: Response, 
    t: TFunction<"translation", undefined>
) => {
    const admin = admins.find(admin => admin.userId === userId);
    if (!admin) {
        res.status(401).send(t('errors.unauthorized'));
        return false;
    }
    if (!isAdminAuthorized(admin, levelRequire)) {
        res.status(401).send(t('errors.unauthorized'));
        return false;
    }
    return true;
}
