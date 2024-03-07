const express = require('express');
const axios = require('axios');

const { createDatabase,
        deleteDatabase,
        getInscriptions,
        getInscription,
        deleteInscription,
        updateInscription,
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

    const check = await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/${userId}`).catch((err) => { 
        console.error(err);
        return false; 
    });
    const admin = check ? check.data.data : false;
    if (!admin) {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
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

    // get competition info
    const competition = (await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}`)).data.data;

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
    if (!(competition.freeClub && athleteInfo.club == competition.club)) {
        for (let i = 0; i < events.length; i++) {
            const eventInfo = eventsInfo.find((event) => event.pseudoName == events[i]);
            totalCost += eventInfo.cost;
        }
    }

    // Insert inscriptions

    const fullEvents = eventsInfo.filter((event) => events.includes(event.pseudoName));

    let inscriptionData = [];
    for (let fullEvent of fullEvents) {

        inscriptionData.push({ 
            userId, 
            athleteId, 
            athleteName: athleteInfo.firstName + ' ' + athleteInfo.lastName, 
            club: athleteInfo.club,
            bib: athleteInfo.bib, 
            event: fullEvent.pseudoName, 
            record: (fullEvent.subEvents.length == 0) ? records[fullEvent.pseudoName] : records[fullEvent.pseudoName]["total"],
            eventType: (fullEvent.subEvents.length == 0) ? "event" : "multiEvent",
            parentEvent: null
        });   
        
        for (let subEvent of fullEvent.subEvents) {
            inscriptionData.push({
                userId,
                athleteId,
                athleteName: athleteInfo.firstName + ' ' + athleteInfo.lastName,
                club: athleteInfo.club,
                bib: athleteInfo.bib,
                event: `${fullEvent.pseudoName} - ${subEvent.name}`,
                record: records[fullEvent.pseudoName][subEvent.name],
                eventType: "subEvent",
                parentEvent: fullEvent.pseudoName
            });
        }
    }

    console.log(inscriptionData);

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
    
    const success_url = req.body.success_url || `http://localhost/competitions/${competitionId}?subPage=inscription&athleteId=${athleteId}&step=5`;
    const cancel_url = req.body.cancel_url || `http://localhost/competitions/${competitionId}?subPage=inscription&athleteId=${athleteId}&step=4`;

    const check = await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/${userId}`).catch((err) => { 
        console.error(err);
        return false; 
    });
    const admin = check ? check.data.data : false;
    if (!admin) {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
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

    // get competition info
    const competition = (await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}`)).data.data;

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
        return res.status(400).json({ status: 'error', message: 'Athlete not inscribed' });
    }

    // check if userId corresponds to the one in the inscription
    const userIdFromInscription = athleteInscriptions[0].userId;
    if (!admin) {
        if (userId != userIdFromInscription) {
            return res.status(403).json({ status: 'error', message: 'Forbidden (userId does not correspond to the one in the inscription)' });
        }
    }

    // check if place is available for new events (if event.maxParticipants compare with number of inscriptions)
    for (let i = 0; i < events.length; i++) {
        if (!athleteInscriptions.some((inscription) => inscription.event == events[i])) {
            const eventInfo = eventsInfo.find((event) => event.pseudoName == events[i]);
            if (eventInfo.maxParticipants <= allInscriptions.filter((inscription) => inscription.event == events[i]).length) {
                return res.status(400).json({ status: 'error', message: 'No place available for ' + events[i] });
            }
        }
    }

    // calculate total cost
    let totalCost = 0;
    if (!(competition.freeClub && athleteInfo.club == competition.club)) {
        for (let i = 0; i < events.length; i++) {
            if (!athleteInscriptions.some((inscription) => inscription.event == events[i])) {
                const eventInfo = eventsInfo.find((event) => event.pseudoName == events[i]);
                totalCost += eventInfo.cost;
            }
        }
    }
    console.log("Total cost: " + totalCost);

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

    // Insert inscriptions
    const fullEvents = eventsInfo.filter((event) => events.includes(event.pseudoName));

    let inscriptionData = [];
    for (let fullEvent of fullEvents) {
        if (!athleteInscriptions.some((inscription) => inscription.event == fullEvent.pseudoName)) {

            inscriptionData.push({ 
                userId, 
                athleteId, 
                athleteName: athleteInfo.firstName + ' ' + athleteInfo.lastName, 
                club: athleteInfo.club,
                bib: athleteInfo.bib, 
                event: fullEvent.pseudoName, 
                record: (fullEvent.subEvents.length == 0) ? records[fullEvent.pseudoName] : records[fullEvent.pseudoName]["total"],
                eventType: (fullEvent.subEvents.length == 0) ? "event" : "multiEvent",
                parentEvent: null
            });   
            
            for (let subEvent of fullEvent.subEvents) {
                inscriptionData.push({
                    userId,
                    athleteId,
                    athleteName: athleteInfo.firstName + ' ' + athleteInfo.lastName,
                    club: athleteInfo.club,
                    bib: athleteInfo.bib,
                    event: `${fullEvent.pseudoName} - ${subEvent.name}`,
                    record: records[fullEvent.pseudoName][subEvent.name],
                    eventType: "subEvent",
                    parentEvent: fullEvent.pseudoName
                });
            }
        } else {
            let inscription = athleteInscriptions.find((inscription) => inscription.event == fullEvent.pseudoName);
            inscription.record = (fullEvent.subEvents.length == 0) ? records[fullEvent.pseudoName] : records[fullEvent.pseudoName]["total"];
            inscriptionData.push(inscription);

            for (let subEvent of fullEvent.subEvents) {
                let subInscription = athleteInscriptions.find((inscription) => inscription.event == `${fullEvent.pseudoName} - ${subEvent.name}`);
                subInscription.record = records[fullEvent.pseudoName][subEvent.name];
                inscriptionData.push(subInscription);
            }
        }
    }

    console.log(inscriptionData);

    if (totalCost == 0 || admin) {
        await freeInscriptions(`competition_${competitionId}`, inscriptionData);
        res.status(200).json({ status: 'success', message: 'Inscriptions updated successfully' });
        return;
    } else {
        let eventsForStripe = [];
        for (let i = 0; i < fullEvents.length; i++) {
            if (!athleteInscriptions.some((inscription) => inscription.event == fullEvents[i].pseudoName)) {
                eventsForStripe.push(fullEvents[i]);
            } else {
                let freeEvent = fullEvents[i];
                freeEvent.cost = 0;
                eventsForStripe.push(freeEvent);
            }
        }
        const response = await stripeInscriptions(`competition_${competitionId}`, inscriptionData, eventsForStripe, success_url, cancel_url);
        res.status(200).json({ status: 'success', message: 'Redirect to payment', data: response });
    }
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





// Delete all inscriptions of an athlete for a competition
app.delete('/api/inscriptions/:competitionId/:athleteId', async (req, res) => {
    const { competitionId, athleteId } = req.params;
    let userId = req.body.userId;
    console.log(athleteId);
    const check = await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/${userId}`).catch((err) => { 
        console.error(err);
        return false; 
    });
    const admin = check ? check.data.data : false;
    if (!admin) {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
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
