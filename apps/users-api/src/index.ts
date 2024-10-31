import express from "express";
import 'dotenv/config';
import { Pool } from 'pg';
import { z } from 'zod';
import { parseRequest } from 'utils';

const User$ = z.object({
    id: z.number().positive(),
    email: z.string().email(),
    firebaseId: z.string(),
});

const body$ = User$.omit({ id: true });

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

app.post(`${prefix}`, parseRequest('body', body$), async (req, res) => {
    const { email, firebaseId } = req.body;
    //create user in postgres
    pool.query(`INSERT INTO users (firebase_id, email) VALUES ($1, $2)`, [firebaseId, email]);
    res.send('User created');
});

app.listen(port, () => {
    console.log(`${service_name}: app is running at port : ${port}`);
});
