import express from "express";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { corsMiddleware, createLogger, Key, logRequestMiddleware, OmitType } from '@competition-manager/backend-utils';
import routes from './routes';
import { z } from 'zod';
import { Boolean$, NODE_ENV, SERVICE } from "@competition-manager/schemas";

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

export const logger = createLogger(SERVICE.USERS);

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(corsMiddleware);

const omit: OmitType = [
    { key: Key.Body, field: 'password' },
    { key: 'response' }
];

app.use(logRequestMiddleware(logger, omit));

app.use(`${env.PREFIX}/users`, routes);

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});
