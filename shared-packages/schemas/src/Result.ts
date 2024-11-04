import { z } from 'zod';

export const Result$ = z.object({
    date: z.coerce.date().min(new Date('1900-01-01')),
    discipline: z.string(),
    perf: z.number(),
    type: z.string(), //maybe restrict to 'time' | 'distance' | 'points' ect
});

export type Result = z.infer<typeof Result$>;