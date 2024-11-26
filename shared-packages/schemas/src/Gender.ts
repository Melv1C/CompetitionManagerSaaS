import z from 'zod';

export const GENDER = ['M', 'F'] as const;
export type Gender = typeof GENDER[number];


export const Gender$ = z.enum(GENDER);