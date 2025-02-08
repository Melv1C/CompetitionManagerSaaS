import { z } from 'zod'
import { Date$, Id$ } from './Base';
import { Language } from './UserPreferences';

export const News$ = z.object({
    id: Id$,
    slug: z.string(),
    title: z.string(),
    content: z.string(),
    language: z.nativeEnum(Language),
    createdAt: Date$
});
export type News = z.infer<typeof News$>;

export const CreateNews$ = News$.omit({ id: true, createdAt: true });
export type CreateNews = z.infer<typeof CreateNews$>;
