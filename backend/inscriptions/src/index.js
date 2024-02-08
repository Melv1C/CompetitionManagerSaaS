const express = require('express');
const axios = require('axios');

const { createDatabase } = require('./utils');

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

app.get('/api/inscriptions', (req, res) => {
    res.send('Bienvenue dans le service d\'inscriptions');
});

// Create a database for a new competition
app.post('/api/inscriptions', (req, res) => {
    const { competitionId } = req.body;
    createDatabase(`competition_${competitionId}`)
        .then(() => {
            res.status(201).send('Database created');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error creating database');
        });
});

app.listen(port, () => console.log(`Inscriptions service listening on port ${port}!`));
