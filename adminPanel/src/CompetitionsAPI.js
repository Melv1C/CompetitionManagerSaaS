import axios from 'axios';
import { Link } from 'react-router-dom';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api/competitions' : process.env.GATEWAY_URL + '/api/competitions';

function getCompetition(id, setCompetition) {
    axios.get(`${url}/${id}`).then((response) => {
        setCompetition(response.data.data);
    }).catch((error) => {
        console.log(error);
    });
}

function createCompetition(competition) {
    axios.post(url, competition).then((response) => {
        window.location.href = `/competitions/${response.data.data.id}`;
    }).catch((error) => {
        console.log(error);
    });
}

function updateCompetition(competition, setCompetition) {
    axios.put(`${url}/${competition.id}`, competition).then((response) => {
        setCompetition(response.data.data);
    }).catch((error) => {
        console.log(error);
    });
}

function addEvent(competitionId, event, setCompetition) {
    console.log(event);
    axios.post(`${url}/${competitionId}/events`, event).then((response) => {
        setCompetition(response.data.data);
    }).catch((error) => {
        console.log(error);
    });
}

export { getCompetition, createCompetition, updateCompetition, addEvent };