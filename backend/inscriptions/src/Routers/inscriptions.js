const express = require('express');
const axios = require('axios');

const app = express.Router();

const { getInscriptions, deleteInscription} = require('../nano');

const { freeInscriptions, stripeInscriptions } = require('../utils');

const { checkParams, checkEvents, checkInscriptions, checkPlaceAvailable, calculateTotalCost, getData } = require('./inscriptionsUtils');


// Add a new inscription for a competition
app.post('/api/inscriptions/:competitionId', async (req, res) => {
    const { competitionId } = req.params;
    let userId = req.body.userId;
    const { athleteId, events, records, email } = req.body;

    const success_url = req.body.success_url || `http://localhost/competitions/${competitionId}?subPage=inscription&athleteId=${athleteId}&step=5`;
    const cancel_url = req.body.cancel_url || `http://localhost/competitions/${competitionId}?subPage=inscription&athleteId=${athleteId}&step=4`;

    const check = await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/${userId}`).catch((err) => { 
        //console.error(err);
        return false; 
    });

    const admin = check ? check.data.data : false;
    if (admin) {
        userId = "admin";
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
    
    // check if place is available (if event.maxParticipants compare with number of inscriptions)
    const checkPlaceAvailableResult = checkPlaceAvailable(eventsInfo, inscriptions);
    if (checkPlaceAvailableResult) {
        return res.status(400).json(checkPlaceAvailableResult);
    }

    // calculate total cost
    const totalCost = calculateTotalCost(eventsInfo, competition, athlete);

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
            cost: (totalCost==0 || admin) ? 0 : event.cost, 
            inscribed: true,
            confirmed: false
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
                inscribed: true,
                confirmed: false
            });
        }
    }

    if (totalCost == 0) {
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
    const { events, records, email } = req.body;
    
    const success_url = req.body.success_url || `http://localhost/competitions/${competitionId}?subPage=inscription&athleteId=${athleteId}&step=5`;
    const cancel_url = req.body.cancel_url || `http://localhost/competitions/${competitionId}?subPage=inscription&athleteId=${athleteId}&step=4`;

    const check = await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/${userId}`).catch((err) => { 
        console.error(err);
        return false; 
    });
    const admin = check ? check.data.data : false;

    
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

    // check if athlete is already inscribed
    if (!checkInscriptions(inscriptions, athleteId)) {
        return res.status(400).json({ status: 'error', message: 'Athlete not inscribed' });
    }

    // check if userId corresponds to the one in the inscription
    const athleteInscriptions = inscriptions.filter((inscription) => inscription.athleteId == athleteId);
    const userIdFromInscription = athleteInscriptions[0].userId;
    if (!admin) {
        if (userId != userIdFromInscription) {
            return res.status(403).json({ status: 'error', message: 'Forbidden (userId does not correspond to the one in the inscription)' });
        }
    }

    // check if place is available for new events (if event.maxParticipants compare with number of inscriptions)
    const checkPlaceAvailableResult = checkPlaceAvailable(eventsInfo, inscriptions, athleteInscriptions);
    if (checkPlaceAvailableResult) {
        return res.status(400).json(checkPlaceAvailableResult);
    }

    // calculate total cost
    const totalCost = calculateTotalCost(eventsInfo, competition, athlete, athleteInscriptions);

    // Delete inscriptions for events that are not in the new list
    for (let i = 0; i < athleteInscriptions.length; i++) {
        if (athleteInscriptions[i].eventType == "event" && !events.includes(athleteInscriptions[i].event)) {
            await deleteInscription(`competition_${competitionId}`, athleteInscriptions[i]._id);
        } else if (athleteInscriptions[i].eventType == "multiEvent" && !events.includes(athleteInscriptions[i].event)) {
            await deleteInscription(`competition_${competitionId}`, athleteInscriptions[i]._id);
        } else if (athleteInscriptions[i].eventType == "subEvent" && !events.includes(athleteInscriptions[i].parentEvent)) {
            await deleteInscription(`competition_${competitionId}`, athleteInscriptions[i]._id);
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
                cost: (totalCost==0 || admin) ? 0 : event.cost,
                inscribed: true,
                confirmed: false
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
                    inscribed: true,
                    confirmed: false
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

    console.log(inscriptionData);

    if (totalCost == 0 || admin) {
        await freeInscriptions(`competition_${competitionId}`, inscriptionData);
        res.status(200).json({ status: 'success', message: 'Inscriptions updated successfully' });
        return;
    } else {
        let eventsForStripe = [];
        for (let i = 0; i < eventsInfo.length; i++) {
            if (!athleteInscriptions.some((inscription) => inscription.event == eventsInfo[i].pseudoName)) {
                eventsForStripe.push(eventsInfo[i]);
            } else {
                let freeEvent = eventsInfo[i];
                freeEvent.cost = 0;
                eventsForStripe.push(freeEvent);
            }
        }
        const response = await stripeInscriptions(`competition_${competitionId}`, inscriptionData, eventsForStripe, success_url, cancel_url);
        res.status(200).json({ status: 'success', message: 'Redirect to payment', data: response });
    }
});

// Delete all inscriptions of an athlete for a competition
app.delete('/api/inscriptions/:competitionId/:athleteId', async (req, res) => {
    const { competitionId, athleteId } = req.params;
    let userId = req.body.userId;

    const check = await axios.get(`${process.env.COMPETITIONS_URL}/api/competitions/${competitionId}/${userId}`).catch((err) => { 
        console.error(err);
        return false; 
    });

    const admin = check ? check.data.data : false;

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
        await deleteInscription(`competition_${competitionId}`, athleteInscriptions[i]._id);
    }

    res.status(200).json({ status: 'success', message: 'Inscriptions deleted successfully' });
});

module.exports = { inscriptionsRouter: app };
