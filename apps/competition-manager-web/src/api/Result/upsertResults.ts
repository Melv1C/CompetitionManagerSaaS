import { api } from '@/utils/api';
import { CreateResult, Result$ } from '@competition-manager/schemas';

// Define the API function separately for both direct calls and React Query
export const upsertResults = async (results: CreateResult[]) => {
    console.log('upsertResults', results);
    const { data } = await api.post(`/results`, results);
    return Result$.array().parse(data);
};
