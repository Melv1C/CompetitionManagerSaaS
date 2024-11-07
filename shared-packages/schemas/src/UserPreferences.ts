import { z } from 'zod';

export const THEME = ['light', 'dark'] as const;
export type Theme = typeof THEME[number];

export const LANGUAGE = ['fr', 'en', 'nl'] as const;
export type Language = typeof LANGUAGE[number];

export const UserPreferences$ = z.object({
    id: z.number().positive(),
    userId: z.number().positive(),
    theme: z.enum(THEME),
    language: z.enum(LANGUAGE),
});

