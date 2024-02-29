import axios from 'axios';

import { COMPETITIONS_URL } from './Gateway';

async function getCompetition(id, setCompetition) {
    axios.get(`${COMPETITIONS_URL}/${id}`).then((response) => {
        setCompetition(response.data.data);
    }).catch((error) => {
        console.log(error);
    });
}

async function createCompetition(competition) {
    return await axios.post(COMPETITIONS_URL, competition).then((response) => {
        return true; //history.push(`/competitions/${response.data.data.id}`);
    }).catch((error) => {
        console.log(error);
        return false;
    });
}

async function updateCompetition(competition, setCompetition) {
    axios.put(`${COMPETITIONS_URL}/${competition.id}`, competition).then((response) => {
        setCompetition(response.data.data);
    }).catch((error) => {
        console.log(error);
    });
}

async function addEvent(competitionId, event) {
    return await axios.post(`${COMPETITIONS_URL}/${competitionId}/events`, event).then((response) => {
        return true;
    }).catch((error) => {
        console.log(error);
        return false;
    });
}

async function modifEvent(competitionId, event) {
    return await axios.put(`${COMPETITIONS_URL}/${competitionId}/events/${event.id}`, event).then((response) => {
        return true;
    }).catch((error) => {
        console.log(error);
        return false;
    });
}

export { getCompetition, createCompetition, updateCompetition, addEvent, modifEvent};