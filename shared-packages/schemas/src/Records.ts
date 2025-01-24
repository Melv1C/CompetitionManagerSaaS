import z from 'zod';
import { Event$ } from './Event';
import { Date$ } from './Base';

export const Record$ = z.object({
    perf: z.number(),
    date: Date$,
    location: z.string().nullish(),
});

export type Record = z.infer<typeof Record$>;

export const Records$ = z.record(Event$.shape.name, Record$.nullable());

export type Records = z.infer<typeof Records$>;