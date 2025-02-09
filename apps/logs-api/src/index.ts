import 'dotenv/config';
import express from "express";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import { z } from 'zod';

import { NODE_ENV, SERVICE } from "@competition-manager/schemas";
import { corsMiddleware, createLogger } from '@competition-manager/backend-utils';
import { backendTranslations } from "@competition-manager/translations";

import routes from './routes';

const env$ = z.object({
    NODE_ENV: z.nativeEnum(NODE_ENV).default(NODE_ENV.STAGING),
    PORT: z.string().default('3000'),
    PREFIX: z.string().default('/api'),
    ALLOW_ORIGIN: z.string().default('*'),
    ACCESS_TOKEN_SECRET: z.string(),
});

export const env = env$.parse(process.env);
export const logger = createLogger(SERVICE.LOGS);

i18next.use(Backend).use(middleware.LanguageDetector).init({
    resources: backendTranslations,
    fallbackLng: 'en'
});

const app = express();
app.use(express.json());

app.use(corsMiddleware);

app.use(middleware.handle(i18next));

app.use(`${env.PREFIX}/logs`, routes);

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});
