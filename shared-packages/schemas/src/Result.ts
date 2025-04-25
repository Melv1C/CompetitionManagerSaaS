import z from 'zod';
import { AthleteWithoutClub$ } from './Athlete';
import { Bib$, Boolean$, Date$, Eid$, Id$, License$ } from './Base';
import { Club$ } from './Club';
import { CompetitionEvent$, competitionEventInclude } from './CompetitionEvent';

export enum AttemptValue {
    X = 'X',
    O = 'O',
    PASS = '-',
    R = 'r',
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

export const ResultDetail$ = z.object({
    id: Id$,
    tryNumber: z.coerce.number(),
    value: z.coerce.number(),
    attempts: z.nativeEnum(AttemptValue).array().max(3).default([]),
    wind: z.coerce.number().nullish(),
    isBest: Boolean$.default(false),
    isOfficialBest: Boolean$.default(false),
});
export type ResultDetail = z.infer<typeof ResultDetail$>;

// Schema for creating a new result detail
export const CreateResultDetail$ = ResultDetail$.omit({
    id: true,
    // Fields that will be auto-generated
    isBest: true,
    isOfficialBest: true,
});
export type CreateResultDetail = z.infer<typeof CreateResultDetail$>;

export const Result$ = z.object({
    id: Id$,
    eid: Eid$,
    competitionEvent: CompetitionEvent$,
    athlete: AthleteWithoutClub$,
    bib: Bib$,
    club: Club$,

    heat: z.coerce.number().default(1),
    initialOrder: z.coerce.number(),
    tempOrder: z.coerce.number(),
    finalOrder: z.coerce.number().nullish(),

    value: z.coerce.number().nullish(),
    wind: z.coerce.number().nullish(),
    points: z.coerce.number().int().nonnegative().nullish(),

    details: ResultDetail$.array().default([]),

    // Add timestamp fields for tracking and synchronization
    createdAt: Date$,
    updatedAt: Date$,
});
export type Result = z.infer<typeof Result$>;

export const resultInclude = {
    competitionEvent: {
        include: competitionEventInclude,
    },
    athlete: true,
    club: true,
    details: true,
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
    createdAt: true,
    updatedAt: true,
}).extend({
    competitionEid: Eid$,
    competitionEventEid: Eid$,
    athleteLicense: License$,
    details: CreateResultDetail$.array().default([]),
});
export type CreateResult = z.infer<typeof CreateResult$>;