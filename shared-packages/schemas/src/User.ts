import { z } from 'zod';
import { UserPreferences$ } from './UserPreferences';

const ROLE = ['user', 'admin', 'superadmin'] as const;
export type Role = typeof ROLE[number];

export const User$ = z.object({
    id: z.number().positive(),
    email: z.string().email(),
    firebaseId: z.string(),
    role: z.enum(ROLE),
    name: z.string().optional(),
    preferences: UserPreferences$.optional(),
});

export type User = z.infer<typeof User$>;