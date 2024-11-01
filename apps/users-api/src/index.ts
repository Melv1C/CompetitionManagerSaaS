import express from "express";
import 'dotenv/config';
import { z } from 'zod';
import { parseRequest } from '@competition-manager/utils';
import { prisma } from "@competition-manager/prisma";
import { User$ } from '@competition-manager/schemas';

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const service_name = process.env.SERVICE_NAME || 'users';
const prefix = `/api/${service_name}`;

const Body$ = User$.pick({ firebaseId: true, email: true });

app.post(`${prefix}`, parseRequest('body', Body$), async (req, res) => {
    const userBody = Body$.parse(req.body);
    //create user in postgres
    const user = await prisma.user.create({
        data: {
            ...userBody,
            preferences: {
                create: {
                    theme: 'light',
                    language: 'fr'
                }
            },
            role: 'user'
        }
    });
    res.send(user);
});

const Params$ = z.object({
    firebaseId: z.string().min(1)
});

app.get(`${prefix}/:firebaseId`, parseRequest('params', Params$), async (req, res) => {
    const { firebaseId } = Params$.parse(req.params);
    const user = await prisma.user.findUnique({
        where: {
            firebaseId: firebaseId
        },
        include: {
            preferences: true
        }
    });
    res.send(user);
});

app.listen(port, () => {
    console.log(`${service_name}: app is running at port : ${port}`);
});
