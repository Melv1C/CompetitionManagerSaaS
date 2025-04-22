import {
    Athlete,
    Competition,
    CompetitionEvent,
    DisplayInscription,
    Inscription,
    Result,
    TokenData,
} from '@competition-manager/schemas';
import { atom } from 'jotai';

export const userTokenAtom = atom<TokenData | 'NOT_LOGGED' | null>(null);

// Store the current competition
export const competitionAtom = atom<Competition | null>(null);
// Store the inscriptions of the current competition
export const inscriptionsAtom = atom<DisplayInscription[] | null>(null);
// Store the inscriptions of the current user
export const userInscriptionsAtom = atom<Inscription[] | null>(null);
// Store the inscriptions get as an admin
export const adminInscriptionsAtom = atom<Inscription[] | null>(null);

// Store the data of the inscription form
type InscriptionData = {
    athlete?: Athlete;
    inscriptionsData: {
        eid: Inscription['eid'];
        competitionEvent: Inscription['competitionEvent'];
        record?: Inscription['record'];
        paid: Inscription['paid'];
    }[];
};

export const inscriptionDataAtom = atom<InscriptionData>({
    athlete: undefined,
    inscriptionsData: [],
});

// Store the data of the competition event form
type CompetitionEventData = {
    eid?: CompetitionEvent['eid'];
    event?: CompetitionEvent['event'];
    categories: CompetitionEvent['categories'];
    name: CompetitionEvent['name'];
    schedule?: CompetitionEvent['schedule'];
    place?: CompetitionEvent['place'];
    cost: CompetitionEvent['cost'];
    children: {
        eid?: CompetitionEvent['eid'];
        event?: CompetitionEvent['event'];
        name: CompetitionEvent['name'];
        schedule?: CompetitionEvent['schedule'];
    }[];
};

export const competitionEventDataAtom = atom<CompetitionEventData>({
    eid: undefined,
    event: undefined,
    categories: [],
    name: '',
    schedule: undefined,
    place: undefined,
    cost: 0,
    children: [],
});

export const resultsAtom = atom<Result[] | null>(null);