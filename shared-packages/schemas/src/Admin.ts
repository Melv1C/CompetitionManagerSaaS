import z from 'zod';
import { Id$ } from './Base';
import { PublicUserWithoutRelations$ } from './User';

export enum Access {
    OWNER = 'owner',
    INSCRIPTIONS = 'inscriptions',
    COMPETITIONS = 'competitions',
    CONFIRMATIONS = 'confirmations',
    LIVERESULTS = 'liveResults',
}

export const Admin$ = z.object({
    id: Id$,
    user: PublicUserWithoutRelations$,
    userId: z.number().positive(),
    competitionId: z.number().positive(),
    access: z.array(z.nativeEnum(Access))
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