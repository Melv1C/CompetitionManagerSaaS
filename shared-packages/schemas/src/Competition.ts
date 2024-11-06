import { z } from 'zod';
import { Athlete$ } from './Athlete';

export const Competition$ = z.object({
    id: z.number().positive(),
    eid: z.string().min(1),
    name: z.string().min(1),
    oneDayAthletes: z.array(Athlete$).optional(),
});

export type Competition = z.infer<typeof Competition$>;