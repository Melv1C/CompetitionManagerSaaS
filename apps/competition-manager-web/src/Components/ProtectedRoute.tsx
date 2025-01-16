import { useAtomValue } from "jotai";
import { PropsWithChildren } from "react"
import { userTokenAtom } from "../GlobalsStates";
import { Role } from "@competition-manager/schemas";
import { isAuthorized } from "@competition-manager/utils";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren<{
    requiredRole: Role;
    redirectPath: string;
}>;

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    requiredRole,
    redirectPath,
    children 
}) => {
    const userToken = useAtomValue(userTokenAtom);

    if (!userToken) throw new Error('UserToken is not defined');

    if (userToken === 'NOT_LOGGED' || !isAuthorized(userToken, requiredRole)) {
        return <Navigate to={redirectPath} />;
    }

    return <>{children}</>;

}


