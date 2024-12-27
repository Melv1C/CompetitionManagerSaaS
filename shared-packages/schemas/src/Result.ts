import z from 'zod';
import { Athlete$ } from './Athlete';
import { Id$ } from './Base';

export const Result$ = z.object({
    id: Id$,
    athlete: Athlete$,
    perf: z.number().positive(),
    rank: z.number().positive(),
});

export type Result = z.infer<typeof Result$>;