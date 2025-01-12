import axios from 'axios';
import { BeathleticsResult, BeathleticsResult$ } from './BeathleticsResult';
import { License } from '@competition-manager/schemas';

export const getResults = async (license: License, events: string[], maxYears: number) => {
    const { data } = await axios.get(process.env.RECORDS_API + `/athlete/new/${license}`);
    const results = data.results;
    let records: BeathleticsResult[] = [];
    for (let result of results) {
        if (!result.result.discipline.eventType) continue;
        let discipline = result.result.discipline.eventType.name_fr;
        if (!events.includes(discipline)) continue;
        let date = new Date(result.result.discipline.competition.startDate);
        if (maxYears < (new Date().getFullYear() - date.getFullYear())) continue;
        if (result.result.newTrials && result.result.newTrials.length > 0) {
            for (let j = 0; j < result.result.newTrials.length; j++) {
                if (result.result.newTrials[j].homologationBest) {
                    records.push(BeathleticsResult$.parse({
                        discipline: discipline,
                        date: date,
                        perf: parseFloat(result.result.newTrials[j].rankingPerf),
                        type: result.result.newTrials[j].perftype
                    }));
                }
            }
        }
    }
    return records;
}