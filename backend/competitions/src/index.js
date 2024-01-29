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

async function generateId() {
    let id = crypto.randomBytes(20).toString('hex');
    while (await Competition.findOne({ id })) {
        id = crypto.randomBytes(20).toString('hex');
    }
    return id;
}

//Get competition's data by id 
app.get('/competitions', async (req, res) => {
    try{
        const competition = await Competition.findOne({ id: req.query.id });
        res.status(200).json({
            status: 'success',
            message: 'Competitions retrieved successfully',
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
app.post('/competitions', async (req, res) => {
    try{
        const competition = new Competition({
            id: await generateId(),
            name: req.body.name,
            location: req.body.location,
            club: req.body.club,
            date: req.body.date,
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

app.put('/competitions', async (req, res) => {
    try{
        const competition = await Competition.findOne({ id: req.query.id });
        await competition.updateOne({
            name: req.body.name,
            location: req.body.location,
            club: req.body.club,
            date: req.body.date,
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