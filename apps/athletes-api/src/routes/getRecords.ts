import { Router } from 'express';
import { z } from 'zod';
import 'dotenv/config';
import { parseRequest, isBestResult, Key } from '@competition-manager/utils';
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
    parseRequest(Key.Params, Param$), 
    parseRequest(Key.Body, Body$), 
    async (req, res) => {
        const { license } = Param$.parse(req.params);
        const { events, maxYears } = Body$.parse(req.body);
        const results = await getResults(license, events, maxYears);
        if (results.length === 0) {
            res.status(404).send("No result found");
            return;
        }
        const records: { [discipline: string]: BeathleticsResult } = results.reduce((acc, result:BeathleticsResult) => {
            if (!acc[result.discipline]) {
                acc[result.discipline] = result;
            } else if (isBestResult(result.perf, acc[result.discipline].perf, result.type)) {
                acc[result.discipline] = result;
            }
            return acc;
        }, {} as { [discipline: string]: BeathleticsResult });
        res.send(records);
    }
);
