const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/athletes', async (req, res) => {
    const name = req.query.name;
    if (!name) {
        res.status(400).json({
            status: 'error',
            message: 'Missing required query parameter: name',
        });
        return;
    }

    console.log("Searching for athletes with name: " + name);

    const data = await axios.get(`https://www.beathletics.be/api/search/public/${name}`);

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

app.get('/athletes/:id', async (req, res) => {
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
        category: null, // TODO: function to calculate category from birthDate
        club: athlete.club ? athlete.club.abbr : null,
    } 

    res.status(200).json({
        status: 'success',
        message: 'Athlete retrieved successfully',
        data: athlete,
    });
});

app.listen(port, () => console.log(`Athletes microservice listening on port ${port}!`));