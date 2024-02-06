const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const { Competition } = require("./schemas");
const crypto = require('crypto');

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
const port = 3001;

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

function onlySameIp(req, res, next) {
    if (req.ip === '::1') {
        console.log('Authorized')
        next();
    } else {
        res.status(401).json({
            status: 'error',
            message: 'Unauthorized'
        });
    }
}


app.get("/api/competitions", async (req, res) => {
    try{
        const competitions = await Competition.find({});
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
        res.status(200).json({
            status: 'success',
            message: 'Competition retrieved successfully',
            data: competition,
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

//create a new competition
//add this middleware to the route to allow only the same ip to create a competition
// app.use('/api/competitions', onlySameIp);
app.post('/api/competitions', async (req, res) => {
    try{
        const name = req.body.name;
        const location = req.body.location;
        const club = req.body.club;
        const date = req.body.date;
        const paid = req.body.paid ? req.body.paid : false;
        const freeClub = req.body.freeClub ? req.body.freeClub : [];
        const schedule = req.body.schedule ? req.body.schedule : "";
        const description = req.body.description ? req.body.description : "";
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
        const competition = new Competition({
            id: await generateIdCompet(),
            name: name,
            location: location,
            club: club,
            date: date,
            paid: paid,
            freeClub: freeClub,
            schedule: schedule,
            description: description,
            open: false,
            epreuves: [],
        });
        await competition.save();
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

app.post('/api/competitions/:id/events', async (req, res) => {
    try{
        const id = req.params.id;
        const name = req.body.name;
        const pseudoName = req.body.pseudoName ? req.body.pseudoName : name;
        const time = req.body.time;
        const categories = req.body.categories;
        const maxParticipants = req.body.maxParticipants ? req.body.maxParticipants : null;
        const cost = req.body.cost ? req.body.cost : 0;
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
        const competition = await Competition.findOne({id: id});
        const  events = competition.events;
        events.push({
            id: await generateIdEvent(events),
            name: name,
            pseudoName: pseudoName,
            time: time,
            categories: categories,
            maxParticipants: maxParticipants,
            cost: cost,
        });
        await competition.updateOne({events: events});
        res.status(201).json({
            status: 'success',
            message: 'Event created successfully',
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

app.put('/api/competitions/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const name = req.body.name;
        const location = req.body.location;
        const club = req.body.club;
        const date = req.body.date;
        const paid = req.body.paid ? req.body.paid : false;
        const freeClub = req.body.freeClub ? req.body.freeClub : [];
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
        const competition = await Competition.findOne({ id: id });
        await competition.updateOne({
            name: name,
            location: location,
            club: club,
            date: date,
            paid: paid,
            freeClub: freeClub,
            schedule: schedule,
            description: description,
        });
        res.status(200).json({
            status: 'success',
            message: 'Competition updated successfully',
            data: { id: competition.id }
        });
    }catch{
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});




app.listen(port, () => console.log(`Competitions microservice listening on port ${port}!`));