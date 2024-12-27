import { z } from 'zod';
import { Date$, Gender$, Id$, License$, Name$ } from '.';

const Json$ = z.record(z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.string()), z.array(z.number()), z.array(z.boolean())]));

export type Json = z.infer<typeof Json$>;

export const Athlete$ = z.object({
    id: Id$,
    license: License$,
    firstName: Name$,
    lastName: Name$,
    bib: z.number().positive(),
    gender: Gender$,
    birthdate: Date$,
    club: z.string().nullable().default(null),
    metadata: Json$.default({}),
    competitionId: Id$.optional(),
});
export type Athlete = z.infer<typeof Athlete$>;

export const OneDayMetadata$ = z.object({
    license: z.number().positive(),
    club: z.string(),
});
export type OneDayMetadata = z.infer<typeof OneDayMetadata$>;

export const OneDayAthlete$ = Athlete$.pick({
    firstName: true,
    lastName: true,
    gender: true,
    birthdate: true,
    club: true,
    metadata: true,
});
export type OneDayAthlete = z.infer<typeof OneDayAthlete$>;
