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

export enum ResultCode {
    DNF = -1,
    DQ = -2,
    DNS = -3,
    NM = -4,
}

export enum ResultDetailCode {
    X = -1,
    PASS = -2,
    R = -3,
}

export const ResultDetails$ = z.object({
    id: Id$,
    tryNumber: z.coerce.number(),
    value: z.coerce.number(),
    attempts: z.nativeEnum(AttemptValue).array().max(3).min(1).nullish(),
    wind: z.coerce.number().nullish(),
    isBest: Boolean$.default(false),
    isOfficialBest: Boolean$.default(false),
});
export type ResultDetails = z.infer<typeof ResultDetails$>;

export const Result$ = z.object({
    id: Id$,
    eid: Eid$,
    competitionEvent: CompetitionEvent$,
    athlete: Athlete$,
    bib: Bib$,
    club: Club$,

    heat: z.coerce.number().default(1),
    initialOrder: z.coerce.number(),
    tempOrder: z.coerce.number(),
    finalOrder: z.coerce.number().nullish(),

    value: z.coerce.number().nullish(),
    wind: z.coerce.number().nullish(),
    points: z.coerce.number().int().nonnegative().nullish(),

    details: ResultDetails$.array().default([]),
});
export type Result = z.infer<typeof Result$>;