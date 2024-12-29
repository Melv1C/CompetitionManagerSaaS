import { z } from 'zod';
import { Abbr$, Id$, Name$ } from './Base';

export enum EventGroup {
    SPRINT = 'sprint',
    MIDDLE = 'middle',
    LONG = 'long',
    HURDLES = 'hurdles',
    JUMP = 'jump',
    THROW = 'throw',
    COMBINED = 'combined',
}

export enum EventType {
    TIME = 'time',
    DISTANCE = 'distance',
    POINTS = 'points',
    HEIGHT = 'height',
}

export const Event$ = z.object({
    id: Id$,
    name: Name$,
    abbr: Abbr$,
    group: z.nativeEnum(EventGroup),
    type: z.nativeEnum(EventType),
});
export type Event = z.infer<typeof Event$>;

export const EventWithoutId$ = Event$.omit({ id: true });
export type EventWithoutId = z.infer<typeof EventWithoutId$>;