const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const { Category , Event } = require("./schemas");
const MONGO_URI = process.env.MONGO_URI|| 'mongodb://localhost:27017/eventcat';

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

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.get('/event/getInfoEvent', async (req, res) => {
    try{
        const event = await Event.findOne({ name: req.query.name });
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

app.get('/event/getInfoCategory', async (req, res) => {
    try{
        const category = await Category.findOne({ id: req.query.id });
        res.status(200).json({
            status: 'success',
            message: 'Category retrieved successfully',
            data: category,
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

app.post('/event/createEvents', async (req, res) => {
    try{
        const data = req.body.events;
        const bulkOps = data.map(event => ({
            updateOne: {
                filter: { name: event.name },
                update: { $set: event },
                upsert: true,
            }
        }));
        console.log("Creating events ...");
        const events = await Event.bulkWrite(bulkOps);
        console.log("   Events created : ", events.upsertedCount);
        console.log("   Events updated : ", events.modifiedCount);
        console.log("   Events matched : ", events.matchedCount);
        res.status(200).json({
            status: 'success',
            message: 'Event created successfully',
            data: 'ok',
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

app.get('/event/getAllEvents', async (req, res) => {
    try{
        const events = await Event.find();
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

app.listen(port, () => console.log(`Event app listening on port ${port}!`));