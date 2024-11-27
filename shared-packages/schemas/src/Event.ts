import { z } from 'zod';

const EVENT_GROUP = [
    'Sprint',
    'Demi-fond',
    'Fond',
    'Haies',
    'Saut',
    'Lancer',
    'Epreuves multiples'
] as const;

export type EventGroup = typeof EVENT_GROUP[number];

export const EVENT_TYPE = [
    'time',
    'distance',
    'points'
] as const;

export type EventType = typeof EVENT_TYPE[number];

export const Event$ = z.object({
    id: z.number().positive(),
    name: z.string(),
    abbr: z.string(),
    group: z.enum(EVENT_GROUP),
    type: z.enum(EVENT_TYPE),
});

export type Event = z.infer<typeof Event$>;