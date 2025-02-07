import express from "express";
import 'dotenv/config';
import { corsMiddleware } from '@competition-manager/backend-utils';
import { prisma } from "@competition-manager/prisma";
import { z } from 'zod';
import { Club$, NODE_ENV } from "@competition-manager/schemas";

const env$ = z.object({
    NODE_ENV: z.nativeEnum(NODE_ENV).default(NODE_ENV.STAGING),
    PORT: z.string().default('3000'),
    PREFIX: z.string().default('/api'),
    ALLOW_ORIGIN: z.string().default('*'),
});

export const env = env$.parse(process.env);

const app = express();
app.use(express.json());

app.use(corsMiddleware);

app.get(`${env.PREFIX}/clubs`, (req, res) => {
    try {
        prisma.club.findMany().then(clubs => {
            res.send(Club$.array().parse(clubs));
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('internalServerError');
    }
});

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});
