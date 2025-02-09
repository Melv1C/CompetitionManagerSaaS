import 'dotenv/config';
import express from "express";
import cookieParser from 'cookie-parser';
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";

import { corsMiddleware, Key, logRequestMiddleware, OmitType } from '@competition-manager/backend-utils';
import { backendTranslations } from "@competition-manager/translations";

import routes from './routes';
import { logger } from "./logger";
import { env } from "./env";

i18next.use(Backend).use(middleware.LanguageDetector).init({
    resources: backendTranslations,
    fallbackLng: 'en'
});

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(corsMiddleware);

app.use(middleware.handle(i18next));

const omit: OmitType = [
    { key: Key.Body, field: 'password' },
    { key: 'response' }
];

app.use(logRequestMiddleware(logger, omit));

app.use(`${env.PREFIX}/users`, routes);

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});
