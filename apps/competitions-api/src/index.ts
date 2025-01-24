import express from "express";
import 'dotenv/config';
import { corsMiddleware } from '@competition-manager/backend-utils';
import routes from './routes';
import { z } from 'zod';
import { NODE_ENV } from "@competition-manager/schemas";

const env$ = z.object({
    NODE_ENV: z.nativeEnum(NODE_ENV).default(NODE_ENV.STAGING),
    PORT: z.string().default('3000'),
    PREFIX: z.string().default('/api'),
    ALLOW_ORIGIN: z.string().default('*'),
    ACCESS_TOKEN_SECRET: z.string(),
    ONE_DAY_ATHLETE_TIMEOUT: z.coerce.number().default(24*60*60*1000)
});

export const env = env$.parse(process.env);

const app = express();
app.use(express.json());

app.use(corsMiddleware);

app.use(`${env.PREFIX}/competitions`, routes);

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});
