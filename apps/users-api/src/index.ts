import express from "express";
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import { corsMiddleware } from '@competition-manager/utils';

import routes from './routes';

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
const PREFIX = process.env.PREFIX || '/api';

app.use(corsMiddleware);

app.use(`${PREFIX}/users`, routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
