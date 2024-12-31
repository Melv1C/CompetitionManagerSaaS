import z from 'zod';
import { Abbr$, Id$, Name$ } from './Base';
import { Gender$ } from './Gender';

enum AbbrBaseCategory {
    KAN = 'KAN',
    BEN = 'BEN',
    PUP = 'PUP',
    MIN = 'MIN',
    CAD = 'CAD',
    JUN = 'JUN',
    ESP = 'ESP',
    SEN = 'SEN',
    MAS = 'MAS',
}

enum BaseCategory {
    KANGOUROU = 'Kangourou',
    BENJAMIN = 'Benjamin',
    PUPILLE = 'Pupille',
    MINIME = 'Minime',
    CADET = 'Cadet',
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
});
export type Category = z.infer<typeof Category$>;

export const CreateCategory$ = Category$.omit({ id: true });
export type CreateCategory = z.infer<typeof CreateCategory$>;