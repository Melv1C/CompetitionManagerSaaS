import axios from 'axios';
import { Event, Event$, License, Record$ } from '@competition-manager/schemas';
import { env } from '..';
import { z } from 'zod';

export const BeathleticsResults$ = z.record(Event$.shape.name, z.array(Record$));
export type BeathleticsResults = z.infer<typeof BeathleticsResults$>;

export const getResults = async (license: License, events: Event["name"][], from: Date = new Date(0), to: Date = new Date()) => {
    const { data } = await axios.get(env.RECORDS_API + `/athlete/new/${license}`);
    const results = data.results;
    let records: BeathleticsResults = {};
    for (let result of results) {
        if (!result.result.discipline.eventType) continue;
        let discipline = result.result.discipline.eventType.name_fr;
        if (!events.includes(discipline)) continue;
        let date = new Date(result.result.discipline.competition.startDate);
        if (date < from || date > to) continue;
        if (result.result.newTrials && result.result.newTrials.length > 0) {
            for (let j = 0; j < result.result.newTrials.length; j++) {
                if (result.result.newTrials[j].homologationBest) {

                    if (!records[discipline]) records[discipline] = [];

                    records[discipline].push(Record$.parse({
                        date: date,
                        perf: parseFloat(result.result.newTrials[j].rankingPerf),
                    }));
                }
            }
        }
    }
    return BeathleticsResults$.parse(records);
}