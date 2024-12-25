import { z } from 'zod';
import { Gender$ } from './Gender';

const Json$ = z.record(z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.string()), z.array(z.number()), z.array(z.boolean())]));

export type Json = z.infer<typeof Json$>;

export const Athlete$ = z.object({
    id: z.number().positive(),
    license: z.number().min(1),
    firstName: z.string(),
    lastName: z.string(),
    bib: z.number().positive(),
    gender: Gender$,
    birthdate: z.coerce.date().min(new Date('1900-01-01')),
    club: z.string(),
    metadata: Json$.default({}),
    competitionId: z.number().positive().nullable().default(null),
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

export const listAthlete$ = z.array(Athlete$);
export type ListAthlete = z.infer<typeof listAthlete$>;


