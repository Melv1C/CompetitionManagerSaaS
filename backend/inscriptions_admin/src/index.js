const express = require('express');
const axios = require('axios');

require('dotenv').config();

const { createDatabase, deleteDatabase, addInscription, getInscriptions, getInscription, deleteInscription, getAllInscriptions, getDesinscriptions, restoreInscription } = require('./nano');
const { checkParams, checkEvents, checkInscriptions, getData, freeInscriptions } = require('./utils');

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


// Get all inscriptions for a competition for BackUp
app.get(`${prefix}/backup/:competitionId`, async (req, res) => {
    const { competitionId } = req.params;
    const { adminId } = req.query;

    try {
        await checkPermission(competitionId, adminId);
    } catch (err) {
        return res.status(403).json({ status: 'error', message: err.message });
    }

    getInscriptions(`competition_${competitionId}`)
        .then((inscriptions) => {
            res.status(200).json({ status: 'success', message: 'Inscriptions retrieved successfully', data: inscriptions });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while fetching inscriptions' });
        });
});

app.get(`${prefix}/:competitionId`, async (req, res) => {
    const { competitionId } = req.params;
    try {
        await checkPermission(competitionId, adminId);
    } catch (err) {
        return res.status(403).json({ status: 'error', message: err.message });
    }

    getInscriptions(`competition_${competitionId}`)
        .then((inscriptions) => {
            res.status(200).json({ status: 'success', message: 'Inscriptions retrieved successfully', data: inscriptions });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while fetching inscriptions' });
        });
});

app.get(`${prefix}/:competitionId`, async (req, res) => {
    const { competitionId } = req.params;

    getInscriptions(`competition_${competitionId}`)
        .then((inscriptions) => {
            res.status(200).json({ status: 'success', message: 'Inscriptions retrieved successfully', data: inscriptions });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while fetching inscriptions' });
        });
});

app.get(`${prefix}/:competitionId/:userId`, async (req, res) => {
    const { competitionId, userId } = req.params;
    
    try {
        await checkPermission(competitionId, userId);
    } catch (err) {
        return res.status(403).json({ status: 'error', message: err.message });
    }

    getAllInscriptions(`competition_${competitionId}`)
        .then((inscriptions) => {
            res.status(200).json({ status: 'success', message: 'All inscriptions retrieved successfully', data: inscriptions});
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while fetching inscriptions' });
        });
});

app.get(`${prefix}/:competitionId/desinscriptions/:userId`, async (req, res) => {
    const { competitionId, userId } = req.params;

    try {
        await checkPermission(competitionId, adminId);
    } catch (err) {
        return res.status(403).json({ status: 'error', message: err.message });
    }

    getDesinscriptions(`competition_${competitionId}`)
        .then((inscriptions) => {
            res.status(200).json({ status: 'success', message: 'All desinscriptions retrieved successfully', data: inscriptions});
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'An error occurred while fetching desinscriptions' });
        });
});


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

