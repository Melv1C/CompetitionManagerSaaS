import { z } from 'zod';

const env$ = z.object({
    VITE_NODE_ENV: z.string().default('development'),
    VITE_API_BASE_URL: z.string().default('https://competitionmanager.be/api'),
    VITE_LOCAL_ACCESS_TOKEN: z.string().optional(),
});

export const env = env$.parse(import.meta.env);

