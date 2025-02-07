import { z } from 'zod';
import { Boolean$, NODE_ENV } from '@competition-manager/schemas';


const env$ = z.object({
    NODE_ENV: z.nativeEnum(NODE_ENV).default(NODE_ENV.STAGING),
    PORT: z.string().default('3000'),
    PREFIX: z.string().default('/api'),
    ALLOW_ORIGIN: z.string().default('*'),
    ACCESS_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    VERIFY_EMAIL_TOKEN_SECRET: z.string(),
    RESET_PASSWORD_TOKEN_SECRET: z.string(),
    BASE_URL: z.string().default('https://competitionmanager.be'),
    NODEMAILER_SERVICE: z.string().default('Gmail'),
    NODEMAILER_HOST: z.string().default('smtp.gmail.com'),
    NODEMAILER_PORT: z.string().default('465'),
    NODEMAILER_SECURE: Boolean$.default(true),
    NODEMAILER_USER: z.string(),
    NODEMAILER_PASS: z.string(),
});

export const env = env$.parse(process.env);