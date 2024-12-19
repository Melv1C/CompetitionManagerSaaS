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

export const BaseAdmin$ = Admin$.pick({
    userId: true,
    access: true
});
export type BaseAdmin = z.infer<typeof BaseAdmin$>;

export const BaseAdmins$ = z.array(BaseAdmin$);
export type BaseAdmins = z.infer<typeof BaseAdmins$>;

export const AdminWithoutIdAndRelation$ = Admin$.omit({
    id: true,
    user: true,
    userId: true,
    competitionId: true
});
export type AdminWithoutIdAndRelation = z.infer<typeof AdminWithoutIdAndRelation$>;