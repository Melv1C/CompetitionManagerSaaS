import { Role } from "@competition-manager/schemas";
import { useUserToken } from "../GlobalsStates";

export const useRoles = () => {
    const [userToken] = useUserToken();

    const isNotLogged = userToken === 'NOT_LOGGED';

    const isLogged = userToken !== null && userToken !== 'NOT_LOGGED';

    const isSuperAdmin = isLogged && userToken.role === Role.SUPERADMIN;

    const isClub = isSuperAdmin || (isLogged && userToken.role === Role.CLUB);

    const isAdmin = isClub || (isLogged && userToken.role === Role.ADMIN);

    return {
        isNotLogged,
        isLogged,
        isSuperAdmin,
        isClub,
        isAdmin
    }
}



