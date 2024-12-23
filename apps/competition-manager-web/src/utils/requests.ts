import { EncodeToken$ } from '@competition-manager/schemas';
import { api } from './api';

export const login = async (email: string, password: string) => {
    const { data } = await api.post('/users/login', { email, password });
    return EncodeToken$.parse(data);
};

export const register = async (email: string, password: string) => {
    const { data } = await api.post('/users/register', { email, password });
    return EncodeToken$.parse(data);
};

export const logout = async () => {
    try {
        await api.post('/users/logout');
    } catch (error) {
        console.error('Sign out error:', error);
    }
};
