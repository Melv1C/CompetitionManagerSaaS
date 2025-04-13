import { api } from '@/utils/api';
import {
    Competition$,
    Eid,
    UpdateCompetition,
    UpdateCompetition$,
} from '@competition-manager/schemas';

export const updateCompetition = async (
    competitionEid: Eid,
    competition: UpdateCompetition
) => {
    const { data } = await api.put(
        `/competitions/${competitionEid}`,
        UpdateCompetition$.parse(competition)
    );
    return Competition$.parse(data);
};
