import express from "express";
import 'dotenv/config';

import { corsMiddleware } from '@competition-manager/utils';
import { prisma } from "@competition-manager/prisma";

import { Club$ } from "../../../shared-packages/schemas/src";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const PREFIX = process.env.PREFIX || '/api';

app.use(corsMiddleware);

app.get(`${PREFIX}/clubs`, (req, res) => {
    prisma.club.findMany().then(clubs => {
        res.send(Club$.array().parse(clubs));
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
