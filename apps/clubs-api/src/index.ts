import 'dotenv/config';
import express from "express";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import { z } from 'zod';

import { Club$, NODE_ENV } from "@competition-manager/schemas";
import { corsMiddleware } from '@competition-manager/backend-utils';
import { backendTranslations } from "@competition-manager/translations";
import { prisma } from "@competition-manager/prisma";

const env$ = z.object({
    NODE_ENV: z.nativeEnum(NODE_ENV).default(NODE_ENV.STAGING),
    PORT: z.string().default('3000'),
    PREFIX: z.string().default('/api'),
    ALLOW_ORIGIN: z.string().default('*'),
});

export const env = env$.parse(process.env);

i18next.use(Backend).use(middleware.LanguageDetector).init({
    resources: backendTranslations,
    fallbackLng: 'en'
});

const app = express();
app.use(express.json());

app.use(corsMiddleware);

app.use(middleware.handle(i18next));

app.get(`${env.PREFIX}/clubs`, (req, res) => {
    try {
        prisma.club.findMany().then(clubs => {
            res.send(Club$.array().parse(clubs));
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(req.t('error.internalServerError'));
    }
});

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});
