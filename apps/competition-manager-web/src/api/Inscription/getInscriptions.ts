import { api } from '@/utils/api';
import { DisplayInscription$, Eid } from '@competition-manager/schemas';

export const getInscriptions = async (competitionEid: Eid) => {
    const { data } = await api.get(
        `/competitions/${competitionEid}/inscriptions`
    );
    return DisplayInscription$.array().parse(data);
};
