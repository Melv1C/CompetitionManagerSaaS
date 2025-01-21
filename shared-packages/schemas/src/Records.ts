import z from 'zod';
import { Event$ } from './Event';
import { Date$ } from './Base';

export const BeathleticsResult$ = z.object({
    date: Date$,
    perf: z.number(),
});

export type BeathleticsResult = z.infer<typeof BeathleticsResult$>;

export const Records$ = z.record(Event$.shape.name, BeathleticsResult$.nullable());

export type Records = z.infer<typeof Records$>;