const axios = require('axios');

const { getInscriptions, addInscription } = require('./nano');

// check body elements
function checkParams(userId, athleteId, events, records, success_url, cancel_url) {
    if (!userId || typeof userId !== 'string') {
        return { status: 'error', message: 'Invalid userId' };
    }
    if (!athleteId || typeof athleteId !== 'string') {
        return { status: 'error', message: 'Invalid athleteId' };
    }
    if (!events || !Array.isArray(events) || events.length === 0) {
        return { status: 'error', message: 'Invalid events' };
    }
    if (!records || typeof records !== 'object' || Object.keys(records).length === 0) {
        return { status: 'error', message: 'Invalid records' };
    }
    if (success_url && typeof success_url !== 'string') {
        return { status: 'error', message: 'Invalid success_url' };
    }
    if (cancel_url && typeof cancel_url !== 'string') {
        return { status: 'error', message: 'Invalid cancel_url' };
    }
    return null;
}

async function getData(athleteId, competitionId) {
    const athlete = (await axios.get(`${process.env.ATHLETES_URL}/api/athletes/${athleteId}`)).data.data;
    const competition = (await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}`)).data.data;
    const events = (await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/events?category=${athlete.category}`)).data.data;
    const inscriptions = (await getInscriptions(`competition_${competitionId}`)).filter((inscription) => inscription.athleteId == athleteId);
    return [athlete, competition, events, inscriptions];
}

// check valid events
function checkEvents(events, allEvents) {
    const validEvents = allEvents.map((event) => event.pseudoName);
    for (let i = 0; i < events.length; i++) {
        if (!validEvents.includes(events[i])) {
            return { status: 'error', message: 'Invalid event' };
        }
    }
    return null;
}

// check if athlete is already inscribed
function checkInscriptions(inscriptions, athleteId) {
    return inscriptions.some((inscription) => inscription.athleteId == athleteId);
}

// check if place is available (if event.maxParticipants compare with number of inscriptions)
// function checkPlaceAvailable(eventsInfo, inscriptions, athleteInscriptions = null) {
//     for (let i = 0; i < eventsInfo.length; i++) {
//         if (!athleteInscriptions || !athleteInscriptions.some((inscription) => inscription.event == eventsInfo[i].pseudoName)) {
//             if (eventsInfo[i].maxParticipants <= inscriptions.filter((inscription) => inscription.event == eventsInfo[i].pseudoName).length) {
//                 return { status: 'error', message: 'No place available for ' + eventsInfo[i].pseudoName };
//             }
//         }
//     }
//     return null;
// }

async function freeInscriptions(dbName, inscriptionData) {
    for (let i = 0; i < inscriptionData.length; i++) {
        await addInscription(dbName, inscriptionData[i]);
    }
}


module.exports = {
    checkParams,
    getData,
    checkEvents,
    checkInscriptions,
    freeInscriptions
};
