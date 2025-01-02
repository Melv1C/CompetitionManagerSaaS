import { z } from 'zod';
import { UserPreferences$ } from './UserPreferences';
import { Email$, Id$ } from './Base';
import { Club$ } from './Club';

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

export const UserPassword$ = z.string().min(8, 'Password must be at least 8 characters long');

export const User$ = z.object({
    id: Id$,
    email: Email$,
    role: z.nativeEnum(Role).default(Role.UNCONFIRMED_USER),
    preferences: UserPreferences$,
    password: z.string(),
    club: Club$.nullish(),
});
export type User = z.infer<typeof User$>;

export const BaseUser$ = User$.omit({ preferences: true, password: true });
export type BaseUser = z.infer<typeof BaseUser$>;

export const CreateUser$ = User$.omit({ id: true, preferences: true, role: true, club: true });
export type CreateUser = z.infer<typeof CreateUser$>;

export const UpdateUser$ = User$.pick({ 
    role: true,
}).extend({
    clubId: Id$.nullish(),
});