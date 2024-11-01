import express from "express";
import 'dotenv/config';
import { Pool } from 'pg';
import { z } from 'zod';
import { parseRequest } from '@competition-manager/utils';
import { prisma } from "@competition-manager/prisma";
import { User$ } from '@competition-manager/schemas';



const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const service_name = process.env.SERVICE_NAME || 'users';
const prefix = `/api/${service_name}`;

const postgres_user = process.env.POSTGRES_USER || 'postgres';
const postgres_password = process.env.POSTGRES_PASSWORD || 'password';
const postgres_database = process.env.POSTGRES_DB || 'postgres';
const postgres_host = process.env.POSTGRES_HOST || 'localhost';
const postgres_port = parseInt(process.env.POSTGRES_PORT || '5432');


const pool = new Pool({
    user: postgres_user,
    host: postgres_host,
    database: postgres_database,
    password: postgres_password,
    port: postgres_port,
});

const Body$ = User$.omit({ id: true, preferences: true });

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
            }
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
