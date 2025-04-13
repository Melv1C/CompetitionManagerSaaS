import { userTokenAtom } from '@/GlobalsStates';
import { Role } from '@competition-manager/schemas';
import { isAuthorized } from '@competition-manager/utils';
import { useAtomValue } from 'jotai';

export const useRoles = () => {
    const userToken = useAtomValue(userTokenAtom);

    const isNotLogged = userToken === 'NOT_LOGGED';

    const isLogged =
        userToken !== null &&
        userToken !== 'NOT_LOGGED' &&
        isAuthorized(userToken, Role.UNCONFIRMED_USER);

    const isUser =
        userToken !== null &&
        userToken !== 'NOT_LOGGED' &&
        isAuthorized(userToken, Role.USER);

    const isAdmin =
        userToken !== null &&
        userToken !== 'NOT_LOGGED' &&
        isAuthorized(userToken, Role.ADMIN);

    const isClub =
        userToken !== null &&
        userToken !== 'NOT_LOGGED' &&
        isAuthorized(userToken, Role.CLUB);

    const isSuperAdmin =
        userToken !== null &&
        userToken !== 'NOT_LOGGED' &&
        isAuthorized(userToken, Role.SUPERADMIN);

    return {
        isNotLogged,
        isLogged,
        isUser,
        isSuperAdmin,
        isClub,
        isAdmin,
    };
};
