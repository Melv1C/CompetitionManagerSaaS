import { Email, EncodeToken$, Password } from '@competition-manager/schemas';
import { api, apiWithCredentials, setAccessToken } from '../utils/api';

export const login = async (email: Email, password: Password) => {
    console.log('Logging in with email:', email);
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
    const { data } = await apiWithCredentials.get('/users/refresh-token', {
        withCredentials: true,
    });
    const accessToken = EncodeToken$.parse(data);
    setAccessToken(accessToken);
    return accessToken;
};

export const forgotPassword = async (email: Email) => {
    await api.post('/users/forgot-password', { email });
};

export const changePassword = async (
    oldPassword: Password,
    newPassword: Password
) => {
    const { data } = await api.post('/users/change-password', {
        oldPassword,
        newPassword,
    });
    return data;
};

export const resetPassword = async (newPassword: Password, token: string) => {
    const { data } = await api.post(
        '/users/reset-password',
        { newPassword },
        { params: { token } }
    );
    return data;
};

export const resendVerificationEmail = async () => {
    await api.post('/users/resend-verification-email');
};
