import { z } from 'zod';
import { UserPreferences$ } from '.';

export const User$ = z.object({
    id: z.number().positive(),
    email: z.string().email(),
    firebaseId: z.string(),
    name: z.string().optional(),
    preferences: UserPreferences$.optional(),
});

export type User = z.infer<typeof User$>;