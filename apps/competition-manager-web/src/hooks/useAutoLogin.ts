import { useEffect } from "react";

import { useUserToken } from "../GlobalsStates";
import { decodeToken } from "../utils/decodeToken";

import { env } from "../env";
import { getRefreshToken } from "../api";

export const useAutoLogin = () => {
    const [, setUserToken] = useUserToken();

    useEffect(() => {
        if (env.VITE_NODE_ENV === 'local') {
            setUserToken(decodeToken(env.VITE_LOCAL_ACCESS_TOKEN!));
            return;
        }

        const fetchUserToken = async () => {
            try {
                setUserToken(decodeToken(await getRefreshToken()));
            } catch (error) {
                setUserToken('NOT_LOGGED');
            }
        }

        fetchUserToken();
    }, [setUserToken]);
};
  