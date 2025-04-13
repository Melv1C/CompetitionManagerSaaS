import { userTokenAtom } from '@/GlobalsStates';
import { Role } from '@competition-manager/schemas';
import { isAuthorized } from '@competition-manager/utils';
import { useAtomValue } from 'jotai';
import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { Loading } from './Loading';

type ProtectedRouteProps = PropsWithChildren<{
    requiredRole: Role;
    redirectPath: string;
}>;

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    requiredRole,
    redirectPath,
    children,
}) => {
    const userToken = useAtomValue(userTokenAtom);

    if (!userToken) return <Loading />; // Wait for userToken to be fetched

    if (userToken === 'NOT_LOGGED' || !isAuthorized(userToken, requiredRole)) {
        return <Navigate to={redirectPath} />;
    }

    return <>{children}</>;
};
