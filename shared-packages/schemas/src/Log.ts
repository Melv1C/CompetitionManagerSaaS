import { z } from 'zod';
import { Date$, Id$ } from './Base';

export const basicType$ = z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.string()), z.array(z.number()), z.array(z.boolean())]);
export type basicType = z.infer<typeof basicType$>;
export const Json$ = z.record(basicType$);
export type Json = z.infer<typeof Json$>;

export enum SERVICE {
    REACT = 'react',
    ATHLETES = 'athletes-api',
    CATEGORIES = 'categories-api',
    CLUBS = 'clubs-api',
    COMPETITIONS = 'competitions-api',
    EVENTS = 'events-api',
    OFFERS = 'offers-api',
    USERS = 'users-api'
}

export enum STATUS {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
}

export const logMetadata$ = z.union([
    Json$,
    z.object({
        body: Json$,
        params: Json$,
        query: Json$,
    }).catchall(basicType$),
]);
export type logMetadata = z.infer<typeof logMetadata$>;
  
export const Log$ = z.object({
    id: Id$,
    service: z.nativeEnum(SERVICE),
    status: z.nativeEnum(STATUS),
    message: z.string(),
    date: Date$,
    metadata: logMetadata$.default({}),
});
export type Log = z.infer<typeof Log$>;

export const CreateLog$ = Log$.omit({ id: true, date: true });
export type CreateLog = z.infer<typeof CreateLog$>;