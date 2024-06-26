const express = require('express');
const axios = require('axios');

const { competitionsRouter } = require('./Routers/competitions');
const { inscriptionsRouter } = require('./Routers/inscriptions');

const { getInscriptions,
        getInscription,
        getAllInscriptions
    } = require('./nano');

const { removePrivateFields } = require('./utils');

const {getGroupedView} = require('./views');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(competitionsRouter); // New competition and delete competition
app.use(inscriptionsRouter); // Post, Put, Delete inscriptions

// Get all inscriptions for a userId
app.get('/api/inscriptions', (req, res) => {
    const userId = req.query.userId;
    
    axios.get(`${process.env.COMPETITIONS_URL}/api/competitions`)
        .then(async (response) => {
            const competitions = response.data.data;
            let inscriptions = [];
            for (let i = 0; i < competitions.length; i++) {
                const competitionId = competitions[i].id;
                let competitionInscriptions = await getInscriptions(`competition_${competitionId}`);
                competitionInscriptions = competitionInscriptions.filter((inscription) => inscription.userId == userId);
                competitionInscriptions = competitionInscriptions.map((inscription) => {
                    inscription.competitionId = competitionId;
                    inscription.competitionName = competitions[i].name;
                    inscription.competitionDate = competitions[i].date;
                    return inscription;
                });
                inscriptions = inscriptions.concat(competitionInscriptions);
            }
            const data = inscriptions.map((inscription) => removePrivateFields(inscription));
            res.status(200).json({ status: 'success', message: 'Inscriptions retrieved successfully', data: data });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while fetching inscriptions' });
        });
});

// Get all free events for a athlete
app.get('/api/inscriptions/:competitionId/freeEvents', async (req, res) => {
    const { competitionId } = req.params;
    const athleteId = req.query.athleteId;

    getAllInscriptions(`competition_${competitionId}`)
        .then((inscriptions) => {
            const userInscriptions = inscriptions.filter((inscription) => inscription.athleteId == athleteId);
            const events = userInscriptions.map((inscription) => inscription.event);
            res.status(200).json({ status: 'success', message: 'Free events retrieved successfully', data: events });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while fetching free events' });
        });
});

//Get information about a competition
app.get('/api/inscriptions/:competitionId/info', async (req, res) => {
    const competitionId = req.params.competitionId;

    const NumberOfAthletesByClub = await getGroupedView(`competition_${competitionId}`, 'NumberOfAthletesByClub');
    const NumberOfParticipants = NumberOfAthletesByClub.reduce((acc, cur) => acc + cur.value, 0);
    const NumberOfAthletesByCategory = await getGroupedView(`competition_${competitionId}`, 'NumberOfAthletesByCategory');
    const NumberOfAthletesByEvent = await getGroupedView(`competition_${competitionId}`, 'NumberOfAthletesByEvent');

    res.status(200).json({ status: 'success', message: 'Competition info retrieved successfully', data: { id: competitionId, NumberOfParticipants: NumberOfParticipants, NumberOfAthletesByClub: NumberOfAthletesByClub, NumberOfAthletesByCategory: NumberOfAthletesByCategory, NumberOfAthletesByEvent: NumberOfAthletesByEvent } });  
});

// Get all inscriptions for a competition
app.get('/api/inscriptions/:competitionId', async (req, res) => {
    const { competitionId } = req.params;
    const { adminId } = req.query;
    let adminCheck;
    if (adminId) {
        adminCheck = await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/${adminId}`).catch((err) => {
            console.error(err);
            return false;
        });
    }else{
        adminCheck = false;
    }

    getInscriptions(`competition_${competitionId}`)
        .then((inscriptions) => {
            let data;
            if (!adminCheck) {
                data = inscriptions.map((inscription) => removePrivateFields(inscription));
            }else {
                data = inscriptions;
            }
            res.status(200).json({ status: 'success', message: 'Inscriptions retrieved successfully', data: data });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while fetching inscriptions' });
        });
});

//Get info about an athlete'
app.get('/api/inscriptions/:competitionId/athletes/:athleteId', async (req, res) => {
    const { competitionId, athleteId } = req.params;
    const userId = req.query.userId;

    getInscriptions(`competition_${competitionId}`)
        .then((inscriptions) => {
            const athleteInscriptions = inscriptions.filter((inscription) => inscription.athleteId == athleteId);
            if (athleteInscriptions.length == 0) {
                res.status(200).json({ status: 'success', message: 'Athlete not inscribed', data: { isInsribed: false, ownByUser: false } });
            } else {
                const ownByUser = athleteInscriptions[0].userId == userId;
                res.status(200).json({ status: 'success', message: 'Athlete inscribed', data: { isInsribed: true, ownByUser: ownByUser } });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while fetching athlete info' });
        });
});


// Get a single inscription for a competition
app.get('/api/inscriptions/:competitionId/:inscriptionId', (req, res) => {
    const { competitionId, inscriptionId } = req.params;
    getInscription(`competition_${competitionId}`, inscriptionId)
        .then((inscription) => {
            res.status(200).json({ status: 'success', message: 'Inscription retrieved successfully', data: removePrivateFields(inscription)});
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while fetching inscription' });
        });
});


app.listen(port, () => console.log(`Inscriptions service listening on port ${port}!`));
