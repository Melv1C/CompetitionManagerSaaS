import { z } from 'zod';
import { UserPreferences$ } from './UserPreferences';
import { Id$ } from './Base';

export enum Role {
    USER = 'user',
    ADMIN = 'admin',
    CLUB = 'club',
    SUPERADMIN = 'superadmin',
}

export const RoleLevel = {
    [Role.USER]: 0,
    [Role.ADMIN]: 1,
    [Role.CLUB]: 2,
    [Role.SUPERADMIN]: 3,
}

export const UserEmail$ = z.string().email();
export const UserPassword$ = z.string().min(8, 'Password must be at least 8 characters long');

export const User$ = z.object({
    id: Id$,
    email: UserEmail$,
    role: z.nativeEnum(Role),
    preferences: UserPreferences$.optional(),
    password: z.string()
});

export type User = z.infer<typeof User$>;