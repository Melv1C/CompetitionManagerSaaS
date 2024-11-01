import { z } from 'zod';

const GENDER = ['M', 'F'] as const;
export type Gender = typeof GENDER[number];

export const Athlete$ = z.object({
    id: z.number().positive(),
    license: z.number().positive(),
    firstName: z.string(),
    lastName: z.string(),
    bib: z.number().positive(),
    gender: z.enum(GENDER),
    birthdate: z.string().datetime(),
    club: z.string(),
});

export type Athlete = z.infer<typeof Athlete$>;