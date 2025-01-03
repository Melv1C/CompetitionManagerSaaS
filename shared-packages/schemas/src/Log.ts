import { z } from 'zod';
import { Date$, Id$ } from './Base';

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
});
export type Log = z.infer<typeof Log$>;