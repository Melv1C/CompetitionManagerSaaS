import { useEffect } from "react";

import { useUserToken } from "../GlobalsStates";
import { api } from "../utils/api";
import { decodeToken } from "../utils/decodeToken";

import { env } from "../env";

export const useAutoLogin = () => {
    const [, setUserToken] = useUserToken();

    useEffect(() => {

        if (env.VITE_NODE_ENV === 'local') {
            setUserToken(decodeToken(env.VITE_LOCAL_ACCESS_TOKEN!));
            return;
        }

        const fetchUserToken = async () => {
            try {
                const { data } = await api.get('/users/refresh-token', { withCredentials: true });
                setUserToken(decodeToken(data.token));
            } catch (error) {
                setUserToken('NOT_LOGGED');
            }
        }

        fetchUserToken();
    }, [setUserToken]);
};
  