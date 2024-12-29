import { z } from 'zod';
import { UserPreferences$ } from './UserPreferences';
import { Id$ } from './Base';

export enum Role {
    UNCONFIRMED_USER = 'unconfirmedUser',
    USER = 'user',
    ADMIN = 'admin',
    CLUB = 'club',
    SUPERADMIN = 'superadmin',
}

export const RoleLevel = {
    [Role.UNCONFIRMED_USER]: 0,
    [Role.USER]: 1,
    [Role.ADMIN]: 2,
    [Role.CLUB]: 3,
    [Role.SUPERADMIN]: 4,
}

export const UserEmail$ = z.string().email();
export const UserPassword$ = z.string().min(8, 'Password must be at least 8 characters long');

export const User$ = z.object({
    id: Id$,
    email: UserEmail$,
    role: z.nativeEnum(Role).default(Role.UNCONFIRMED_USER),
    preferences: UserPreferences$.optional(),
    password: z.string()
});
export type User = z.infer<typeof User$>;

export const UserWithoutId$ = User$.omit({ id: true });
export type UserWithoutId = z.infer<typeof UserWithoutId$>;

export const BaseUser$ = User$.omit({ role: true, preferences: true, id: true });
export type BaseUser = z.infer<typeof BaseUser$>;