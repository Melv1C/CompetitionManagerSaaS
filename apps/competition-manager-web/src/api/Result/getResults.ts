import { api } from '@/utils/api';
import { Eid, Result$ } from '@competition-manager/schemas';

export const getResults = async (competitionEid : Eid) => {
    const { data } = await api.get(`/results/competitions/${competitionEid}`);
    return Result$.array().parse(data);
};
