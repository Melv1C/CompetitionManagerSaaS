import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Athlete } from "cm-data";
import { MySQL } from "cm-back";
import { fillDB } from './fillDB.';
import { getRecords } from './BeathleticsUtils';

console.log("Starting athletes service");

MySQL.init();
dotenv.config();

// Run the function every day at 3:00 AM
const now = new Date();
const currentHour = now.getHours();
// Calculate the next 3 AM
let next3AM = new Date(now);
next3AM.setHours(3, 0, 0, 0);
if (currentHour >= 3) {
    // If current time is past 3 AM today, set the next 3 AM to tomorrow
    next3AM.setDate(now.getDate() + 1);
}
// Calculate the difference in milliseconds
const diffMilliseconds = next3AM.getTime() - now.getTime();
setTimeout(function() {
    setInterval(() => {
        fillDB();
    }, 24 * 60 * 60 * 1000);
}, diffMilliseconds);

const serviceName = "athletes";
const port = process.env.PORT || 3000;
const prefix = process.env.PREFIX || '/athletes';

const app: Express = express();

// allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());

/**
 * GET /athlete?key=*
 *  - key: string
 * 
 * Search for athletes by key
 * 
 * Returns:
 * - status: string
 * - message: string
 * - data: Athlete[]
 * 
*/

app.get(`${prefix}`, async (req: Request, res: Response) => {
    const key: string = req.query.key as string;
    if (!key) {
        res.status(400).json({ status: 'error', message: 'Missing query parameter key' });
        return;
    }

    const keyNormalized = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // check key (avoid SQL injection)
    // only allow letters, numbers, ' and space
    const pattern = /^[a-zA-Z0-9' ]+$/;
    if (!pattern.test(keyNormalized)) {
        res.status(400).json({ status: 'error', message: 'Invalid query parameter key' });
        return;
    }

    const fields: string[] = ['firstName', 'lastName', 'bib'];

    const athletes: Athlete[] = await MySQL.search(Athlete, fields, keyNormalized);

    res.status(200).json({
        status: 'success',
        message: 'Athletes retrieved successfully',
        data: athletes
    });
});

/**
 * GET /athlete/:id
 *  - id: number
 * 
 * Get athlete by id (licence)
 * 
 * Returns:
 * - status: string
 * - message: string
 * - data: Athlete
 * 
*/

app.get(`${prefix}/:id`, async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    if (!id) {
        res.status(400).json({ status: 'error', message: 'Invalid athlete id' });
        return;
    }

    const athlete: Athlete = await MySQL.loadBy(Athlete, 'licence', id);

    res.status(200).json({
        status: 'success',
        message: 'Athlete retrieved successfully',
        data: athlete
    });
});

app.post(`${prefix}/:id/getResults`, async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const events: string[] = req.body.events as string[];
    const maxYears: number = parseInt(req.query.maxYears as string) || 1;

    if (!id) {
        res.status(400).json({ status: 'error', message: 'Invalid athlete id' });
        return;
    }

    if (!events) {
        res.status(400).json({ status: 'error', message: 'Missing events' });
        return;
    }

    const athlete: Athlete = await MySQL.loadBy(Athlete, 'licence', id);

    const results = await getRecords(parseInt(athlete.licence), events, maxYears);

    res.status(200).json({
        status: 'success',
        message: 'Results retrieved successfully',
        data: results
    });
});

app.listen(port, () => {
    console.log(`${serviceName} service running at port ${port} with prefix ${prefix}`);
});