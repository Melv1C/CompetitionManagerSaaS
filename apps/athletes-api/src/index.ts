import express from "express";
import 'dotenv/config'
import { z } from "zod";
import { parseRequest } from '@competition-manager/utils';
import { Athlete$ } from '@competition-manager/schemas';
import { initDb, initDbDev } from "./fillDB.";
import { prisma } from "@competition-manager/prisma";

if (process.env.NODE_ENV === 'production') {
    initDb();
} else {
    initDbDev();
}

const app = express();
const port = process.env.PORT || 3000;
const name = process.env.NAME || 'athletes';
const prefix = `/api/${name}`;

const Query$ = z.object({
    key: z.string().min(1)
});

app.get(`${prefix}`, async (req, res) => {
    const athletes = await prisma.athlete.findMany()
    res.send(athletes);
});


app.listen(port, () => {
    console.log(`${name}: app is running at port : ${port}`);
});


















