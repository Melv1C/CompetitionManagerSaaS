import z from 'zod';
import { User$ } from './User';

export enum ACCESS {
    OWNER = 'owner',
    INSCRIPTIONS = 'inscriptions',
    COMPETITIONS = 'competitions',
    CONFIRMATIONS = 'confirmations',
    LIVERESULTS = 'liveResults',
}

export const Admin$ = z.object({
    id: z.number().positive(),
    user: User$,
    userId: z.number().positive(),
    competitionId: z.number().positive(),
    access: z.array(z.nativeEnum(ACCESS))
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