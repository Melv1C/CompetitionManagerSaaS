import { Role, RoleLevel, TokenData } from '@competition-manager/schemas';

export const isAuthorized = (user: TokenData, levelRequire: Role) => {
    return RoleLevel[user.role] >= RoleLevel[levelRequire];
}