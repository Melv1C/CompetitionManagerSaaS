import { userTokenAtom } from "../GlobalsStates";
import { decodeToken } from "../utils/decodeToken";

import { env, isNodeEnv } from "../env";
import { getRefreshToken } from "../api";
import { setAccessToken } from "../utils/api";
import { useAtom } from "jotai";
import { NODE_ENV } from "@competition-manager/schemas";
import { useEffect } from "react";

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
            setUserToken('NOT_LOGGED');
        }
    };

    useEffect(() => {
        if (userToken === null) {
            fetchUserToken();
        }
    }, []);

    return {
        fetchUserToken,
    }
};
  