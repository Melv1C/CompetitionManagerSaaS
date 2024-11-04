import { Router } from 'express';
import { z } from 'zod';
import axios from 'axios';
import 'dotenv/config';
import { parseRequest, bestResult } from '@competition-manager/utils';
import { Result } from '@competition-manager/schemas';

export const router = Router();

const getResults = async (license: string, events: string[], maxYears: number) => {
    const { data } = await axios.get(process.env.RECORDS_API + `/athlete/new/${license}`);
    const results = data.results;
    let records: Result[] = [];
    for (let result of results) {
        if (!result.result.discipline.eventType) continue;
        let discipline = result.result.discipline.eventType.name_fr;
        if (!events.includes(discipline)) continue;
        let date = new Date(result.result.discipline.competition.startDate);
        if (maxYears < new Date().getFullYear() - date.getFullYear()) continue;
        if (result.result.newTrials && result.result.newTrials.length > 0) {
            for (let j = 0; j < result.result.newTrials.length; j++) {
                if (result.result.newTrials[j].homologationBest) {
                    records.push({
                        discipline: discipline,
                        date: date,
                        perf: result.result.newTrials[j].rankingPerf,
                        type: result.result.newTrials[j].perftype
                    });
                }
            }
        }
    }
    return records;
}


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
        const groupedResults: { [discipline: string]: Result[] } = results.reduce((acc, result) => {
            if (!acc[result.discipline]) {
                acc[result.discipline] = [];
            }
            acc[result.discipline].push(result);
            return acc;
        }, {} as { [discipline: string]: Result[] });
        const records: { [discipline: string]: Result } = {};
        for (const discipline in groupedResults) {
            records[discipline] = bestResult(groupedResults[discipline])
        }
        res.send(records);
    }
);
