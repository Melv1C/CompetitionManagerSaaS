import z from 'zod';
import { Abbr$, Id$, Name$ } from './Base';
import { Gender$ } from './Gender';

enum SimpleCategory {
    BEN = 'BEN',
    PUP = 'PUP',
    MIN = 'MIN',
    CAD = 'CAD',
    JUN = 'JUN',
    SEN = 'SEN',
    MAS = 'MAS',
}

export const Category$ = z.object({
    id: Id$,
    abbr: Abbr$,
    name: Name$,
    simpleCategory: z.nativeEnum(SimpleCategory),
    gender: Gender$,
    masterAgeGroup: z.number().positive().optional(),
});

export type Category = z.infer<typeof Category$>;
