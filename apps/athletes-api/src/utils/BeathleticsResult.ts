import { z } from 'zod';
import { Date$, EventType } from '@competition-manager/schemas';

export const BeathleticsResult$ = z.object({
    date: Date$,
    discipline: z.string(),
    perf: z.number(),
    type: z.nativeEnum(EventType),
});

export type BeathleticsResult = z.infer<typeof BeathleticsResult$>;