import express from "express";
import 'dotenv/config';
import routes from './routes';
import cookieParser from 'cookie-parser';
import { corsMiddleware, Key, logRequestMiddleware, OmitType } from '@competition-manager/backend-utils';
import { logger } from "./logger";
import { env } from "./env";

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
