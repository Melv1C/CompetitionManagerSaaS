import { z } from 'zod';
import { Id$ } from './Base';

export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
}

export enum Language {
    FR = 'fr',
    EN = 'en',
    NL = 'nl',
}

export const USER_PREFERENCES_DEFAULTS = {
    theme: Theme.LIGHT,
    language: Language.FR,
};

export const UserPreferences$ = z.object({
    id: Id$,
    userId: z.number().positive(),
    theme: z.nativeEnum(Theme),
    language: z.nativeEnum(Language),
});

