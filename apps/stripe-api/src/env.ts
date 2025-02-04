import { z } from 'zod';
import { NODE_ENV } from '@competition-manager/schemas';

const env$ = z.object({
    NODE_ENV: z.nativeEnum(NODE_ENV).default(NODE_ENV.STAGING),
    PORT: z.string().default('3000'),
    PREFIX: z.string().default('/api'),
    ALLOW_ORIGIN: z.string().default('*')
});

export const env = env$.parse(process.env);