// add an inscription to a competition
app.post(`${prefix}/:competitionId`, async (req, res) => {
    const { competitionId } = req.params;
    let userId = req.body.userId;
    const { athleteId, events, records, email } = req.body;

    const success_url = req.body.success_url || `http://localhost/competitions/${competitionId}?subPage=inscription&athleteId=${athleteId}&step=5`;
    const cancel_url = req.body.cancel_url || `http://localhost/competitions/${competitionId}?subPage=inscription&athleteId=${athleteId}&step=4`;

    const check = await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/${userId}`).catch((err) => { 
        console.error(err);
        return false; 
    });

    if (!check || !check.data.data) {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    // check body elements
    const checkParamsResult = checkParams(userId, athleteId, events, records, success_url, cancel_url);
    if (checkParamsResult) {
        return res.status(400).json(checkParamsResult);
    }

    const [athlete, competition, allEvents, inscriptions] = await getData(athleteId, competitionId);
    const eventsInfo = allEvents.filter((event) => events.includes(event.pseudoName));

    // check athlete
    if (!athlete) {
        return res.status(400).json({ status: 'error', message: 'Invalid athleteId' });
    }

    // check events
    const checkEventsResult = checkEvents(events, allEvents);
    if (checkEventsResult) {
        return res.status(400).json(checkEventsResult);
    }

    // check if athlete is already inscribed
    if (checkInscriptions(inscriptions, athleteId)) {
        return res.status(400).json({ status: 'error', message: 'Athlete already inscribed' });
    }

    // Timestamp
    const timestamp = new Date();

    let inscriptionData = [];
    for (let event of eventsInfo) {

        inscriptionData.push({ 
            timestamp,
            userId, 
            email,
            athleteId, 
            athleteName: athlete.firstName + ' ' + athlete.lastName, 
            club: athlete.club,
            bib: athlete.bib, 
            category: athlete.category,
            event: event.pseudoName, 
            record: (event.subEvents.length == 0) ? records[event.pseudoName] : records[event.pseudoName]["total"],
            recordType: event.type,
            eventType: (event.subEvents.length == 0) ? "event" : "multiEvent",
            parentEvent: null,
            cost: 0, 
            confirmed: false,
            inscribed: true
        });   
        
        for (let subEvent of event.subEvents) {
            inscriptionData.push({
                timestamp,
                userId,
                email,
                athleteId,
                athleteName: athlete.firstName + ' ' + athlete.lastName,
                club: athlete.club,
                bib: athlete.bib,
                category: athlete.category,
                event: `${event.pseudoName} - ${subEvent.name}`,
                record: records[event.pseudoName][subEvent.name],
                recordType: subEvent.type,
                eventType: "subEvent",
                parentEvent: event.pseudoName,
                cost: 0,
                confirmed: false,
                inscribed: true
            });
        }
    }

    await freeInscriptions(`competition_${competitionId}`, inscriptionData);
    res.status(201).json({ status: 'success', message: 'Inscriptions added successfully' });
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

app.put(`${prefix}/:competitionId/:inscriptionId/restore/:adminId`, async (req, res) => {
    const { competitionId, inscriptionId, adminId } = req.params;
    if (!competitionId && typeof competitionId !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid competitionId' });
    }
    if (!inscriptionId && typeof inscriptionId !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid inscriptionId' });
    }

    try {
        await checkPermission(competitionId, adminId);
    } catch (err) {
        return res.status(403).json({ status: 'error', message: err.message });
    }
    try {
        await restoreInscription(`competition_${competitionId}`, inscriptionId);
        const inscriptions = await getAllInscriptions(`competition_${competitionId}`)
        res.status(200).json({ status: 'success', message: 'Inscription restored successfully', data: inscriptions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'An error occurred while restoring the inscription' });
    }
});



// Update an inscription for a competition
app.put(`${prefix}/:competitionId/:athleteId`, async (req, res) => {
    const { competitionId, athleteId } = req.params;
    const userId = req.body.userId;
    const { events, records, email } = req.body;
    
    const success_url = req.body.success_url || `http://localhost/competitions/${competitionId}?subPage=inscription&athleteId=${athleteId}&step=5`;
    const cancel_url = req.body.cancel_url || `http://localhost/competitions/${competitionId}?subPage=inscription&athleteId=${athleteId}&step=4`;

    const check = await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/${userId}`).catch((err) => { 
        console.error(err);
        return false; 
    });
    
    if (!check || !check.data.data) {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    // check body elements
    const checkParamsResult = checkParams(userId, athleteId, events, records, success_url, cancel_url);
    if (checkParamsResult) {
        return res.status(400).json(checkParamsResult);
    }

    // get info from other services
    const [athlete, competition, allEvents, inscriptions] = await getData(athleteId, competitionId);
    const eventsInfo = allEvents.filter((event) => events.includes(event.pseudoName));

    // check athlete
    if (!athlete) {
        return res.status(400).json({ status: 'error', message: 'Invalid athleteId' });
    }

    // check events
    const checkEventsResult = checkEvents(events, allEvents);
    if (checkEventsResult) {
        return res.status(400).json(checkEventsResult);
    }


    // check if athleteId corresponds to the one in the inscription
    const athleteInscriptions = inscriptions.filter((inscription) => inscription.athleteId == athleteId);

    const oldUserId = athleteInscriptions[0].userId;

    // Delete inscriptions for events that are not in the new list
    for (let i = 0; i < athleteInscriptions.length; i++) {
        if (athleteInscriptions[i].eventType == "event" && !events.includes(athleteInscriptions[i].event)) {
            await deleteInscription(`competition_${competitionId}`, athleteInscriptions[i]._id, athleteInscriptions[i]._rev);
        } else if (athleteInscriptions[i].eventType == "multiEvent" && !events.includes(athleteInscriptions[i].event)) {
            await deleteInscription(`competition_${competitionId}`, athleteInscriptions[i]._id, athleteInscriptions[i]._rev);
        } else if (athleteInscriptions[i].eventType == "subEvent" && !events.includes(athleteInscriptions[i].parentEvent)) {
            await deleteInscription(`competition_${competitionId}`, athleteInscriptions[i]._id, athleteInscriptions[i]._rev);
        }
    }

    // Timestamp
    const timestamp = new Date();

    // Add inscriptions for new events
    let inscriptionData = [];
    for (let event of eventsInfo) {
        if (!athleteInscriptions.some((inscription) => inscription.event == event.pseudoName)) {
            inscriptionData.push({ 
                timestamp,
                oldUserId,
                email,
                athleteId, 
                athleteName: athlete.firstName + ' ' + athlete.lastName, 
                club: athlete.club,
                bib: athlete.bib, 
                category: athlete.category,
                event: event.pseudoName, 
                record: (event.subEvents.length == 0) ? records[event.pseudoName] : records[event.pseudoName]["total"],
                recordType: event.type,
                eventType: (event.subEvents.length == 0) ? "event" : "multiEvent",
                parentEvent: null,
                cost: 0,
                confirmed: false,
                inscribed: true
            });   
            
            for (let subEvent of event.subEvents) {
                inscriptionData.push({
                    timestamp,
                    oldUserId,
                    email,
                    athleteId,
                    athleteName: athlete.firstName + ' ' + athlete.lastName,
                    club: athlete.club,
                    bib: athlete.bib,
                    category: athlete.category,
                    event: `${event.pseudoName} - ${subEvent.name}`,
                    record: records[event.pseudoName][subEvent.name],
                    recordType: subEvent.type,
                    eventType: "subEvent",
                    parentEvent: event.pseudoName,
                    cost: 0,
                    confirmed: false,
                    inscribed: true
                });
            }

        } else {
            let inscription = athleteInscriptions.find((inscription) => inscription.event == event.pseudoName);
            inscription.record = (event.subEvents.length == 0) ? records[event.pseudoName] : records[event.pseudoName]["total"];
            inscriptionData.push(inscription);

            for (let subEvent of event.subEvents) {
                let subInscription = athleteInscriptions.find((inscription) => inscription.event == `${event.pseudoName} - ${subEvent.name}`);
                subInscription.record = records[event.pseudoName][subEvent.name];
                inscriptionData.push(subInscription);
            }
        }
    }
    await freeInscriptions(`competition_${competitionId}`, inscriptionData);
    res.status(200).json({ status: 'success', message: 'Inscriptions updated successfully' });
});


// Delete an inscription for a competition
app.delete(`${prefix}/:competitionId/:inscriptionId/:adminId`, async (req, res) => {
    const { competitionId, inscriptionId, adminId } = req.params;

    if (!competitionId && typeof competitionId !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid competitionId' });
    }
    if (!inscriptionId && typeof inscriptionId !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Invalid inscriptionId' });
    }

    try {
        await checkPermission(competitionId, adminId);
    } catch (err) {
        return res.status(403).json({ status: 'error', message: err.message });
    }

    const inscription = await getInscription(`competition_${competitionId}`, inscriptionId);
    if (!inscription) {
        return res.status(404).json({ status: 'error', message: 'Inscription not found' });
    }

    await deleteInscription(`competition_${competitionId}`, inscriptionId, inscription._rev);
    res.status(200).json({ status: 'success', message: 'Inscription deleted successfully' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});