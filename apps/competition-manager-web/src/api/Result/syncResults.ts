import { api } from '@/utils/api';
import { Eid, Result$ } from '@competition-manager/schemas';

export const syncResults = async (competitionEid: Eid, timestamp: number) => {
    const { data } = await api.get(
        `/results/competitions/${competitionEid}/since/${timestamp}`
    );
    return Result$.array().parse(data);
};
