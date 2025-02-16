import { z } from 'zod';
import { NODE_ENV } from '@competition-manager/schemas';

const env$ = z.object({
    NODE_ENV: z.nativeEnum(NODE_ENV).default(NODE_ENV.LOCAL),
    PORT: z.string().default('3000'),
    PREFIX: z.string().default('/api'),
    ALLOW_ORIGIN: z.string().default('*'),
    ACCESS_TOKEN_SECRET: z.string(),
    BASE_URL: z.string().default('https://competitionmanager.be'),
    ONE_DAY_ATHLETE_TIMEOUT: z.coerce.number().default(24*60*60*1000)
});

export const env = env$.parse(process.env);