import { EncodeToken$ } from '@competition-manager/schemas';
import { api, apiWithCredentials, setAccessToken } from '../utils/api';

export const login = async (email: string, password: string) => {
    const { data } = await api.post('/users/login', { email, password });
    const accessToken = EncodeToken$.parse(data);
    setAccessToken(accessToken);
    return accessToken;
};

export const register = async (email: string, password: string) => {
    const { data } = await api.post('/users/register', { email, password });
    const accessToken = EncodeToken$.parse(data);
    setAccessToken(accessToken);
    return accessToken;
};

export const logout = async () => {
    try {
        await api.post('/users/logout');
    } catch (error) {
        console.error('Sign out error:', error);
    }
};

export const getRefreshToken = async () => {
    const { data } = await apiWithCredentials.get('/users/refresh-token', { withCredentials: true });
    const accessToken = EncodeToken$.parse(data);
    setAccessToken(accessToken);
    return accessToken;
};


