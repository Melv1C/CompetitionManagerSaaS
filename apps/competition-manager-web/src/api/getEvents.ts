import { api } from '@/utils/api';
import { Event$ } from '@competition-manager/schemas';

export const getEvents = async () => {
    const { data } = await api.get('/events');
    return Event$.array().parse(data);
};
