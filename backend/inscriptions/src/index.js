const express = require('express');
const axios = require('axios');

const { createDatabase,
        deleteDatabase,
        getInscriptions,
        getInscription,
        deleteInscription,
        freeInscriptions,
        stripeInscriptions
    } = require('./utils');

const app = express();
const port = 3000;

const privateFields = ['_rev', 'userId'];
function removePrivateFields(inscription) {
    for (field of privateFields) {
        delete inscription[field];
    }
    return inscription;
}

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
            const data = inscriptions.map((inscription) => removePrivateFields(inscription));
            res.status(200).json({ status: 'success', message: 'Inscriptions retrieved successfully', data: data });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while fetching inscriptions' });
        });
});

//Get info about an athlete'
app.get('/api/inscriptions/:competitionId/athletes/:athleteId', async (req, res) => {
    const { competitionId, athleteId } = req.params;
    const userId = req.query.userId;

    getInscriptions(`competition_${competitionId}`)
        .then((inscriptions) => {
            const athleteInscriptions = inscriptions.filter((inscription) => inscription.athleteId == athleteId);
            if (athleteInscriptions.length == 0) {
                res.status(200).json({ status: 'success', message: 'Athlete not inscribed', data: { isInsribed: false, ownByUser: false } });
            } else {
                const ownByUser = inscriptions[0].userId == userId;
                res.status(200).json({ status: 'success', message: 'Athlete inscribed', data: { isInsribed: true, ownByUser: ownByUser } });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while fetching athlete info' });
        });
});


// Get a single inscription for a competition
app.get('/api/inscriptions/:competitionId/:inscriptionId', (req, res) => {
    const { competitionId, inscriptionId } = req.params;
    getInscription(`competition_${competitionId}`, inscriptionId)
        .then((inscription) => {
            res.status(200).json({ status: 'success', message: 'Inscription retrieved successfully', data: removePrivateFields(inscription)});
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
    const { athleteId, events, records } = req.body;

    const success_url = req.body.success_url || `http://localhost/competitions/${competitionId}?subPage=inscription&athleteId=${athleteId}&step=5`;
    const cancel_url = req.body.cancel_url || `http://localhost/competitions/${competitionId}?subPage=inscription&athleteId=${athleteId}&step=4`;

    let admin = false;

    try {
        // admin = req.query.admin ? (await axios.get(`${process.env.ADMINS_URL}/api/admins/${req.query.admin}`)).data.data : false;
        admin = req.query.admin ? (await axios.get(`http://admins-service:3000/api/admins/${req.query.admin}`)).data.data : false;
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
    if (!events || !Array.isArray(events) || events.length === 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid events' });
    }
    if (!records || typeof records !== 'object' || Object.keys(records).length === 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid records' });
    }

    // get info from other services

    // get athlete info
    const athleteInfo = (await axios.get(`${process.env.ATHLETES_URL}/api/athletes/${athleteId}`)).data.data;

    // get events info
    const eventsInfo = (await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/events?category=${athleteInfo.category}`)).data.data;

    // check events
    const validEvents = eventsInfo.map((event) => event.pseudoName);
    for (let i = 0; i < events.length; i++) {
        if (!validEvents.includes(events[i])) {
            return res.status(400).json({ status: 'error', message: 'Invalid event' });
        }
    }

    // check if athlete is already inscribed
    const allInscriptions = await getInscriptions(`competition_${competitionId}`);
    if (allInscriptions.some((inscription) => inscription.athleteId == athleteId)) {
        return res.status(400).json({ status: 'error', message: 'Athlete already inscribed' });
    }
    
    // check if place is available (if event.maxParticipants compare with number of inscriptions)
    for (let i = 0; i < events.length; i++) {
        const eventInfo = eventsInfo.find((event) => event.pseudoName == events[i]);
        if (eventInfo.maxParticipants <= allInscriptions.filter((inscription) => inscription.event == events[i]).length) {
            return res.status(400).json({ status: 'error', message: 'No place available for ' + events[i] });
        }
    }

    // calculate total cost
    let totalCost = 0;
    for (let i = 0; i < events.length; i++) {
        const eventInfo = eventsInfo.find((event) => event.pseudoName == events[i]);
        console.log(eventInfo.cost);
        totalCost += eventInfo.cost;
    }
    console.log(totalCost);

    // Insert inscriptions

    let inscriptionData = [];
    for (let i = 0; i < events.length; i++) {
        const newInscription = { 
            userId, 
            athleteId, 
            athleteName: athleteInfo.firstName + ' ' + athleteInfo.lastName, 
            club: athleteInfo.club,
            bib: athleteInfo.bib, 
            event: events[i], 
            record: records[events[i]], 
        };
        inscriptionData.push(newInscription);       
    }

    if (totalCost == 0 || admin) {
        await freeInscriptions(`competition_${competitionId}`, inscriptionData);
        res.status(201).json({ status: 'success', message: 'Inscriptions added successfully' });
        return;
    } else {
        const response = await stripeInscriptions(`competition_${competitionId}`, inscriptionData, eventsInfo.filter((event) => events.includes(event.pseudoName)), success_url, cancel_url);
        console.log(response);
        res.status(200).json({ status: 'success', message: 'Redirect to payment', data: response });
    } 
});

// Update an inscription for a competition
app.put('/api/inscriptions/:competitionId/:athleteId', async (req, res) => {
    const { competitionId, athleteId } = req.params;
    let userId = req.body.userId;
    const { events, records } = req.body;

    let admin = false;

    try {
        admin = req.query.admin ? (await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/admins?userId=${req.query.admin}`)).data.data : false;
    } catch (err) {
        admin = false;
    }
    
    // check body elements
    if ((!userId || typeof userId !== 'string') && !admin) {
        return res.status(400).json({ status: 'error', message: 'Invalid userId' });
    }
    if (!athleteId || typeof athleteId !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid athleteId' });
    }
    if (!events || !Array.isArray(events) || events.length === 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid events' });
    }
    if (!records || typeof records !== 'object' || Object.keys(records).length === 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid records' });
    }

    // get info from other services

    // get athlete info
    const athleteInfo = (await axios.get(`${process.env.ATHLETES_URL}/api/athletes/${athleteId}`)).data.data;

    // get events info
    const eventsInfo = (await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/events?category=${athleteInfo.category}`)).data.data;

    // check events
    const validEvents = eventsInfo.map((event) => event.pseudoName);
    for (let i = 0; i < events.length; i++) {
        if (!validEvents.includes(events[i])) {
            return res.status(400).json({ status: 'error', message: 'Invalid event' });
        }
    }

    // check if athlete is already inscribed
    const allInscriptions = await getInscriptions(`competition_${competitionId}`);
    const athleteInscriptions = allInscriptions.filter((inscription) => inscription.athleteId == athleteId);
    if (athleteInscriptions.length == 0) {
        return res.status(400).json({ status: 'error', message: 'Athlete not inscribed (not PUT but POST)' });
    }

    // check if userId corresponds to the one in the inscription
    const userIdFromInscription = athleteInscriptions[0].userId;
    if (!admin) {
        if (userId != userIdFromInscription) {
            return res.status(403).json({ status: 'error', message: 'Forbidden (userId does not correspond to the one in the inscription)' });
        }
    } else {
        userId = userIdFromInscription;
    }

    // check if place is available (if event.maxParticipants compare with number of inscriptions)
    for (let i = 0; i < events.length; i++) {
        if (!athleteInscriptions.some((inscription) => inscription.event == events[i])) {
            const eventInfo = eventsInfo.find((event) => event.pseudoName == events[i]);
            if (eventInfo.maxParticipants <= allInscriptions.filter((inscription) => inscription.event == events[i]).length) {
                return res.status(400).json({ status: 'error', message: 'No place available for ' + events[i] });
            }
        }
    }

    // delete inscriptions for events not in the new list
    for (let i = 0; i < athleteInscriptions.length; i++) {
        if (!events.includes(athleteInscriptions[i].event)) {
            await deleteInscription(`competition_${competitionId}`, athleteInscriptions[i]._id, athleteInscriptions[i]._rev);
        }
    }

    // Update inscriptions
    let inscriptionData = [];
    for (let i = 0; i < events.length; i++) {
        if(athleteInscriptions.some((inscription) => inscription.event == events[i])) {
            const oldinscription = athleteInscriptions.find((inscription) => inscription.event == events[i]);
            const newInscription = { 
                _id: oldinscription._id,
                _rev: oldinscription._rev,
                userId, 
                athleteId, 
                athleteName: athleteInfo.firstName + ' ' + athleteInfo.lastName, 
                club: athleteInfo.club,
                bib: athleteInfo.bib, 
                event: events[i], 
                record: records[events[i]], 
            };
            inscriptionData.push(newInscription);
        } else {
            const newInscription = { 
                userId, 
                athleteId, 
                athleteName: athleteInfo.firstName + ' ' + athleteInfo.lastName, 
                club: athleteInfo.club,
                bib: athleteInfo.bib, 
                event: events[i], 
                record: records[events[i]], 
            };
            inscriptionData.push(newInscription);
        }
    }

    await freeInscriptions(`competition_${competitionId}`, inscriptionData);

    res.status(200).json({ status: 'success', message: 'Inscriptions updated successfully' });
});

// Delete all inscriptions of an athlete for a competition
app.delete('/api/inscriptions/:competitionId/:athleteId', async (req, res) => {
    const { competitionId, athleteId } = req.params;
    let userId = req.body.userId;

    let admin = false;

    try {
        admin = req.query.admin ? (await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/admins?userId=${req.query.admin}`)).data.data : false;
    } catch (err) {
        admin = false;
    }

    if ((!userId || typeof userId !== 'string') && !admin) {
        return res.status(400).json({ status: 'error', message: 'Invalid userId' });
    }
    
    // check if athlete is already inscribed
    const allInscriptions = await getInscriptions(`competition_${competitionId}`);
    const athleteInscriptions = allInscriptions.filter((inscription) => inscription.athleteId == athleteId);
    if (athleteInscriptions.length == 0) {
        return res.status(400).json({ status: 'error', message: 'Athlete not inscribed' });
    }

    // check if userId corresponds to the one in the inscription
    const userIdFromInscription = athleteInscriptions[0].userId;
    if (!admin) {
        if (userId != userIdFromInscription) {
            return res.status(403).json({ status: 'error', message: 'Forbidden (userId does not correspond to the one in the inscription)' });
        }
    } 

    // delete inscriptions
    for (let i = 0; i < athleteInscriptions.length; i++) {
        await deleteInscription(`competition_${competitionId}`, athleteInscriptions[i]._id, athleteInscriptions[i]._rev);
    }

    res.status(200).json({ status: 'success', message: 'Inscriptions deleted successfully' });
});

app.listen(port, () => console.log(`Inscriptions service listening on port ${port}!`));
