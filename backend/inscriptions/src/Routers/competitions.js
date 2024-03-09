const express = require('express');

const app = express.Router();

const { createDatabase, deleteDatabase } = require('../nano');

// Create a database for a new competition
app.post('/api/inscriptions', (req, res) => {
    console.log('Creating competition');
    const { competitionId } = req.body;

    if (!competitionId) {
        return res.status(400).json({ status: 'error', message: 'Invalid competitionId' });
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

module.exports = { competitionsRouter: app };