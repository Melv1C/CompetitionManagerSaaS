import { api } from '@/utils/api';
import { Competition, Competition$, Eid } from '@competition-manager/schemas';

export const getCompetition = async (
    eid: Eid,
    isAdmin?: boolean
): Promise<Competition> => {
    const { data } = await api.get(`/competitions/${eid}`, {
        params: { isAdmin },
    });
    return Competition$.parse(data);
};
