import axios from 'axios';

async function getResults(athleteId: number) {
    const response: any = await axios.get(`https://www.beathletics.be/api/athlete/new/${athleteId}`)
    
    var results = response.data.results;
    
    var data = [];

    for (var i = 0; i < results.length; i++) {
        try {

            var result = results[i];
    
            var discipline = result.result.discipline.eventType ? result.result.discipline.eventType.name_fr : "ERROR : "+result.result.discipline.name;
    
            var date = new Date(result.result.discipline.competition.startDate);
    
            var perf;
            var type;
    
            if (result.result.newTrials && result.result.newTrials.length > 0) {
                for (var j = 0; j < result.result.newTrials.length; j++) {
                    if (result.result.newTrials[j].homologationBest) {

                        perf = result.result.newTrials[j].rankingPerf;
                        type = result.result.newTrials[j].perftype;
                        
                        data.push({
                            discipline: discipline,
                            date: date,
                            perf: perf,
                            type: type
                        });
                    }
                }
            }
        } catch (error) {
            //console.log(error);
            //console.log(result);
        }
    }

    data.sort(function(a: any, b: any) {
        return b.date - a.date;
    });
    return data;
}

async function getResultsByEvents(athleteId: number, events: string[]) {
    const results = await getResults(athleteId);
    return results.filter(result => events.includes(result.discipline));
}

export async function getRecords(athleteId: number, events: string[], maxYears?: number) {
    const results = await getResultsByEvents(athleteId, events);
    const filteredResults = results.filter(result => {
        if (maxYears) {
            return new Date().getFullYear() - result.date.getFullYear() <= maxYears;
        }
        return true;
    });

    const records: any = {};

    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (events.includes(result.discipline)) {
            if (!records[result.discipline] || isBetterThan(result, records[result.discipline])) {
                records[result.discipline] = result;
            }
        }
    }

    return records;
}

function isBetterThan(result: any, bestResult: any) {
    if (result.type === 'time') {
        return result.perf < bestResult.perf;
    } else {
        return result.perf > bestResult.perf;
    }
}