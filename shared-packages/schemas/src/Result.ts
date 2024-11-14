import z from 'zod';
import { Athlete$ } from './Athlete';



export const Result$ = z.object({
    id: z.number().positive(),
    athlete: Athlete$,
    perf: z.number().positive(),
    rank: z.number().positive(),
});

export type Result = z.infer<typeof Result$>;