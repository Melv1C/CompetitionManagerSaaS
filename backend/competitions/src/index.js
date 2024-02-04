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
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

async function generateId() {
    let id = crypto.randomBytes(20).toString('hex');
    while (await Competition.findOne({ id })) {
        id = crypto.randomBytes(20).toString('hex');
    }
    return id;
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

//create a new competition
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
            id: await generateId(),
            name: name,
            location: location,
            club: club,
            date: date,
            paid: paid,
            freeClub: freeClub,
            schedule: schedule,
            description: description,
            open: false,
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