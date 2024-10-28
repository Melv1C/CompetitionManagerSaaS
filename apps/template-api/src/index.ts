import express from "express";
import dotenv from "dotenv"; 

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const prefix = process.env.PREFIX || '/api/CHANGEME';
const name = process.env.NAME || 'CHANGEME';

app.get(`${prefix}`, (req, res) => {

});


app.listen(port, () => {
    console.log(`${name}: app is running at port : ${port}`);
});

