import { z } from 'zod';
import { Event$ } from './Event';
import { Category$ } from './Category';

export const CompetitionEvent$ = z.object({
    id: z.number().positive(),
    name: z.string(),
    event: Event$,
    schedule: z.coerce.date().min(new Date()),
    categories: z.array(Category$),
    place: z.number().positive().int().optional(),
    parentId: z.number().positive().optional(),
    cost: z.number().nonnegative(),
    isInscriptionOpen: z.boolean().default(true),
});

export type CompetitionEvent = z.infer<typeof CompetitionEvent$>;