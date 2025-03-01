import { userTokenAtom } from '@/GlobalsStates';
import { decodeToken } from '../utils/decodeToken';

import { getRefreshToken } from '@/api';
import { NODE_ENV } from '@competition-manager/schemas';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { env, isNodeEnv } from '../env';
import { setAccessToken } from '../utils/api';

export const useAutoLogin = () => {
    const [userToken, setUserToken] = useAtom(userTokenAtom);

    const fetchUserToken = async () => {
        try {
            if (isNodeEnv(NODE_ENV.LOCAL)) {
                setAccessToken(env.VITE_LOCAL_ACCESS_TOKEN!);
                setUserToken(decodeToken(env.VITE_LOCAL_ACCESS_TOKEN!));
                return;
            }
            setUserToken(decodeToken(await getRefreshToken()));
        } catch (error) {
            console.error('Failed to fetch user token', error);
            setUserToken('NOT_LOGGED');
        }
    };

    useEffect(() => {
        if (userToken === null) {
            fetchUserToken();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        fetchUserToken,
    };
};
