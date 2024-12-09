import { z } from 'zod';
import { UserPreferences$ } from './UserPreferences';

//need to be in good order
export const ROLE = ['user', 'admin', 'club', 'superadmin'] as const;
export type Role = typeof ROLE[number];

export const UserEmail$ = z.string().email();
export const UserPassword$ = z.string().min(8, 'Password must be at least 8 characters long');

export const User$ = z.object({
    id: z.number().positive(),
    email: UserEmail$,
    role: z.enum(ROLE),
    preferences: UserPreferences$.optional(),
    password: z.string()
});

export type User = z.infer<typeof User$>;