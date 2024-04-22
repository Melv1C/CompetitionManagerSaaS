const express = require('express');
const axios = require('axios');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const prefix = process.env.PREFIX || '/api/athletes';
const competitionsUrl = process.env.GATEWAY_URL || process.env.COMPETITIONS_URL || 'http://localhost:3000';


// import function from utils.js
const { calculateCategory, getResults, getResultsByEvent, isOneDayAthlete, getAthletesByKey, getAthleteById } = require('./utils');
const { createDatabase, deleteDatabase, getDatabase, addAthlete, getAthletes, getAthlete } = require('./nano');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { initDB } = require('./init');

initDB();



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get(`${prefix}`, async (req, res) => {
    const key = req.query.key;
    if (!key) {
        res.status(400).json({
            status: 'error',
            message: 'Missing required query parameter: key',
        });
        return;
    }

    let athletes = await getAthletesByKey(key, 'global_athletes');

    athletes = athletes.map(athlete => {
        return {
            id: athlete.id,
            bib: athlete.bib,
            firstName: athlete.firstName,
            lastName: athlete.lastName,
            birthDate: athlete.birthDate,
            gender: athlete.gender,
            category: calculateCategory(new Date(athlete.birthDate), new Date(), athlete.gender),
            club: athlete.club ? athlete.club : null,
        }
    });

    /*

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
    */
    res.status(200).json({
        status: 'success',
        message: 'Athletes retrieved successfully',
        data: athletes,
    });

    
});

app.get(`${prefix}/:id`, async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({
            status: 'error',
            message: 'Missing required parameter: id',
        });
        return;
    }

    if (isOneDayAthlete(id)) {
        const OneDayathlete = await getAthlete(`competition_${id.split('_')[1]}`, id);
        res.status(200).json({
            status: 'success',
            message: 'Athlete retrieved successfully',
            data: OneDayathlete,
        });
        return;
    }

    /*

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

    */

    let athlete = await getAthleteById(id, 'global_athletes');

    athlete = {
        id: athlete.id,
        bib: athlete.bib,
        firstName: athlete.firstName,
        lastName: athlete.lastName,
        birthDate: athlete.birthDate,
        gender: athlete.gender,
        category: calculateCategory(new Date(athlete.birthDate), new Date(), athlete.gender),
        club: athlete.club ? athlete.club : null,
    };


    res.status(200).json({
        status: 'success',
        message: 'Athlete retrieved successfully',
        data: athlete,
    });
});

app.get(`${prefix}/:id/:event`, async (req, res) => {


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

    if (isOneDayAthlete(id)) {
        res.status(404).json({
            status: 'error',
            message: 'Results not found',
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


app.post(`${prefix}`, async (req, res) => {
    const { competitionId } = req.query;
    let athlete = req.body;

    if (!athlete || !athlete.firstName || !athlete.lastName || !athlete.birthDate || !athlete.gender) {
        return res.status(400).json({ status: 'error', message: 'Invalid athlete' });
    }

    if (!competitionId) {
        return res.status(400).json({ status: 'error', message: 'Invalid competitionId' });
    }

    const competition = (await axios.get(`${competitionsUrl}/api/competitions/${competitionId}`)).data.data;

    const oneDay = competition.oneDay;
    if (!oneDay) {
        return res.status(400).json({ status: 'error', message: 'Competition does not allow one day athletes' });
    }

    const oneDayBIB = parseInt(competition.oneDayBIB);
    // get next available bib number by check
    let bib = oneDayBIB;
    

    if (!(await getDatabase(`competition_${competitionId}`))) {
        await createDatabase(`competition_${competitionId}`);        
    } else {
        const athletes = await getAthletes(`competition_${competitionId}`);
        bib = athletes.length + oneDayBIB;
    }

    athlete = {
        firstName: athlete.firstName,
        lastName: athlete.lastName,
        birthDate: athlete.birthDate,
        gender: athlete.gender,
        club: athlete.club || "NA", // "NA" is the default value for "club" if it is not provided
        optionals: athlete.optionals || {},
        bib,
        id: `C_${competitionId}_${bib}`,
        _id: `C_${competitionId}_${bib}`,
        category: calculateCategory(new Date(athlete.birthDate), new Date(), athlete.gender),
    };

    // Add athlete to database
    await addAthlete(`competition_${competitionId}`, athlete);

    res.status(201).json({ status: 'success', message: 'Athlete added successfully', data: athlete });
});





app.listen(port, () => console.log(`Athletes microservice listening on port ${port}!`));