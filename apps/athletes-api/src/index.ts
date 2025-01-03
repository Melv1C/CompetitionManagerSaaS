import express from "express";
import 'dotenv/config'
import { initDb, initDbDev } from "./fillDB";
import routes from './routes';

import { corsMiddleware } from '@competition-manager/utils';


if (process.env.NODE_ENV === 'production') {
    initDb();
} else {
    initDbDev();
}

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const PREFIX = process.env.PREFIX || '/api';

app.use(corsMiddleware);

app.use(`${PREFIX}/athletes`, routes);


app.listen(PORT, () => {
    console.log(`Server: app is running at port : ${PORT}`);
});
