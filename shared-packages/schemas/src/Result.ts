import z from 'zod';
import { Athlete$ } from './Athlete';
import { Bib$, Boolean$, Eid$, Id$ } from './Base';
import { CompetitionEvent$ } from './CompetitionEvent';
import { Club$ } from './Club';

export enum AttemptValue {
    X = 'X',
    O = 'O',
    PASS = '-',
}


export const ResultDetails$ = z.object({
    id: Id$,
    tryNumber: z.number(),
    value: z.number(),
    attempts: z.nativeEnum(AttemptValue).array().max(3).min(1).nullish(),
    wind: z.number().nullish(),
    isBest: Boolean$.default(false),
    isOfficialBest: Boolean$.default(false),
});
export type ResultDetails = z.infer<typeof ResultDetails$>;

export const Result$ = z.object({
    id: Id$,
    eid: Eid$,
    competitionEvent: CompetitionEvent$,
    //inscription: Inscription$,
    athlete: Athlete$,
    bib: Bib$,
    club: Club$,

    heat: z.number().default(1),
    initialOrder: z.number(),
    tempOrder: z.number(),
    finalOrder: z.number().nullish(),

    value: z.number().nullish(),
    wind: z.number().nullish(),
    points: z.number().int().nonnegative().nullish(),

    details: ResultDetails$.array().default([]),
});
export type Result = z.infer<typeof Result$>;