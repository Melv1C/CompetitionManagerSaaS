import { Email, EncodeToken$, Password } from '@competition-manager/schemas';
import { api, apiWithCredentials, setAccessToken } from '../utils/api';

export const login = async (email: Email, password: Password) => {
    const { data } = await api.post('/users/login', { email, password });
    const accessToken = EncodeToken$.parse(data);
    setAccessToken(accessToken);
    return accessToken;
};

export const register = async (email: Email, password: Password) => {
    const { data } = await api.post('/users/register', { email, password });
    const accessToken = EncodeToken$.parse(data);
    setAccessToken(accessToken);
    return accessToken;
};

export const logout = async () => {
    await api.post('/users/logout');
};

export const getRefreshToken = async () => {
    const { data } = await apiWithCredentials.get('/users/refresh-token', { withCredentials: true });
    const accessToken = EncodeToken$.parse(data);
    setAccessToken(accessToken);
    return accessToken;
};

export const resetPassword = async (token: string, newPassword: Password) => {
    const { data } = await api.post('/users/reset-password', { newPassword }, { params: { token } });
    return data;
}


