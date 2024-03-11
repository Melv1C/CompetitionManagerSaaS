const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const { Competition } = require("./schemas");
const crypto = require('crypto');
const axios = require('axios');

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
        const event = competition.events.find(event => event.id === eventId);
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
        const name = req.body.name;
        const location = req.body.location;
        const club = req.body.club;
        const date = req.body.date;
        const closeDate = req.body.closeDate;
        const paid = req.body.paid ? req.body.paid : false;
        const freeClub = req.body.freeClub;
        const schedule = req.body.schedule ? req.body.schedule : "";
        const description = req.body.description ? req.body.description : "";
        const adminId = req.body.adminId;
        const email = req.body.email;
        if (!name && typeof name !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid name',
            });
        }
        if (!location && typeof location !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid location',
            });
        }
        if (!club && typeof club !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid club',
            });
        }
        if (!date && typeof date !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid date',
            });
        }
        if (!closeDate && typeof closeDate !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid closeDate',
            });
        }
        if (!paid && typeof paid !== 'boolean'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid paid',
            });
        }
        if (!freeClub && typeof freeClub != 'boolean'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid paid',
            })
        }
        if (!schedule && typeof schedule !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid schedule',
            });
        }
        if (!description && typeof description !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid description',
            });
        }
        if (!adminId && typeof adminId !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid adminId',
            });
        }
        if (!email && typeof email !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email',
            });
        }
        const competition = new Competition({
            id: await generateIdCompet(),
            name: name,
            location: location,
            club: club,
            date: date,
            closeDate: closeDate,
            paid: paid,
            freeClub: freeClub,
            schedule: schedule,
            description: description,
            open: false,
            adminId: adminId,
            email: email,
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
        const name = req.body.name;
        const pseudoName = req.body.pseudoName ? req.body.pseudoName : name;
        const time = req.body.time;
        const categories = req.body.categories;
        const maxParticipants = req.body.maxParticipants ? req.body.maxParticipants : null;
        const cost = req.body.cost ? req.body.cost : 0;
        const subEvents = req.body.subEvents ? req.body.subEvents : [];
        let type;
        if (!id && typeof id !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid id',
            });
        }
        if (!name && typeof name !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid name',
            });
        } else {
            const url = process.env.EVENTS_URL || 'http://localhost:3000';
            type = (await axios.get(`${url}/api/events/${name}`)).data.data.type;
        }
        if (!pseudoName && typeof pseudoName !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid pseudoName',
            });
        }
        if (!time && typeof time !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid time',
            });
        }
        if (!categories && !Array.isArray(categories)){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid categories',
            });
        }
        if (maxParticipants && typeof maxParticipants !== 'number'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid maxParticipants',
            });
        }
        if (cost && typeof cost !== 'number'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid cost',
            });
        }
        if (!type && typeof type !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid name',
            });
        }
        if (subEvents && !Array.isArray(subEvents)){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid subEvents',
            });
        }
        for (let subevent of subEvents){
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
            id: await generateIdEvent(events),
            name: name,
            pseudoName: pseudoName,
            time: time,
            categories: categories,
            maxParticipants: maxParticipants,
            cost: cost,
            type: type,
            subEvents: subEvents,
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

app.put('/api/competitions/:id/events/:eventId', async (req, res) => {
    try{
        const id = req.params.id;
        const eventId = req.params.eventId;
        const name = req.body.name;
        const pseudoName = req.body.pseudoName ? req.body.pseudoName : name;
        const time = req.body.time;
        const categories = req.body.categories;
        const maxParticipants = req.body.maxParticipants ? req.body.maxParticipants : null;
        const cost = req.body.cost ? req.body.cost : 0;
        const subEvents = req.body.subEvents ? req.body.subEvents : [];
        let type;
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
        if (!name && typeof name !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid name',
            });
        } else {
            const url = process.env.EVENTS_URL || 'http://localhost:3000';
            type = (await axios.get(`${url}/api/events/${name}`)).data.data.type;
        }
        if (!pseudoName && typeof pseudoName !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid pseudoName',
            });
        }
        if (!time && typeof time !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid time',
            });
        }
        if (!categories && !Array.isArray(categories)){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid categories',
            });
        }
        if (maxParticipants && typeof maxParticipants !== 'number'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid maxParticipants',
            });
        }
        if (cost && typeof cost !== 'number'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid cost',
            });
        }
        if (!type && typeof type !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid name',
            });
        }
        for (let subevent of subEvents){
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
        if (events[index].pseudoName !== pseudoName){
            const isMulti = events[index].subEvents.length > 0;
            const body = {
                adminId: competition.adminId,
                isMulti: isMulti
            }
            axios.put(`${process.env.INSCRIPTIONS_URL}/api/inscriptions/${competition.id}/event/${events[index].pseudoName}/${pseudoName}`, body).catch(err => console.log("error : "+err.response.data.message));
        }
        
        events[index] = {
            id: eventId,
            name: name,
            pseudoName: pseudoName,
            time: time,
            categories: categories,
            maxParticipants: maxParticipants,
            cost: cost,
            type: type,
            subEvents: subEvents,
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
        const name = req.body.name;
        const location = req.body.location;
        const club = req.body.club;
        const date = req.body.date;
        const closeDate = req.body.closeDate;
        const paid = req.body.paid ? req.body.paid : false;
        const freeClub = req.body.freeClub;
        const email = req.body.email;
        const schedule = req.body.schedule ? req.body.schedule : "";
        const description = req.body.description ? req.body.description : "";
        if (!id && typeof id !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid id',
            });
        }
        if (!name && typeof name !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid name',
            });
        }
        if (!location && typeof location !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid location',
            });
        }
        if (!club && typeof club !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid club',
            });
        }
        if (!date && typeof date !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid date',
            });
        }
        if (!closeDate && typeof closeDate !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid closeDate',
            });
        }
        if (!paid && typeof paid !== 'boolean'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid paid',
            });
        }
        if (!freeClub && !Array.isArray(freeClub)){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid freeClub',
            });
        }
        if (!schedule && typeof schedule !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid schedule',
            });
        }
        if (!description && typeof description !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid description',
            });
        }
        if (!email && typeof email !== 'string'){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email',
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
        await competition.updateOne({
            name: name,
            location: location,
            club: club,
            date: date,
            closeDate: closeDate,
            paid: paid,
            freeClub: freeClub,
            schedule: schedule,
            description: description,
            email: email,
        });

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
        const delIsncr = await axios.delete(`${process.env.INSCRIPTIONS_URL}/api/inscriptions/${competition.id}?adminId=${adminId}`).catch((err) => {
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