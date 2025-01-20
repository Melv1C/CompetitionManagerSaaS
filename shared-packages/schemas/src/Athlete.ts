import { z } from 'zod';
import { Date$, Id$, License$ } from './Base';
import { Gender$ } from './Gender';
import { Club$ } from './Club';

export enum ONE_DAY_BIB {
    MIN = 9900,
    MAX = 9999,
    NB = MAX - MIN + 1,
}

export const OneDayMetadata$ = z.object({
    license: License$,
    club: z.string(),
});
export type OneDayMetadata = z.infer<typeof OneDayMetadata$>;

export const Athlete$ = z.object({
    id: Id$,
    license: License$,
    // firstName: z.string().min(1, {message: 'First name must be at least 1 characters long'}).max(50, {message: 'First name must be at most 50 characters long'}),
    // lastName: z.string().min(1, {message: 'Last name must be at least 1 characters long'}).max(50, {message: 'Last name must be at most 50 characters long'}),
    firstName: z.string().min(1, 'FirstNameTooShort1').max(50, 'FirstNameTooLong50'),
    lastName: z.string().min(1, 'LastNameTooShort1').max(50, 'LastNameTooLong50'),
    bib: z.number().positive('BibMustBePositive'),
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