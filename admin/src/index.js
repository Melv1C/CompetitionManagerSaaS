const express = require('express');
const axios = require('axios');
const env = require('dotenv').config();


const port = 3001;
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const API_URL = process.env.API_URL || 'http://localhost:3000';




app.get('/admin', (req, res) => {
    res.render('index');
});

app.get('/admin/competition', async (req, res) => {
    try {
        const competition = (await axios.get(`${API_URL}/competitions?id=${req.query.id}`)).data.data;
        competition.strDate = new Date(competition.date).toLocaleDateString('fr-BE');
        competition.date = new Date(competition.date).toISOString().split('T')[0];
        res.render('competition', { competition: competition });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

app.put('/admin/competition', async (req, res) => {
    try {
        const competitionData = {
            name: req.body.name,
            date: req.body.date,
            location: req.body.location
        };
        await axios.put(`${API_URL}/competitions?id=${req.query.id}`, competitionData);
        res.status(200).json({
            status: 'success',
            message: 'Competition updated successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});



app.listen(port, () => {
    console.log(`Admin app listening on port : ${port}`);
});