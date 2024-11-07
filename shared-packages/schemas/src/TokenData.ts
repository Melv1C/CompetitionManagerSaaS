import { z } from 'zod';
import { ROLE } from './User';
import { THEME, LANGUAGE } from './UserPreferences';

export const TokenData$ = z.object({
    email: z.string().email(),
    role: z.enum(ROLE),
    theme: z.enum(THEME),
    language: z.enum(LANGUAGE),
});

export type TokenData = z.infer<typeof TokenData$>;