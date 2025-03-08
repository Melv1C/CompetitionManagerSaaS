import { api } from '@/utils/api';
import { Club$ } from '@competition-manager/schemas';

export const getClubs = async () => {
    const { data } = await api.get('/clubs');
    return Club$.array().parse(data);
};
