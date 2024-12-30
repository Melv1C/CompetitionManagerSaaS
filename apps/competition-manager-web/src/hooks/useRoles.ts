import { Role } from "@competition-manager/schemas";
import { useAtomValue } from "jotai";
import { userTokenAtom } from "../GlobalsStates";

export const useRoles = () => {
    const userToken = useAtomValue(userTokenAtom);

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



