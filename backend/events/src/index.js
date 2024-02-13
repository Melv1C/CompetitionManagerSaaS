const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const { Category , Event } = require("./schemas");
const MONGO_URI = process.env.MONGO_URI|| 'mongodb://localhost:27017/eventcat';
const fs = require("fs");

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


function readJsonFileSync(filepath, encoding){

    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    const file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

async function initDB(){
    const categories = readJsonFileSync('src/categories.json');
    const bulkOps = categories.categories.map(cat => ({
        updateOne: {
            filter: { id: cat.id },
            update: { $set: cat },
            upsert: true,
        }
    }));
    console.log("Creating events ...");
    await Category.bulkWrite(bulkOps);
    const events = readJsonFileSync('src/epreuves.json');
    const bulkOps2 = events.events.map(event => ({
        updateOne: {
            filter: { name: event.name },
            update: { $set: event },
            upsert: true,
        }
    }));
    console.log("Creating events ...");
    await Event.bulkWrite(bulkOps2);
    console.log("Database initialized");
}
initDB();


app.get('/api/events', async (req, res) => {
    try{
        const events = await Event.find();
        // remove validCat field in all event
        events.forEach(event => {
            event.validCat = undefined;
        });
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

app.get('/api/events/:name', async (req, res) => {
    try{
        const event = await Event.findOne({ name: req.params.name });
        if (!event) {
            return res.status(404).json({
                status: 'error',
                message: 'Invalid event name',
            });
        }
        let validCat = []
        for (let i = 0; i < event.validCat.length; i++) {
            const abbr = await Category.findOne({ id: event.validCat[i] })
            if (abbr) {
                validCat.push(abbr.abbr);
            }else{
                console.log("Invalid category id: " + event.validCat[i]);
            }
        }
        event.validCat = validCat;
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

app.get('/api/categories/:id', async (req, res) => {
    try{
        const category = await Category.findOne({ id: req.params.id });
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



app.listen(port, () => console.log(`Event app listening on port ${port}!`));