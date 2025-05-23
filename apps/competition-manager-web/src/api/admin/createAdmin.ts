import { api } from '@/utils/api';
import { Admin$, CreateAdmin, Eid } from '@competition-manager/schemas';
import { AxiosError } from 'axios';

export const createAdmin = async (eid: Eid, admin: CreateAdmin) => {
    try {
        const { data } = await api.post(`/competitions/${eid}/admins`, admin);
        console.log('data', data);
        return Admin$.parse(data);
    } catch (error: unknown) {
        switch ((error as AxiosError).response?.data) {
            case 'User not found':
                return new Error('User not found');
            case 'User is already an admin':
                return new Error('User is already an admin');
            default:
                return new Error('Failed to create admin');
        }
    }
};
