const express = require('express');
const axios = require('axios');

const { 
        getInscriptions,
        getInscription,
    } = require('./nano');


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

function matching(inscription, key) {
    const splitKey = key.split(' ');
    if (inscription.bib == key) {
        return true;
    } else {
        for (const word of splitKey) {
            if (!inscription.athleteName.toLowerCase().includes(word.toLowerCase())) {
                return false;
            }
        }
        return true;
    }
}

app.get('/api/confirmations/:competId', async (req, res) => {
    const key = req.query.key;
    const competId = req.params.competId;
    const inscriptions = await getInscriptions(`competition_${competId}`);
    let matchingInscr = [];
    if (key) {
        matchingInscr = inscriptions.filter((inscription) => matching(inscription, key));
    } else {
        matchingInscr = inscriptions;
    }
    res.status(200).json({ 
        status: 'success', 
        message: 'Inscriptions retrieved successfully',
        data: matchingInscr 
    });
});

app.listen(port, () => console.log(`Confirmations service listening on port ${port}!`));
