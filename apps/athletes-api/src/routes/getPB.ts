import { Router } from 'express';
import { z } from 'zod';
import axios from 'axios';
import { parseRequest } from '@competition-manager/utils';
import { Result } from '@competition-manager/schemas';

export const router = Router();

const getResults = async (license: string, events: string[], maxYears: number) => {
    const { data } = await axios.get(`https://www.beathletics.be/api/athlete/new/${license}`);
    const results = data.results;
    let cleanedResults: Result[] = [];
    for (let result of results) {
        let discipline = result.result.discipline.eventType ? result.result.discipline.eventType.name_fr : "ERROR";
        let date = new Date(result.result.discipline.competition.startDate);
        if (events.includes(discipline) && maxYears >= new Date().getFullYear() - date.getFullYear()) {
            if (result.result.newTrials && result.result.newTrials.length > 0) {
                for (let j = 0; j < result.result.newTrials.length; j++) {
                    if (result.result.newTrials[j].homologationBest) {
                        cleanedResults.push({
                            discipline: discipline,
                            date: date,
                            perf: result.result.newTrials[j].rankingPerf,
                            type: result.result.newTrials[j].perftype
                        });
                    }
                }
            }
        }
    }
    return cleanedResults;
}


const Param$ = z.object({
    license: z.string().min(1, {message: 'License must be at least 1 characters long'})
});

const Body$ = z.object({
    events: z.array(z.string()),
    maxYears: z.number().int().min(1).default(2)
});

router.post(
    '/:license/pb',
    parseRequest('params', Param$), 
    parseRequest('body', Body$), 
    async (req, res) => {
        const { license } = Param$.parse(req.params);
        const { events, maxYears } = Body$.parse(req.body);
        const results = await getResults(license, events, maxYears);
        if (results.length === 0) {
            res.status(404).json({
                status: 'error',
                message: 'Results not found',
            });
            return;
        }
        let personalBests: { [key: string]: Result } = {};
        for (let i = 0; i < results.length; i++) {
            if (personalBests[results[i].discipline] === undefined) {
                personalBests[results[i].discipline] = results[i];
            } else if (results[i].type === "time") {
                if (results[i].perf < personalBests[results[i].discipline].perf) {
                    personalBests[results[i].discipline] = results[i];
                }
            } else {
                if (results[i].perf > personalBests[results[i].discipline].perf) {
                    personalBests[results[i].discipline] = results[i];
                }
            }
        }
        res.send(personalBests);
    }
);
