import { useUserToken } from "../GlobalsStates";

export const useRoles = () => {
    const [userToken] = useUserToken();

    const isNotLogged = userToken === 'NOT_LOGGED';

    const isLogged = userToken !== null && userToken !== 'NOT_LOGGED';

    const isSuperAdmin = isLogged && userToken.role === 'superadmin';

    const isClub = isSuperAdmin || (isLogged && userToken.role === 'club');

    const isAdmin = isClub || (isLogged && userToken.role === 'admin');

    return {
        isNotLogged,
        isLogged,
        isSuperAdmin,
        isClub,
        isAdmin
    }
}



