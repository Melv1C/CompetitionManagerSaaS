import { api } from '@/utils/api';
import { CreateResult, Result$ } from '@competition-manager/schemas';

export const upsertResults = async (results: CreateResult[]) => {
    const { data } = await api.post(`/results`, results);
    return Result$.array().parse(data);
};
