import { z } from 'zod';
import { Date$, Id$, License$, Name$ } from './Base';
import { Gender$ } from './Gender';
import { Club$ } from './Club';

// unuse but keep if needed
const Json$ = z.record(z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.string()), z.array(z.number()), z.array(z.boolean())]));
export type Json = z.infer<typeof Json$>;

export enum ONE_DAY_BIB {
    MIN = 9900,
    MAX = 9999,
    NB = MAX - MIN + 1,
}

export const OneDayMetadata$ = z.object({
    license: z.number().positive(),
    club: z.string(),
});
export type OneDayMetadata = z.infer<typeof OneDayMetadata$>;

export const Athlete$ = z.object({
    id: Id$,
    license: License$,
    firstName: Name$,
    lastName: Name$,
    bib: z.number().positive(),
    gender: Gender$,
    birthdate: Date$,
    club: Club$,
    metadata: z.union([OneDayMetadata$, z.object({})]).default({}),
});
export type Athlete = z.infer<typeof Athlete$>;

export const BaseAthlete$ = Athlete$.omit({ 
    id: true,
    club: true,
});
export type BaseAthlete = z.infer<typeof BaseAthlete$>;

export const CreateAthlete$ = BaseAthlete$.extend({
    clubAbbr: z.string().default('NA'),
});
export type CreateAthlete = z.infer<typeof CreateAthlete$>;

export const CreateOneDayAthlete$ = CreateAthlete$.omit({
    bib: true,
    license: true,
});
export type CreateOneDayAthlete = z.infer<typeof CreateOneDayAthlete$>;