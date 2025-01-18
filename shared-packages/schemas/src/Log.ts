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
    USERS = 'users-api'
}

export enum LEVEL {
    error = "error",
    warn =  "warn",
    info = "info",
    http = "http",
    verbose = "verbose",
    debug = "debug",
    silly = "silly"
}
  
export const Log$ = z.object({
    id: Id$,
    level: z.nativeEnum(LEVEL),
    service: z.nativeEnum(SERVICE),
    path: z.string().nullish(),
    status: z.number().positive().nullish(),
    userId: Id$.nullish(),
    message: z.string(),
    date: Date$,
    metadata: z.any().default({}),
});
export type Log = z.infer<typeof Log$>;

export const CreateLog$ = Log$.omit({ id: true, date: true});
export type CreateLog = z.infer<typeof CreateLog$>;

export const LogInfo$ = CreateLog$.omit({ service: true });
export type LogInfo = z.infer<typeof LogInfo$>;