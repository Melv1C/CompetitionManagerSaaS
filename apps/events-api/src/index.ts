import express from "express";
import 'dotenv/config';
import { fillDB } from "./fillDB";
import { prisma } from "@competition-manager/prisma";

import { corsMiddleware } from '@competition-manager/utils';
import { Event$ } from "@competition-manager/schemas";

fillDB();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const PREFIX = process.env.PREFIX || '/api';

app.use(corsMiddleware);

app.get(`${PREFIX}/events`, (req, res) => {
    prisma.event.findMany().then(events => {
        res.send(Event$.array().parse(events));
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
