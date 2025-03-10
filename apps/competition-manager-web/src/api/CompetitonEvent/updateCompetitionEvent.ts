import { api } from '@/utils/api';
import {
    CompetitionEvent$,
    Eid,
    UpdateCompetitionEvent,
} from '@competition-manager/schemas';

export const updateCompetitionEvent = async (
    competitionEid: Eid,
    competitionEventEid: Eid,
    competitionEvent: UpdateCompetitionEvent
) => {
    const { data } = await api.put(
        `/competitions/${competitionEid}/events/${competitionEventEid}`,
        competitionEvent
    );
    return CompetitionEvent$.parse(data);
};
