import { Router } from 'express';
import { z } from 'zod';
import 'dotenv/config';
import { parseRequest, bestResult } from '@competition-manager/utils';
import { BeathleticsResult } from '../utils/BeathleticsResult';
import { getResults } from '../utils/getResult';

export const router = Router();

const Param$ = z.object({
    license: z.string().min(1, {message: 'License must be at least 1 characters long'})
});

const Body$ = z.object({
    events: z.array(z.string()),
    maxYears: z.number().int().min(1).default(2)
});

router.post(
    '/:license/records',
    parseRequest('params', Param$), 
    parseRequest('body', Body$), 
    async (req, res) => {
        const { license } = Param$.parse(req.params);
        const { events, maxYears } = Body$.parse(req.body);
        const results = await getResults(license, events, maxYears);
        if (results.length === 0) {
            res.status(404).send("No result found");
            return;
        }
        const groupedResults: { [discipline: string]: BeathleticsResult[] } = results.reduce((acc, result) => {
            if (!acc[result.discipline]) {
                acc[result.discipline] = [];
            }
            acc[result.discipline].push(result);
            return acc;
        }, {} as { [discipline: string]: BeathleticsResult[] });
        const records: { [discipline: string]: BeathleticsResult } = {};
        for (const discipline in groupedResults) {
            records[discipline] = bestResult(groupedResults[discipline])
        }
        res.send(records);
    }
);
