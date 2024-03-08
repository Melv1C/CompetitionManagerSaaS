import axios from 'axios';

import { COMPETITIONS_URL } from './Gateway';

async function getCompetition(id, setCompetition) {
    axios.get(`${COMPETITIONS_URL}/${id}`).then((response) => {
        setCompetition(response.data.data);
    }).catch((error) => {
        console.log(error);
    });
}

function createCompetition(competition, navigate) {
    axios.post(COMPETITIONS_URL, competition).then((response) => {
        navigate(`/competition/${response.data.data.id}/infos`);
    }).catch((error) => {
        console.log(error);
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

function openCompetition(competition, setCompetition, body) {
    axios.put(`${COMPETITIONS_URL}/${competition.id}/open`, body).then((response) => {
        //set competition.open to !competition.open
        setCompetition({ ...competition, open: !competition.open });
    }).catch((error) => {
        console.log(error);
    });
}   

export { getCompetition, createCompetition, updateCompetition, addEvent, modifEvent, openCompetition };