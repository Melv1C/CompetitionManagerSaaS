import express from "express";
import 'dotenv/config';
import { fillDB } from "./fillDB";
import { prisma } from "@competition-manager/prisma";
import { Category$ } from '@competition-manager/schemas';
import { corsMiddleware } from '@competition-manager/utils';

fillDB();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const PREFIX = process.env.PREFIX || '/api';

app.use(corsMiddleware);

app.get(`${PREFIX}/categories`, (req, res) => {
    prisma.category.findMany().then(categories => {
        res.send(Category$.array().parse(categories));
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
