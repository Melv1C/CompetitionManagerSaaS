import express from "express";
import 'dotenv/config';
import { fillDB } from "./fillDB";
import { prisma } from "@competition-manager/prisma";
import { Category$ } from '@competition-manager/schemas';
import { corsMiddleware } from '@competition-manager/backend-utils';
import { z } from 'zod';
import { NODE_ENV } from "@competition-manager/utils";

const env$ = z.object({
    NODE_ENV: z.nativeEnum(NODE_ENV).default(NODE_ENV.STAGING),
    PORT: z.string().default('3000'),
    PREFIX: z.string().default('/api'),
    ALLOW_ORIGIN: z.string().default('*')
});

export const env = env$.parse(process.env);

fillDB();

const app = express();
app.use(express.json());

app.use(corsMiddleware);

app.get(`${env.PREFIX}/categories`, (req, res) => {
    prisma.category.findMany().then(categories => {
        res.send(Category$.array().parse(categories));
    });
});

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});
