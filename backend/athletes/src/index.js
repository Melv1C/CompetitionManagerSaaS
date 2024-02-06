const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

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

    console.log("Searching for athletes with key: " + key);

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

app.listen(port, () => console.log(`Athletes microservice listening on port ${port}!`));