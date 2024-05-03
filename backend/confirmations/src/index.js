const express = require('express');
const axios = require('axios');
const competitionsUrl = process.env.GATEWAY_URL || process.env.COMPETITIONS_URL || 'http://localhost:3000';

const { 
    getInscriptions,
    getInscription,
    addInscription,
    updateInscription,
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

app.post('/api/confirmations/:competId/:athleteId', async (req, res) => {
    const competId = req.params.competId;
    const athleteId = req.params.athleteId;
    const userId = req.body.userId;


    const check = await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competId}/${userId}`).catch((err) => { 
        console.error(err);
        return false; 
    });

    if (!check || !check.data.data) {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }



    console.log(competId, athleteId);
    const inscriptions = (await getInscriptions(`competition_${competId}`)).filter((inscription) => inscription.athleteId === athleteId);
    console.log(inscriptions);
    if (inscriptions) {
        for (const inscription of inscriptions) {
            if (inscription.athleteId === athleteId) {
                inscription.confirmed = true;
                inscription.absent = false;
                await updateInscription(`competition_${competId}`, inscription);
            }
        }
        res.status(200).json({ 
            status: 'success', 
            message: 'Athlete confirmed successfully',
            data: null
        });
    } else {
        res.status(404).json({ 
            status: 'fail', 
            message: 'Inscription not found',
            data: null 
        });
    }
});

app.delete('/api/confirmations/:competId/:athleteId/:userId', async (req, res) => {
    const competId = req.params.competId;
    const athleteId = req.params.athleteId;
    const userId = req.params.userId;


    const check = await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competId}/${userId}`).catch((err) => { 
        console.error(err);
        return false; 
    });

    if (!check || !check.data.data) {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    const inscriptions = (await getInscriptions(`competition_${competId}`)).filter((inscription) => inscription.athleteId === athleteId);
    if (inscriptions) {
        for (const inscription of inscriptions) {
            if (inscription.athleteId === athleteId) {
                inscription.confirmed = false;
                inscription.absent = false;
                await updateInscription(`competition_${competId}`, inscription);
            }
        }
        res.status(200).json({ 
            status: 'success', 
            message: 'Athlete unconfirmed successfully',
            data: null
        });
    } else {
        res.status(404).json({ 
            status: 'fail', 
            message: 'Inscription not found',
            data: null 
        });
    }
});

app.delete('/api/confirmations/remove/:competitionId/:athleteId/:eventName/:adminId', async (req, res) => {
    const { competitionId, athleteId, eventName, adminId } = req.params;

    if (!competitionId && typeof competitionId !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid competitionId' });
    }
    if (!athleteId && typeof athleteId !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid athleteId' });
    }
    if (!eventName && typeof eventName !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid eventName' });
    }

    const check = await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/${adminId}`).catch((err) => {
        return false;
    });

    if (!check || !check.data.data) {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    const allInscriptions = await getInscriptions(`competition_${competitionId}`);
    for (let i = 0; i < allInscriptions.length; i++) {
        if (allInscriptions[i].athleteId == athleteId && allInscriptions[i].event == eventName) {
            allInscriptions[i].confirmed = false;
            allInscriptions[i].removed = true;
            await updateInscription(`competition_${competitionId}`, allInscriptions[i]); 
        }
    }

    res.status(200).json({ status: 'success', message: 'Inscription removed successfully' });
});




app.delete('/api/confirmations/absent/:competId/:athleteId/:userId', async (req, res) => {
    const competId = req.params.competId;
    const athleteId = req.params.athleteId;
    const userId = req.params.userId;


    const check = await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competId}/${userId}`).catch((err) => { 
        console.error(err);
        return false; 
    });

    if (!check || !check.data.data) {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    const inscriptions = (await getInscriptions(`competition_${competId}`)).filter((inscription) => inscription.athleteId === athleteId);
    if (inscriptions) {
        for (const inscription of inscriptions) {
            if (inscription.athleteId === athleteId) {
                inscription.confirmed = false;
                inscription.absent = true;
                await updateInscription(`competition_${competId}`, inscription);
            }
        }
        res.status(200).json({ 
            status: 'success', 
            message: 'Athlete set as absent successfully',
            data: null
        });
    } else {
        res.status(404).json({ 
            status: 'fail', 
            message: 'Inscription not found',
            data: null 
        });
    }
});

app.post('/api/confirmations/absent/:competId/:athleteId/:userId', async (req, res) => {
    const competId = req.params.competId;
    const athleteId = req.params.athleteId;
    const userId = req.params.userId;


    const check = await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competId}/${userId}`).catch((err) => { 
        console.error(err);
        return false; 
    });

    if (!check || !check.data.data) {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    const inscriptions = (await getInscriptions(`competition_${competId}`)).filter((inscription) => inscription.athleteId === athleteId);
    if (inscriptions) {
        for (const inscription of inscriptions) {
            if (inscription.athleteId === athleteId) {
                inscription.absent = false;
                await updateInscription(`competition_${competId}`, inscription);
            }
        }
        res.status(200).json({ 
            status: 'success', 
            message: 'Athlete set as present successfully',
            data: null
        });
    } else {
        res.status(404).json({ 
            status: 'fail', 
            message: 'Inscription not found',
            data: null 
        });
    }
});

app.listen(port, () => console.log(`Confirmations service listening on port ${port}!`));
