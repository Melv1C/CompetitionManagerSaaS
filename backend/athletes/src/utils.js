
const axios = require('axios');
const nano = require('nano')(process.env.COUCHDB_URL);


function calculateCategory(birthDate, competitionDate, gender) {

    // calculate age (years, months, days)

    let age = new Date(competitionDate - birthDate);
    let years = age.getUTCFullYear() - 1970;
    //let months = age.getUTCMonth();
    //let days = age.getUTCDate();

    //console.log("Age: " + years + " years, " + months + " months, " + days + " days");

    // calculate category
    if (years < 35) { // not a master
        const dico_age = {"SEN":[20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35],"JUN":[18,19],"SCO":[16,17],"CAD":[14,15],"MIN":[12,13],"PUP":[10,11],"BEN":[8,9],"KAN":[1,2,3,4,5,6,7]}
        const sexe = gender === "Male" ? "M" : "F";
        const yearsDiff = (competitionDate.getMonth()>10 ? competitionDate.getFullYear()+1 : competitionDate.getFullYear()) - birthDate.getFullYear();
        let cat = null;
        for (let key in dico_age) {
            if (dico_age[key].includes(yearsDiff)) {
                cat = key;
                break;
            }
        }
        return cat + " " + sexe;
        
    } else { // master
        const sexe = gender === "Male" ? "M" : "W";
        return sexe + (parseInt(years/5) * 5);
    }
}

async function getAthletesByKey(key, dbName) {

    
    const keyword = key;

    const split = keyword.split(' ');
    
    const q = {
        selector: {
            $or: [
                { "bib": { "$eq": parseInt(keyword) } },
                { "firstName": { "$regex": `(?i)${keyword}` } },
                { "lastName": { "$regex": `(?i)${keyword}` } },
                // if split.length > 1, we have to check if each part of the keyword is in the firstName or lastName
                { "$and": split.map(part => ({ "$or": [{ "firstName": { "$regex": `(?i)${part}` } }, { "lastName": { "$regex": `(?i)${part}` } }] })) }
            ]
        },
        limit:50
    };

    const db = nano.use(dbName);
    const response = await db.find(q);

    return response.docs;

}

async function getAthleteById(id, dbName) {
    const db = nano.use(dbName);
    const response = await db.get(id);
    return response;
}


async function getResults(athleteId) {
    const response = await axios.get(`https://www.beathletics.be/api/athlete/new/${athleteId}`)
    
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
            console.log(error);
            console.log(result);
        }
    }

    data.sort(function(a, b) {
        return b.date - a.date;
    });
    return data;
}

async function getResultsByEvent(athleteId, event) {
    const results = await getResults(athleteId);
    return results.filter(result => result.discipline === event);
}

function isOneDayAthlete(athleteId) {
    return athleteId.startsWith('C');
}


module.exports = {
    calculateCategory,
    getResults,
    getResultsByEvent,
    isOneDayAthlete,
    getAthletesByKey,
    getAthleteById
}
