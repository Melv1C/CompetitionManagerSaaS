import z from 'zod';
import { Abbr$, Id$, Name$ } from './Base';

export const Club$ = z.object({
    id: Id$,
    name: Name$,
    abbr: Abbr$,
    address: z.string().optional(),
});

export type Club = z.infer<typeof Club$>;
