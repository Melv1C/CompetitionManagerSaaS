import { useEffect } from "react";

import { userTokenAtom } from "../GlobalsStates";
import { decodeToken } from "../utils/decodeToken";

import { env, isNodeEnv } from "../env";
import { getRefreshToken } from "../api";
import { setAccessToken } from "../utils/api";
import { useSetAtom } from "jotai";
import { NODE_ENV } from "@competition-manager/schemas";

export const useAutoLogin = () => {
    const setUserToken = useSetAtom(userTokenAtom);

    useEffect(() => {
        if (isNodeEnv(NODE_ENV.LOCAL)) {
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
  