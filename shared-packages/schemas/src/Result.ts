import z from 'zod';
import { Athlete$ } from './Athlete';
import { Bib$, Boolean$, Eid$, Id$ } from './Base';
import { CompetitionEvent$ } from './CompetitionEvent';
import { Club$ } from './Club';

export const ResultDetails$ = z.object({
    id: Id$,
    //eid: Eid$, pas utile je pense car on n'aura pas te route pour les détails seulement
    trynum: z.number(),
    isBest: Boolean$.default(false),
isOfficialBest: Boolean$.default(false),
    value: z.number(),
    result: z.string(),
    wind: z.string().nullish(), // or string ?
});
export type ResultDetails = z.infer<typeof ResultDetails$>;

export const Result$ = z.object({
    id: Id$,
    eid: Eid$,
    //competitionId: Id$, pas nécessaire je pense mais il faut la relation en db
    competitionEvent: CompetitionEvent$,
    athlete: Athlete$,
    bib: Bib$,
    club: Club$,

    heat: z.number(),
    initialOrder: z.number(),
    tempOrder: z.number(),
    finalOrder: z.number(),

    value: z.number(),
    result: z.string(),
    wind: z.string().nullish(), // or string ?
    points: z.number().nullish(),

    details: ResultDetails$.array(),
});
export type Result = z.infer<typeof Result$>;