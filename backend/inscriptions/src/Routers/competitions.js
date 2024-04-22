const express = require('express');
const axios = require('axios');

const app = express.Router();

const {  createDatabase, deleteDatabase, getInscriptions, updateInscription } = require('../nano');
const { addViews } = require('../views');


// Create a database for a new competition
app.post('/api/inscriptions', async (req, res) => {
    console.log('Creating competition');
    const { competitionId } = req.body;

    if (!competitionId) {
        return res.status(400).json({ status: 'error', message: 'Invalid competitionId' });
    }

    createDatabase(`competition_${competitionId}`)
        .then(() => {
            addViews(`competition_${competitionId}`).then(() => {
                res.status(201).json({ status: 'success', message: 'Competition created successfully' });
            }).catch((err) => {
                console.error(err);
                res.status(500).json({ status: 'error', message: 'An error occurred while creating views' });
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while creating the competition' });
        });
});

// Delete a database for a competition
app.delete('/api/inscriptions/:competitionId', async (req, res) => {
    const { competitionId } = req.params;
    const check = req.query.adminId ? await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/${req.query.adminId}`).catch((err) => { 
        console.error(err);
        return false; 
    }) : false;
    const admin = check ? check.data.data : false;
    if (!admin) {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
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
app.put('/api/inscriptions/:competitionId/event/:oldEventName/:newEventName', async (req, res) => {
    const { competitionId, oldEventName, newEventName} = req.params;
    const { adminId, isMulti } = req.body;

    const check = await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/${adminId}`).catch((err) => {
        console.error(err);
        return false;
    });

    if (!check || !check.data.data) {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    const allInscriptions = await getInscriptions(`competition_${competitionId}`);
    for (let i = 0; i < allInscriptions.length; i++) {
        if (allInscriptions[i].event == oldEventName) {
            allInscriptions[i].event = newEventName;
            await updateInscription(`competition_${competitionId}`, allInscriptions[i]);
        }
    }

    if (isMulti) {
        for (let i = 0; i < allInscriptions.length; i++) {
            if (allInscriptions[i].parentEvent == oldEventName) {
                allInscriptions[i].parentEvent = newEventName;
                allInscriptions[i].event = allInscriptions[i].event.replace(oldEventName, newEventName);
                await updateInscription(`competition_${competitionId}`, allInscriptions[i]);
            }
        }
    }

    res.status(200).json({ status: 'success', message: 'Event name updated successfully' });
});


module.exports = { competitionsRouter: app };