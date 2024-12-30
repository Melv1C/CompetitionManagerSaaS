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

export const CreateAdmin$ = BaseAdmin$
export type CreateAdmin = z.infer<typeof CreateAdmin$>;

export const UpdateAdmin$ = Admin$.omit({
    id: true,
    user: true,
    userId: true,
    competitionId: true
});
export type UpdateAdmin = z.infer<typeof UpdateAdmin$>;