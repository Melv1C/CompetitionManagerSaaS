import axios from 'axios';

import { COMPETITIONS_URL } from './Gateway';

function getCompetition(id, setCompetition) {
    axios.get(`${COMPETITIONS_URL}/${id}`).then((response) => {
        setCompetition(response.data.data);
    }).catch((error) => {
        console.log(error);
    });
}

function createCompetition(competition) {
    axios.post(COMPETITIONS_URL, competition).then((response) => {
        window.location.href = `/competitions/${response.data.data.id}`;
    }).catch((error) => {
        console.log(error);
    });
}

function updateCompetition(competition, setCompetition) {
    axios.put(`${COMPETITIONS_URL}/${competition.id}`, competition).then((response) => {
        setCompetition(response.data.data);
    }).catch((error) => {
        console.log(error);
    });
}

function addEvent(competitionId, event, setCompetition) {
    axios.post(`${COMPETITIONS_URL}/${competitionId}/events`, event).then((response) => {
        setCompetition(response.data.data);
    }).catch((error) => {
        console.log(error);
    });
}

function modifEvent(competitionId, event, setCompetition) {
    axios.put(`${COMPETITIONS_URL}/${competitionId}/events/${event.id}`, event).then((response) => {
        setCompetition(response.data.data);
    }).catch((error) => {
        console.log(error);
    });
}

export { getCompetition, createCompetition, updateCompetition, addEvent, modifEvent};