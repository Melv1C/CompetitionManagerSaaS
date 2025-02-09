import 'dotenv/config';
import express from "express";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";

import { NODE_ENV } from "@competition-manager/schemas";
import { corsMiddleware, isNodeEnv } from "@competition-manager/backend-utils";
import { backendTranslations } from "@competition-manager/translations";

import routes from './routes';
import { env } from "./env";
import { initDb, initDbDev } from "./fillDB";

if (isNodeEnv(NODE_ENV.LOCAL)) {
    console.log('Local environment');
    initDbDev();
} else {
    console.log('Staging/Production environment');
    initDb();
}

i18next.use(Backend).use(middleware.LanguageDetector).init({
    resources: backendTranslations,
    fallbackLng: 'en'
});

const app = express();
app.use(express.json());

app.use(corsMiddleware);

app.use(middleware.handle(i18next));

app.use(`${env.PREFIX}/athletes`, routes);


app.listen(env.PORT, () => {
    console.log(`Server: app is running at port : ${env.PORT}`);
});
