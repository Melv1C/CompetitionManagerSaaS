import { z } from 'zod';
import { Date$, Id$ } from './Base';

export const Json$ = z.record(z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.string()), z.array(z.number()), z.array(z.boolean())]));
export type Json = z.infer<typeof Json$>;

export enum SERVICE {
    REACT = 'react',
    ATHLETES = 'athletes-api',
    CATEGORIES = 'categories-api',
    CLUBS = 'clubs-api',
    COMPETITIONS = 'competitions-api',
    EVENTS = 'events-api',
    OFFERS = 'offers-api',
    USERS = 'users'
}

export enum STATUS {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
}

export const Log$ = z.object({
    id: Id$,
    service: z.nativeEnum(SERVICE),
    status: z.nativeEnum(STATUS),
    message: z.string(),
    date: Date$,
    metadata: Json$.default({}),
});
export type Log = z.infer<typeof Log$>;

export const CreateLog$ = Log$.omit({ id: true, date: true });
export type CreateLog = z.infer<typeof CreateLog$>;