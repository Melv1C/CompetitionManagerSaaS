import z from 'zod';
import { Abbr$, Id$, Name$ } from './Base';

export const Club$ = z.object({
    id: Id$,
    name: Name$,
    abbr: Abbr$,
    address: z.string().optional(),
    province: z.string().optional(),
    fedNumber: z.number().optional(),
    country: z.string(),
    fedAbbr: z.string().optional(),

});
export type Club = z.infer<typeof Club$>;
