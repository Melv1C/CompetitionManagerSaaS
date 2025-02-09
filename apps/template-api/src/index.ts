import 'dotenv/config';
import express from "express";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";

import { corsMiddleware } from '@competition-manager/backend-utils';
import { backendTranslations } from "@competition-manager/translations";

import routes from './routes';
import { env } from "./env";

i18next.use(Backend).use(middleware.LanguageDetector).init({
    resources: backendTranslations,
    fallbackLng: 'en'
});

const app = express();
app.use(express.json());

app.use(corsMiddleware);

//app.use(`${env.PREFIX}/CHANGEME`, routes);

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});
