import { api } from '@/utils/api';
import {
    Eid,
    Result,
    Result$,
    UpsertResult,
    UpsertResultType,
} from '@competition-manager/schemas';

export const upsertResults = async (
    competitionEid: Eid,
    type: UpsertResultType,
    results: UpsertResult[]
): Promise<Result[]> => {
    const { data } = await api.post('/results', results, {
        params: {
            competitionEid,
            type,
        },
    });
    return Result$.array().parse(data);
};
