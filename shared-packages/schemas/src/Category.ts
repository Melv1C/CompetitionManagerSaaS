import z from 'zod';
import { Abbr$, Id$, Name$ } from './Base';
import { Gender$ } from './Gender';

export enum AbbrBaseCategory {
    KAN = 'KAN',
    BEN = 'BEN',
    PUP = 'PUP',
    MIN = 'MIN',
    CAD = 'CAD',
    SCO = 'SCO',
    JUN = 'JUN',
    ESP = 'ESP',
    SEN = 'SEN',
    MAS = 'MAS',
}

export enum BaseCategory {
    KANGOUROU = 'Kangourou',
    BENJAMIN = 'Benjamin',
    PUPILLE = 'Pupille',
    MINIME = 'Minime',
    CADET = 'Cadet',
    SCOLAIRE = 'Scolaire',
    JUNIOR = 'Junior',
    ESPOIR = 'Espoir',
    SENIOR = 'Senior',
    MASTER = 'Master'
}

export const Category$ = z.object({
    id: Id$,
    abbr: Abbr$,
    name: Name$,
    baseCategory: z.nativeEnum(BaseCategory),
    abbrBaseCategory: z.nativeEnum(AbbrBaseCategory),
    gender: Gender$,
    masterAgeGroup: z.number().positive().nullish(),
    order : z.number().positive(),
});
export type Category = z.infer<typeof Category$>;

export const CreateCategory$ = Category$.omit({ id: true });
export type CreateCategory = z.infer<typeof CreateCategory$>;