const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const { Category , Grouping , Event } = require("./schemas");
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