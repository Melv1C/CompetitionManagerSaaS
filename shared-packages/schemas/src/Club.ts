import z from 'zod';
import { Id$, Name$, Abbr$ } from './Base';

export const Club$ = z.object({
    id: Id$,
    name: Name$,
    abbr: Abbr$,
    address: z.string().nullish(),
    province: z.string().nullish(),
    fedNumber: z.number().positive().nullish(),
    country: z.string(),
    fedAbbr: z.string().nullish(),

});
export type Club = z.infer<typeof Club$>;
