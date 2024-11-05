import { z } from 'zod';
import { EVENT_TYPE } from './Event';

export const BeathleticsResult$ = z.object({
    date: z.coerce.date().min(new Date('1900-01-01')),
    discipline: z.string(),
    perf: z.number(),
    type: z.enum(EVENT_TYPE),
});

export type BeathleticsResult = z.infer<typeof BeathleticsResult$>;