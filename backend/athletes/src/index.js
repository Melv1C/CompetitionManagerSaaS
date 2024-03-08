const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// import function from utils.js
const { calculateCategory, getResults, getResultsByEvent } = require('./utils');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/api/athletes', async (req, res) => {
    const key = req.query.key;
    if (!key) {
        res.status(400).json({
            status: 'error',
            message: 'Missing required query parameter: key',
        });
        return;
    }

    const data = await axios.get(`https://www.beathletics.be/api/search/public/${key}`);

    // check if data is empty
    if (!data || !data.data) {
        res.status(404).json({
            status: 'error',
            message: 'Athletes not found',
        });
        return;
    }
    let athletes = data.data.athletes;
    
    athletes = athletes.map(athlete => {
        return {
            id: athlete.liveId,
            bib: athlete.bib,
            firstName: athlete.person.firstName,
            lastName: athlete.person.lastName,
            birthDate: athlete.person.birthDate,
            gender: athlete.person.gender,
            category: athlete.person.currentCategory,
            club: athlete.club ? athlete.club.abbr : null,
        }
    });

    res.status(200).json({
        status: 'success',
        message: 'Athletes retrieved successfully',
        data: athletes,
    });
});

app.get('/api/athletes/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({
            status: 'error',
            message: 'Missing required parameter: id',
        });
        return;
    }

    const data = await axios.get(`https://www.beathletics.be/api/athlete/new/${id}`);

    // check if data is empty
    if (!data || !data.data) {
        res.status(404).json({
            status: 'error',
            message: 'Athlete not found',
        });
        return;
    }
    let athlete = data.data;

    athlete = {
        id: athlete.liveId,
        bib: athlete.bib,
        firstName: athlete.person.firstName,
        lastName: athlete.person.lastName,
        birthDate: athlete.person.birthDate,
        gender: athlete.person.gender,
        category: calculateCategory(new Date(athlete.person.birthDate), new Date(), athlete.person.gender),
        club: athlete.club ? athlete.club.abbr : null,
    } 

    res.status(200).json({
        status: 'success',
        message: 'Athlete retrieved successfully',
        data: athlete,
    });
});

app.get('/api/athletes/:id/:event', async (req, res) => {


    const id = req.params.id;
    const event = req.params.event;

    const maxYears = req.query.maxYears ? parseInt(req.query.maxYears) : null;


    if (!id || !event) {
        res.status(400).json({
            status: 'error',
            message: 'Missing required parameter: id or event',
        });
        return;
    }

    let results = await getResultsByEvent(id, event);

    if (maxYears) {
        const now = new Date();
        results = results.filter(result => {
            const years = now.getFullYear() - result.date.getFullYear();
            return years <= maxYears;
        });
    }
    
    if (results.length === 0) {
        res.status(404).json({
            status: 'error',
            message: 'Results not found',
        });
        return;
    }
    
    let personalBests = null;
    
    for (let i = 0; i < results.length; i++) {
        if (personalBests === null) {
            personalBests = results[i];
        } else if (results[i].type === "time") {
            if (results[i].perf < personalBests.perf) {
                personalBests = results[i];
            }
        } else {
            if (results[i].perf > personalBests.perf) {
                personalBests = results[i];
            }
        }
    }

    res.status(200).json({
        status: 'success',
        message: 'Results retrieved successfully',
        data: personalBests,
    });
});

app.listen(port, () => console.log(`Athletes microservice listening on port ${port}!`));