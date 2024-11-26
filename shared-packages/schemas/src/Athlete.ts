import { z } from 'zod';

export const GENDER = ['M', 'F'] as const;
export type Gender = typeof GENDER[number];

const Json$ = z.record(z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.string()), z.array(z.number()), z.array(z.boolean())]));

export type Json = z.infer<typeof Json$>;

export const Athlete$ = z.object({
    id: z.number().positive(),
    license: z.string().min(1),
    firstName: z.string(),
    lastName: z.string(),
    bib: z.number().positive(),
    gender: z.enum(GENDER),
    birthdate: z.coerce.date().min(new Date('1900-01-01')),
    club: z.string(),
    metadata: Json$.default({}),
    competitionId: z.number().positive().nullable().default(null),
});

export type Athlete = z.infer<typeof Athlete$>;