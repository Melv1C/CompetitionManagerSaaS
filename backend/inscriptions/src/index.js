const express = require('express');
const axios = require('axios');

const { createDatabase,
        deleteDatabase,
        addInscription,
        getInscriptions,
        getInscription,
        updateInscription,
        deleteInscription } = require('./utils');

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

// Create a database for a new competition
app.post('/api/inscriptions', (req, res) => {
    const { competitionId } = req.body;
    createDatabase(`competition_${competitionId}`)
        .then(() => {
            res.status(201).json({ status: 'success', message: 'Competition created successfully' });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while creating the competition' });
        });
});

// Delete a database for a competition
app.delete('/api/inscriptions/:competitionId', (req, res) => {
    const { competitionId } = req.params;
    deleteDatabase(`competition_${competitionId}`)
        .then(() => {
            res.status(200).json({ status: 'success', message: 'Competition deleted successfully' });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while deleting the competition' });
        });
});

//Get information about a competition
app.get('/api/inscriptions/:competitionId/info', (req, res) => {
    const competitionId = req.params.competitionId;
    getInscriptions(`competition_${competitionId}`)
        .then((inscriptions) => {
            res.status(200).json({ status: 'success', message: 'Competition info retrieved successfully', data: { id: competitionId, numberOfInscriptions: inscriptions.length, numberOfParticipants: new Set(inscriptions.map((inscription) => inscription.athleteId)).size } });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while fetching competition info' });
        });    
});

// Get all inscriptions for a competition
app.get('/api/inscriptions/:competitionId', (req, res) => {
    const { competitionId } = req.params;
    getInscriptions(`competition_${competitionId}`)
        .then((inscriptions) => {
            const data = inscriptions.map((inscription) => ({ _id: inscription._id, athleteId: inscription.athleteId, athleteName: inscription.athleteName, event: inscription.event, record: inscription.record }));
            res.status(200).json({ status: 'success', message: 'Inscriptions retrieved successfully', data: data });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while fetching inscriptions' });
        });
});

// Get a single inscription for a competition
app.get('/api/inscriptions/:competitionId/:inscriptionId', (req, res) => {
    const { competitionId, inscriptionId } = req.params;
    const userId = req.query.userId;
    getInscription(`competition_${competitionId}`, inscriptionId)
        .then((inscription) => {
            if (userId && userId == inscription.userId) {
                return res.status(200).json({ status: 'success', message: 'Inscription retrieved successfully', data: inscription });
            }
            const data = { _id: inscription._id, athleteId: inscription.athleteId, athleteName: inscription.athleteName, event: inscription.event, record: inscription.record };
            res.status(200).json({ status: 'success', message: 'Inscription retrieved successfully', data: data });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while fetching inscription' });
        });
});

// Add a new inscription for a competition
app.post('/api/inscriptions/:competitionId', async (req, res) => {
    const { competitionId } = req.params;
    let userId = req.body.userId;
    const { athleteId, athleteName, event, club } = req.body;
    const record = req.body.record || '';

    let admin = false;

    try {
        admin = req.query.admin ? (await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/admins?userId=${req.query.admin}`)).data.data : false;
    } catch (err) {
        admin = false;
    }

    if (admin) {
        userId = "admin";
    }

    // check body elements
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid userId' });
    }
    if (!athleteId || typeof athleteId !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid athleteId' });
    }
    if (!athleteName || typeof athleteName !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid athleteName' });
    }
    if (!event || typeof event !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid event' });
    }
    if (!club || typeof club !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid club' });
    }
    if (!record || typeof record !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid record' });
    }

    const inscription = { userId, athleteId, athleteName, event, record, club };

    addInscription(`competition_${competitionId}`, inscription)
        .then(() => {
            res.status(201).json({ status: 'success', message: 'Inscription added successfully' });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while adding inscription' });
        });
});

// Update an inscription for a competition
app.put('/api/inscriptions/:competitionId/:inscriptionId', async (req, res) => {
    const { competitionId, inscriptionId } = req.params;
    let userId = req.body.userId;
    const { athleteId, athleteName, event, club } = req.body;
    const record = req.body.record || '';
    const _rev = req.body._rev;

    let admin = false;

    try {
        admin = req.query.admin ? (await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/admins?userId=${req.query.admin}`)).data.data : false;
    } catch (err) {
        admin = false;
    }
    
    // check body elements
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid userId' });
    }
    if (!athleteId || typeof athleteId !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid athleteId' });
    }
    if (!athleteName || typeof athleteName !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid athleteName' });
    }
    if (!event || typeof event !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid event' });
    }
    if (!club || typeof club !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid club' });
    }
    if (!record || typeof record !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid record' });
    }
    if ((!_rev || typeof _rev !== 'string') && !admin) {
        return res.status(400).json({ status: 'error', message: 'Invalid _rev' });
    }

    getInscription(`competition_${competitionId}`, inscriptionId)
        .then((inscription) => {
            if (userId != inscription.userId && !admin) {
                return res.status(403).json({ status: 'error', message: 'Forbidden' });
            }
            const newInscription = { _id: inscriptionId, _rev: (admin ? inscription._rev : _rev), userId: (admin ? inscription.userId : userId), athleteId, athleteName, event, record, club };
            return updateInscription(`competition_${competitionId}`, newInscription);
        })
        .then(() => {
            res.status(200).json({ status: 'success', message: 'Inscription updated successfully' });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while updating inscription' });
        });    
});

// Delete an inscription for a competition
app.delete('/api/inscriptions/:competitionId/:inscriptionId', async (req, res) => {
    const { competitionId, inscriptionId } = req.params;
    const _rev = req.body._rev;
    let userId = req.body.userId;

    let admin = false;

    try {
        admin = req.query.admin ? (await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/admins?userId=${req.query.admin}`)).data.data : false;
    } catch (err) {
        admin = false;
    }
    
    if (admin) {
        userId = "admin";
    }

    // check body elements
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid userId' });
    }
    if (!_rev || typeof _rev !== 'string' && !admin) {
        return res.status(400).json({ status: 'error', message: 'Invalid _rev' });
    }

    getInscription(`competition_${competitionId}`, inscriptionId)
        .then((inscription) => {
            if (userId != inscription.userId && !admin) {
                return res.status(403).json({ status: 'error', message: 'Forbidden' });
            }
            return deleteInscription(`competition_${competitionId}`, inscriptionId, (admin ? inscription._rev : _rev));
        })
        .then(() => {
            res.status(200).json({ status: 'success', message: 'Inscription deleted successfully' });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while deleting inscription' });
        });
});

app.listen(port, () => console.log(`Inscriptions service listening on port ${port}!`));
