const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const { Competition } = require("./schemas");
const crypto = require('crypto');
const axios = require('axios');

const { checkInputCompetitions, checkInputEvents } = require('./outils');

const MONGO_URI = process.env.MONGO_URI|| 'mongodb://localhost:27017/competitions';


const connectMongo = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }
}
connectMongo();

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

async function generateIdCompet() {
    let id = crypto.randomBytes(5).toString('hex');
    while (await Competition.findOne({ id })) {
        id = crypto.randomBytes(5).toString('hex');
    }
    return id;
}

async function generateIdEvent(events) {
    let id = crypto.randomBytes(5).toString('hex');
    while (events.find(event => event.id === id)) {
        id = crypto.randomBytes(5).toString('hex');
    }
    return id;
}


app.get("/api/competitions", async (req, res) => {
    try{
        const competitions = await Competition.find({});
        //take adminId off the response
        const publicCompetitions = competitions.map(competition => {
            const { adminId, ...publicCompetition } = competition.toObject();
            return publicCompetition;
        });
        res.status(200).json({
            status: 'success',
            message: 'Competitions retrieved successfully',
            data: publicCompetitions,
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

app.get('/api/competitions/admin/:adminId', async (req, res) => {
    try{
        const competitions = await Competition.find({ adminId: req.params.adminId });
        res.status(200).json({
            status: 'success',
            message: 'Competitions retrieved successfully',
            data: competitions,
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});


//Get competition's data by id 
app.get('/api/competitions/:id', async (req, res) => {
    try{
        const id = req.params.id;
        if (!id && typeof id !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid id',
            });
        }
        const competition = await Competition.findOne({ id: id});
        if (!competition){
            return res.status(404).json({
                status: 'error',
                message: 'Competition not found',
            });
        }
        //take adminId off the response
        const { adminId, ...publicCompetition } = competition.toObject();
        res.status(200).json({
            status: 'success',
            message: 'Competition retrieved successfully',
            data: publicCompetition,
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

//Get events of a competition filtered by a category
app.get('/api/competitions/:id/events', async (req, res) => {
    try{
        const id = req.params.id;
        const category = req.query.category;
        if (!id && typeof id !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid id',
            });
        }
        const competition = await Competition.findOne({ id: id});
        if (!competition){
            return res.status(404).json({
                status: 'error',
                message: 'Competition not found',
            });
        }
        let events = competition.events;
        if (category){
            events = events.filter(event => event.categories.includes(category));
        }
        res.status(200).json({
            status: 'success',
            message: 'Events retrieved successfully',
            data: events,
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

//Get event's data by id
app.get('/api/competitions/:id/events/:eventId', async (req, res) => {
    try{
        const id = req.params.id;
        const eventId = req.params.eventId;
        const competition = await Competition.findOne({ id: id});
        if (!competition){
            return res.status(404).json({
                status: 'error',
                message: 'Competition not found',
            });
        }
        console.log(eventId);
        console.log(competition.events);
        const event = competition.events.find(event => event.id === eventId || event.pseudoName === eventId);
        if (!event){
            return res.status(404).json({
                status: 'error',
                message: 'Event not found',
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Event retrieved successfully',
            data: event,
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});


//create a new competition
app.post('/api/competitions', async (req, res) => {
    try{
        const competInfo = {
            name : req.body.name,
            location : req.body.location,
            club : req.body.club,
            date : req.body.date,
            closeDate : req.body.closeDate,
            paid : req.body.paid ? req.body.paid : false,
            freeClub : req.body.freeClub,
            schedule : req.body.schedule ? req.body.schedule : "",
            description : req.body.description ? req.body.description : "",
            adminId : req.body.adminId,
            email : req.body.email,
            confirmationTime : req.body.confirmationTime,
            oneDay : req.body.oneDay || false,
            oneDayBIB : req.body.oneDayBIB || 9000,
        }
        const check = checkInputCompetitions(competInfo);
        if (check[0] === false){
            return res.status(400).json({
                status: 'error',
                message: check[1],
            });
        }
        
        const competition = new Competition({
            ...competInfo,
            id: await generateIdCompet(),
            open: false,
            epreuves: [],
        });
        await competition.save();

        // post to inscriptions microservice
        if (process.env.INSCRIPTIONS_URL) {
            try {
                await axios.post(`${process.env.INSCRIPTIONS_URL}/api/inscriptions`, {
                    competitionId: competition.id,
                });
            } catch (err) {
                console.error(err);
                return res.status(500).json({
                    status: 'error',
                    message: 'Error posting to inscriptions microservice',
                });
            }
        }
        
        res.status(201).json({
            status: 'success',
            message: 'Competition created successfully',
            data: { id: competition.id }
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

//create a new event for a competition
app.post('/api/competitions/:id/events', async (req, res) => {
    try{
        const id = req.params.id;
        let eventInfo = {
            name : req.body.name,
            pseudoName : req.body.pseudoName ? req.body.pseudoName : name,
            time : req.body.time,
            categories : req.body.categories,
            maxParticipants : req.body.maxParticipants ? req.body.maxParticipants : null,
            cost : req.body.cost ? req.body.cost : 0,
            subEvents : req.body.subEvents ? req.body.subEvents : [],
            type : null,
        }

        if (!id && typeof id !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid id',
            });
        }
        const check = checkInputEvents(req.body);
        if (check[0] === false){
            return res.status(400).json({
                status: 'error',
                message: check[1],
            });
        }
        const url = process.env.EVENTS_URL || 'http://localhost:3000';
        const staticInfo = (await axios.get(`${url}/api/events/${eventInfo.name}`)).data.data;
        eventInfo.type = staticInfo.type;
        eventInfo.abbr = staticInfo.abbr;
        
        for (let subevent of eventInfo.subEvents){
            if (!subevent.name || typeof subevent.name !== 'string'){
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid subEvents name',
                }); 
            }
            if (!subevent.time || typeof subevent.time !== 'string'){
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid subEvents time',
                });
            }
            let subType;
            const url = process.env.EVENTS_URL || 'http://localhost:3000';
            subType = (await axios.get(`${url}/api/events/${subevent.name}`)).data.data.type;
            subevent.type = subType;
        }
        const competition = await Competition.findOne({id: id});
        if (competition.adminId !== req.body.adminId){
            return res.status(403).json({
                status: 'error',
                message: 'Unauthorized',
            });
        }
        const  events = competition.events;
        events.push({
            ...eventInfo,
            id: await generateIdEvent(events),
        });
        await competition.updateOne({events: events});

        const updatedCompetition = await Competition.findOne({ id: id });

        res.status(201).json({
            status: 'success',
            message: 'Event created successfully',
            data: updatedCompetition,
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

//update a event for a competition
app.put('/api/competitions/:id/events/:eventId', async (req, res) => {
    try{
        const id = req.params.id;
        const eventId = req.params.eventId;
        let eventInfo = {
            name : req.body.name,
            pseudoName : req.body.pseudoName ? req.body.pseudoName : name,
            time : req.body.time,
            categories : req.body.categories,
            maxParticipants : req.body.maxParticipants ? req.body.maxParticipants : null,
            cost : req.body.cost ? req.body.cost : 0,
            subEvents : req.body.subEvents ? req.body.subEvents : [],
            type : null,
        }

        if (!id && typeof id !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid id',
            });
        }
        const check = checkInputEvents(req.body);
        if (check[0] === false){
            return res.status(400).json({
                status: 'error',
                message: check[1],
            });
        }
        const url = process.env.EVENTS_URL || 'http://localhost:3000';
        const staticInfo = (await axios.get(`${url}/api/events/${eventInfo.name}`)).data.data;
        eventInfo.type = staticInfo.type;
        eventInfo.abbr = staticInfo.abbr;

        for (let subevent of eventInfo.subEvents){
            if (!subevent.name || typeof subevent.name !== 'string'){
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid subEvents name',
                }); 
            }
            if (!subevent.time || typeof subevent.time !== 'string'){
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid subEvents time',
                });
            }
            let subType;
            const url = process.env.EVENTS_URL || 'http://localhost:3000';
            subType = (await axios.get(`${url}/api/events/${subevent.name}`)).data.data.type;
            subevent.type = subType;
        }
        const competition = await Competition.findOne({id: id});
        if (competition.adminId !== req.body.adminId){
            return res.status(403).json({
                status: 'error',
                message: 'Unauthorized',
            });
        }
        const events = competition.events;
        const index = events.findIndex(event => event.id === eventId);
        if (index === -1){
            return res.status(404).json({
                status: 'error',
                message: 'Event not found',
            });
        }
        //change the name in the existing inscriptions
        if (events[index].pseudoName !== eventInfo.pseudoName){
            const isMulti = events[index].subEvents.length > 0;
            const body = {
                adminId: competition.adminId,
                isMulti: isMulti
            }
            axios.put(`${process.env.INSCRIPTIONS_URL}/api/inscriptions/${competition.id}/event/${events[index].pseudoName}/${eventInfo.pseudoName}`, body).catch(err => console.log("error : "+err.response.data.message));
        }
        
        events[index] = {
            ...eventInfo,
            id: eventId,
        };
        await competition.updateOne({events: events});
        const updatedCompetition = await Competition.findOne({ id: id });
        res.status(200).json({
            status: 'success',
            message: 'Event updated successfully',
            data: updatedCompetition,
            
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});


//delete a event from a competition
app.delete('/api/competitions/:id/events/:eventId', async (req, res) => {
    try{
        const id = req.params.id;
        const eventId = req.params.eventId;
        if (!id && typeof id !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid id',
            });
        }
        if (!eventId && typeof eventId !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid eventId',
            });
        }
        const competition = await Competition.findOne({id: id});
        const events = competition.events;
        const index = events.findIndex(event => event.id === eventId);
        if (index === -1){
            return res.status(404).json({
                status: 'error',
                message: 'Event not found',
            });
        }
        events.splice(index, 1);
        await competition.updateOne({events: events});
        res.status(200).json({
            status: 'success',
            message: 'Event deleted successfully',
            data: { 
                id: competition.id,
                events: events,
            }
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

//change the open status of a competition
app.put('/api/competitions/:id/open', async (req, res) => {
    try{
        const id = req.params.id;
        const adminId = req.body.adminId;
        if (!id && typeof id !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid id',
            });
        }
        const competition = await Competition.findOne({id: id});
        if (competition.adminId !== adminId){
            return res.status(403).json({
                status: 'error',
                message: 'Unauthorized',
            });
        }
        const open = !competition.open;
        await competition.updateOne({open: open});
        res.status(200).json({
            status: 'success',
            message: 'Open status updated successfully',
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

//update a competition
app.put('/api/competitions/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const competInfo = {
            name : req.body.name,
            location : req.body.location,
            club : req.body.club,
            date : req.body.date,
            closeDate : req.body.closeDate,
            paid : req.body.paid ? req.body.paid : false,
            freeClub : req.body.freeClub,
            schedule : req.body.schedule ? req.body.schedule : "",
            description : req.body.description ? req.body.description : "",
            adminId : req.body.adminId,
            email : req.body.email,
            confirmationTime : req.body.confirmationTime,
            oneDay : req.body.oneDay || false,
            oneDayBIB : req.body.oneDayBIB || 9000,
        }
        const check = checkInputCompetitions(competInfo);
        if (check[0] === false){
            return res.status(400).json({
                status: 'error',
                message: check[1],
            });
        }
        if (!id && typeof id !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid id',
            });
        }
        const competition = await Competition.findOne({ id: id });
        if (!competition){
            return res.status(404).json({
                status: 'error',
                message: 'Competition not found',
            });
        }
        if (competition.adminId !== req.body.adminId){
            return res.status(403).json({
                status: 'error',
                message: 'Unauthorized',
            });
        }
        await competition.updateOne(competInfo);

        const updatedCompetition = await Competition.findOne({ id: id });

        res.status(200).json({
            status: 'success',
            message: 'Competition updated successfully',
            data: updatedCompetition,
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

//set closedList to true/false
app.post('/api/competitions/:id/list/:eventId', async (req, res) => {
    try{
        const id = req.params.id;
        const eventId = req.params.eventId;
        const value = req.body.closedList ? req.body.closedList : false;
        if (!id && typeof id !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid id',
            });
        }
        const competition = await Competition.findOne({ id: id });
        if (!competition){
            return res.status(404).json({
                status: 'error',
                message: 'Competition not found',
            });
        }
        if (competition.adminId !== req.body.adminId){
            return res.status(403).json({
                status: 'error',
                message: 'Unauthorized',
            });
        }

        const index = competition.events.findIndex(event => event.id === eventId);
        if (index === -1){
            return res.status(404).json({
                status: 'error',
                message: 'Event not found',
            });
        }
        competition.events[index].closedList = value;
        await competition.updateOne({events: competition.events});

        res.status(200).json({
            status: 'success',
            message: 'Participant list ' + (value ? 'closed' : 'opened') + ' successfully',
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

//Check the adminId of a competition
app.get('/api/competitions/:id/:adminId', async (req, res) => {
    try{
        const id = req.params.id;
        const adminId = req.params.adminId;
        if (!id && typeof id !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid id',
                data: false
            });
        }
        const competition = await Competition.findOne({ id: id });
        if (!competition){
            return res.status(404).json({
                status: 'error',
                message: 'Competition not found',
                data: false
            });
        }
        if (competition.adminId !== adminId){
            console.log("Try to access with adminId: ", adminId, " but the adminId of the competition is: ", competition.adminId, "for competition: ", competition.id);
            return res.status(403).json({
                status: 'error',
                message: 'Unauthorized',
                data: false
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'AdminId verified',
            data: true
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            data: false
        });
    }
});

//delete a competition
app.delete('/api/competitions/:id/:adminId', async (req, res) => {
    try{
        const id = req.params.id;
        const adminId = req.params.adminId;
        if (!id && typeof id !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid id',
            });
        }
        const competition = await Competition.findOne({ id: id });
        if (!competition){
            return res.status(404).json({
                status: 'error',
                message: 'Competition not found',
            });
        }
        if (competition.adminId !== adminId){
            console.log("Try to access with adminId: ", adminId, " but the adminId of the competition is: ", competition.adminId, "for competition: ", competition.id);
            return res.status(403).json({
                status: 'error',
                message: 'Unauthorized',
            });
        }
        const delIsncr = await axios.delete(`${process.env.INSCRIPTIONS_ADMIN_URL}/api/admin/inscriptions/${competition.id}?adminId=${adminId}`).catch((err) => {
                console.error(err);
                return false;
            }
        );
        if (!delIsncr){
            return res.status(500).json({
                status: 'error',
                message: 'Error deleting inscriptions',
            });
        }
        await competition.deleteOne();
        res.status(200).json({
            status: 'success',
            message: 'Competition deleted successfully',
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});


app.listen(port, () => console.log(`Competitions microservice listening on port ${port}!`));