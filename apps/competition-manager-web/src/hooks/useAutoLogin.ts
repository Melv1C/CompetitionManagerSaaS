import { useEffect } from "react";

import { userTokenAtom } from "../GlobalsStates";
import { decodeToken } from "../utils/decodeToken";

import { env } from "../env";
import { getRefreshToken } from "../api";
import { setAccessToken } from "../utils/api";
import { useSetAtom } from "jotai";

export const useAutoLogin = () => {
    const setUserToken = useSetAtom(userTokenAtom);

    useEffect(() => {
        if (env.VITE_NODE_ENV === 'local') {
            setAccessToken(env.VITE_LOCAL_ACCESS_TOKEN!);
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
  