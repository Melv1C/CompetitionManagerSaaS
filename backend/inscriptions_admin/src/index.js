const express = require('express');
const axios = require('axios');

require('dotenv').config();

const { createDatabase, deleteDatabase, addInscription, getInscriptions, getInscription } = require('./nano');

const app = express();
const port = process.env.PORT || 3000;
const prefix = process.env.PREFIX || '/api/admin/inscriptions';
const competitionsUrl = process.env.GATEWAY_URL || process.env.COMPETITIONS_URL || 'http://localhost:3000';

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

function checkPermission(competitionId, adminId) {
    if (!adminId) {
        throw new Error('Forbidden');
    }

    return axios.get(`${competitionsUrl}/api/competitions/${competitionId}/${adminId}`)
        .then((response) => {
            console.log(response.data);
            if (!response.data.data) {
                throw new Error('Forbidden');
            }
        })
        .catch((err) => {
            console.error(err);
            throw new Error('Forbidden');
        });
}

// Create a database for a new competition
app.post(`${prefix}`, async (req, res) => {
    const { competitionId } = req.body;
    const { adminId } = req.query;

    try {
        await checkPermission(competitionId, adminId);
    } catch (err) {
        return res.status(403).json({ status: 'error', message: err.message });
    }

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
app.delete(`${prefix}/:competitionId`, async (req, res) => {
    const { competitionId } = req.params;
    const { adminId } = req.query;

    if (!competitionId) {
        return res.status(400).json({ status: 'error', message: 'Invalid competitionId' });
    }

    try {
        await checkPermission(competitionId, adminId);
    } catch (err) {
        return res.status(403).json({ status: 'error', message: err.message });
    }

    deleteDatabase(`competition_${competitionId}`)
        .then(() => {
            res.status(200).json({ status: 'success', message: 'Competition deleted successfully' });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while deleting the competition' });
        });
});

// Update the name of a event for all inscriptions of a competition
app.put(`${prefix}/:competitionId/event`, async (req, res) => {
    const { competitionId } = req.params;
    const { adminId } = req.query;
    const { oldEventName,  newEventName } = req.body;
    const isMulti = req.body.isMulti || false;

    if (!competitionId && typeof competitionId !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid competitionId' });
    }
    if (!oldEventName && typeof oldEventName !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid oldEventName' });
    }
    if (!newEventName && typeof newEventName !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid newEventName' });
    }
    
    try {
        await checkPermission(competitionId, adminId);
    } catch (err) {
        return res.status(403).json({ status: 'error', message: err.message });
    }

    const allInscriptions = await getInscriptions(`competition_${competitionId}`);
    for (let i = 0; i < allInscriptions.length; i++) {
        if (allInscriptions[i].event == oldEventName) {
            allInscriptions[i].event = newEventName;
            await addInscription(`competition_${competitionId}`, allInscriptions[i]);
        }
    }

    if (isMulti) {
        for (let i = 0; i < allInscriptions.length; i++) {
            if (allInscriptions[i].parentEvent == oldEventName) {
                allInscriptions[i].parentEvent = newEventName;
                allInscriptions[i].event = allInscriptions[i].event.replace(oldEventName, newEventName);
                await addInscription(`competition_${competitionId}`, allInscriptions[i]);
            }
        }
    }

    res.status(200).json({ status: 'success', message: 'Event name updated successfully' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});