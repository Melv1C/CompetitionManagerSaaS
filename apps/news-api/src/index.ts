import express from "express";
import 'dotenv/config';
import { corsMiddleware } from '@competition-manager/backend-utils';

import { env } from "./env";
import routes from './routes';

const app = express();
app.use(express.json());

app.use(corsMiddleware);

app.use(`${env.PREFIX}/news`, routes);

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});
