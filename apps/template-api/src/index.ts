import express from "express";
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 3000;
const name = process.env.NAME || 'CHANGEME';
const prefix = `/api/${name}`;

app.get(`${prefix}`, (req, res) => {
    
});


app.listen(port, () => {
    console.log(`${name}: app is running at port : ${port}`);
});

