import { z } from 'zod';
import { Bib$, Date$, Id$, License$ } from './Base';
import { Gender$ } from './Gender';
import { Club$ } from './Club';

export const AthleteKey$ = z.string().min(3, {message: 'SearchValueTooShort3'}).max(50, {message: 'SearchValueTooLong50'});
export type AthleteKey = z.infer<typeof AthleteKey$>;

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
    firstName: z.string().min(1, 'FirstNameTooShort1').max(50, 'FirstNameTooLong50'),
    lastName: z.string().min(1, 'LastNameTooShort1').max(50, 'LastNameTooLong50'),
    bib: Bib$,
    gender: Gender$,
    birthdate: Date$,
    club: Club$,
    metadata: z.union([OneDayMetadata$, z.object({})]).default({}),
});
export type Athlete = z.infer<typeof Athlete$>;

export const athleteInclude = {
    club: true,
};

export const AthleteWithoutClub$ = Athlete$.omit({club: true});
export type AthleteWithoutClub = z.infer<typeof AthleteWithoutClub$>;

export const CreateAthlete$ = AthleteWithoutClub$.omit({
    id: true,
}).extend({
    clubAbbr: z.string().default('NA'),
});
export type CreateAthlete = z.infer<typeof CreateAthlete$>;

export const CreateOneDayAthlete$ = CreateAthlete$.omit({
    bib: true,
    license: true,
});
export type CreateOneDayAthlete = z.infer<typeof CreateOneDayAthlete$>;