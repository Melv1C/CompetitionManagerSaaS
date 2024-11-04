import { z } from 'zod';
import { UserPreferences$ } from './UserPreferences';

const ROLE = ['user', 'admin', 'superadmin'] as const;
export type Role = typeof ROLE[number];

export const User$ = z.object({
    id: z.number().positive(),
    email: z.string().email(),
    role: z.enum(ROLE),
    preferences: UserPreferences$.optional(),
    password: z.string()
});

export type User = z.infer<typeof User$>;