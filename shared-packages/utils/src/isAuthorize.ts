import { UserFromToken } from './middleware/authenticatedRequest';
import { Role, RoleLevel } from '@competition-manager/schemas';

export const isAuthorized = (user: UserFromToken, levelRequire: Role) => {
    return RoleLevel[user.role] >= RoleLevel[levelRequire];
}