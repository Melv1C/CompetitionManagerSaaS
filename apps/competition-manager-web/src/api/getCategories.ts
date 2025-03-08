import { api } from '@/utils/api';
import { Category$ } from '@competition-manager/schemas';

export const getCategories = async () => {
    const { data } = await api.get('/categories');
    return Category$.array().parse(data);
};
