import express from "express";
import 'dotenv/config';
import { corsMiddleware } from '@competition-manager/backend-utils';

import routes from './routes';
import { env } from "./env";

const app = express();
app.use(express.json());

app.use(corsMiddleware);

//app.use(`${env.PREFIX}/CHANGEME`, routes);

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});
