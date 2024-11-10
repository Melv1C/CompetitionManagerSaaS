import { useEffect } from "react";

import { useUserToken } from "../GlobalsStates/userToken";
import { api } from "../utils/api";

export const useAutoLogin = () => {
    const [, setUserToken] = useUserToken();

    useEffect(() => {
        const fetchUserToken = async () => {
            try {
                const { data } = await api.get('/users/refresh-token', { withCredentials: true });
                setUserToken(data);
            } catch (error) {
                console.error('Auto login error:', error);
                setUserToken('');
            }
        }

        fetchUserToken();
    }, [setUserToken]);
};
  