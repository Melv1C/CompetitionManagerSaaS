import express from "express";
import 'dotenv/config'
import { z } from 'zod';

import { initDb, initDbDev } from "./fillDB";
import routes from './routes';
import { corsMiddleware, isNodeEnv } from "@competition-manager/backend-utils";
import { NODE_ENV } from "@competition-manager/schemas";

const env$ = z.object({
    NODE_ENV: z.nativeEnum(NODE_ENV).default(NODE_ENV.STAGING),
    PORT: z.string().default('3000'),
    PREFIX: z.string().default('/api'),
    ALLOW_ORIGIN: z.string().default('*'),
    LBFA_USER: z.string(),
    LBFA_PASS: z.string(),
    RECORDS_API: z.string()
});

export const env = env$.parse(process.env);

if (isNodeEnv(NODE_ENV.LOCAL)) {
    console.log('Local environment');
    initDbDev();
} else {
    console.log('Staging/Production environment');
    initDb();
}

const app = express();
app.use(express.json());

app.use(corsMiddleware);

app.use(`${env.PREFIX}/athletes`, routes);


app.listen(env.PORT, () => {
    console.log(`Server: app is running at port : ${env.PORT}`);
});
