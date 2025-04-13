import { api } from '@/utils/api';
import {
    CompetitionEvent$,
    CreateCompetitionEvent,
    Eid,
} from '@competition-manager/schemas';

export const createCompetitionEvent = async (
    competitionEid: Eid,
    competitionEvent: CreateCompetitionEvent
) => {
    const { data } = await api.post(
        `/competitions/${competitionEid}/events`,
        competitionEvent
    );
    return CompetitionEvent$.parse(data);
};
