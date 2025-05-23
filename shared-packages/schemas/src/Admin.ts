import z from 'zod';
import { Boolean$, Id$ } from './Base';
import { BaseUser$ } from './User';

export enum Access {
    OWNER = 'owner',
    INSCRIPTIONS = 'inscriptions',
    COMPETITIONS = 'competitions',
    CONFIRMATIONS = 'confirmations',
    RESULTS = 'results',
}

export const AdminQuery$ = z.object({
    isAdmin: Boolean$.default(false)
});
export type AdminQuery = z.infer<typeof AdminQuery$>;

export const Admin$ = z.object({
    id: Id$,
    user: BaseUser$,
    userId: z.coerce.number().positive(),
    competitionId: z.coerce.number().positive(),
    access: z.array(z.nativeEnum(Access))
});
export type Admin = z.infer<typeof Admin$>;

export const BaseAdmin$ = Admin$.pick({
    userId: true,
    access: true
});
export type BaseAdmin = z.infer<typeof BaseAdmin$>;

export const CreateAdmin$ = Admin$.pick({
    access: true,
}).extend({
    email: z.string().email(),
});
export type CreateAdmin = z.infer<typeof CreateAdmin$>;

export const UpdateAdmin$ = Admin$.omit({
    id: true,
    user: true,
    userId: true,
    competitionId: true
});
export type UpdateAdmin = z.infer<typeof UpdateAdmin$>;