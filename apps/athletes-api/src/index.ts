import express from "express";
import 'dotenv/config';
import { initDb, initDbDev } from "./fillDB";
import { corsMiddleware, isNodeEnv } from "@competition-manager/backend-utils";
import { NODE_ENV } from "@competition-manager/schemas";
import { env } from "./env";
import routes from './routes';



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
