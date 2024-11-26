import z from 'zod';
import { Gender$ } from './Gender';

export const SIMPLE_CATEGORY = ['BEN', 'PUP', 'MIN', 'CAD', 'JUN', 'SEN', 'MAS'] as const;
export type SimpleCategory = typeof SIMPLE_CATEGORY[number];


export const Category$ = z.object({
    id: z.number().positive(),
    abbr: z.string(),
    name: z.string(),
    simpleCategory: z.enum(SIMPLE_CATEGORY),
    gender: Gender$,
    masterAgeGroup: z.number().positive().optional(),
});

export type Category = z.infer<typeof Category$>;
