import { z } from 'zod';
import { Event$ } from './Event';
import { Category$ } from './Category';
import { Result$ } from './Result';

export const CompetitionEvent$ = z.object({
    id: z.number().positive(),
    name: z.string(),
    event: Event$,
    schedule: z.coerce.date().min(new Date()),
    categories: z.array(Category$),
    nbMax: z.number().positive().optional(),
    results: z.array(Result$).optional(),
    subEvents: z.array(z.lazy((): any => CompetitionEvent$)).optional(),
    cost: z.number().positive().optional(),
});

export type CompetitionEvent = z.infer<typeof CompetitionEvent$>;