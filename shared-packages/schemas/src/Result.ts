import z from 'zod';
import { Athlete$, AthleteWithoutClub$ } from './Athlete';
import { Bib$, Boolean$, Eid$, Id$, License$ } from './Base';
import { CompetitionEvent$, competitionEventInclude } from './CompetitionEvent';
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

// Schema for creating a new result detail
export const CreateResultDetails$ = ResultDetails$.omit({
    id: true,
    // Fields that will be auto-generated
    isBest: true,
    isOfficialBest: true,
});
export type CreateResultDetails = z.infer<typeof CreateResultDetails$>;

export const Result$ = z.object({
    id: Id$,
    eid: Eid$,
    competitionEvent: CompetitionEvent$,
    athlete: AthleteWithoutClub$,
    bib: Bib$,
    club: Club$,

    heat: z.coerce.number().default(1),
    initalOrder: z.coerce.number(),
    tempOrder: z.coerce.number(),
    finalOrder: z.coerce.number().nullish(),

    value: z.coerce.number().nullish(),
    wind: z.coerce.number().nullish(),
    points: z.coerce.number().int().nonnegative().nullish(),

    details: ResultDetails$.array().default([]),
});
export type Result = z.infer<typeof Result$>;

export const resultInclude = {
    competitionEvent: {
        include: competitionEventInclude
    },
    athlete: true,
    club: true,
    resultDetails: true
};

// Schema for creating a new result
export const CreateResult$ = Result$.omit({ 
    id: true, 
    eid: true,
    competitionEvent: true,
    athlete: true,
    club: true,
    details: true,
    // Fields that will be auto-generated
    value: true,
    wind: true,
    points: true,
}).extend({
    competitionEid: Eid$,
    competitionEventEid: Eid$,
    athleteLicense: License$,
    details: CreateResultDetails$.array().default([]),
});
export type CreateResult = z.infer<typeof CreateResult$>;

