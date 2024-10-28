import express from "express";
import 'dotenv/config';
import { Pool } from 'pg';

const app = express();

const port = process.env.PORT || 3000;
const name = process.env.NAME || 'users';
const prefix = `/api/${name}`;

const postgres_user = process.env.POSTGRES_USER || 'postgres';
const postgres_password = process.env.POSTGRES_PASSWORD || 'password';
const postgres_database = process.env.POSTGRES_DATABASE || 'users';
const postgres_host = process.env.POSTGRES_HOST || 'localhost';
const postgres_port = parseInt(process.env.POSTGRES_PORT || '5432');


const pool = new Pool({
    user: postgres_user,
    host: postgres_host,
    database: postgres_database,
    password: postgres_password,
    port: postgres_port,
})




app.get(`${prefix}`, (req, res) => {
    const userid = 1;
    const firstname = 'testfn';
    const lastname = 'testln';
    const email = 'test.test@gmail.com';


    pool.query(
        `INSERT INTO users (userid, firstname, lastname, email) VALUES ($1, $2, $3, $4)`,
        [userid, firstname, lastname, email],
        (error, results) => {
            if (error) {
                console.error('Error inserting data:', error);
                res.status(500).send('An error occurred');
            } else {
                res.send('User added successfully');
            }
        }
    );
});


app.listen(port, () => {
    console.log(`${name}: app is running at port : ${port}`);
});

