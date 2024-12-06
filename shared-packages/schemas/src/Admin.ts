import z from 'zod';
import { User$ } from './User';

export const ACCESS = ['owner', 'inscriptions', 'competitions', 'confirmations', 'liveResults'] as const;
export type Access = typeof ACCESS[number];

export const Admin$ = z.object({
    id: z.number().positive(),
    user: User$,
    userId: z.number().positive(),
    competitionId: z.number().positive(),
    access: z.array(z.enum(ACCESS)),
});

export type Admin = z.infer<typeof Admin$>;