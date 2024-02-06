const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const { Admin } = require("./schemas");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const session = require('express-session');

const MONGO_URI = process.env.MONGO_URI|| 'mongodb://localhost:27017/adminAuth';
const COMPETITION_URL = process.env.COMPETITION_URL || 'http://localhost:3001';


const connectMongo = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }
}
connectMongo();

async function initDb() {
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(process.env.ADMIN_PSW || "admin", salt);
    await Admin.create({
        email: process.env.ADMIN_EMAIL||'riwan.claes@gmail.com',
        password: hash,
        club: 'USTA',
        allAccess: true
    }).catch(err => {
        if (err.code !== 11000) {
            console.log('error', err);
        }
    });
    console.log('DB initialized');
}
initDb();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:4000'||process.env.FRONTEND_URL]; 
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
})


app.get('/adminAuth', async (req, res) => {
    try{
        console.log("Get : "+req.session.email);
        if (req.session.email) {
            const user = await Admin.findOne({email: req.session.email});
            res.status(200).json({
                status: 'success',
                message: 'Logged in',
                email: user.email,
                club: user.club,
            });
        }else{
            res.status(200).json({
                status: 'success',
                message: 'Not logged in',
                email: null,
                club: null,
            });
        }
    }catch(err){
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

app.post('/adminAuth/createAccount', async (req, res) => {
    try{
        const user = await Admin.findOne({email: req.session.email});
        if(user) {
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.pswd, salt);
            await Admin.create({
                email: req.body.email,
                password: hash,
                club: user.club,
                allAccess: user.allAccess
            });
            res.status(201).json({
                status: 'success',
                message: 'Account created successfully',
            });
        }else{
            res.status(401).json({
                status: 'error',
                message: 'Unauthorized',
            });
        }
    }catch(err){
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

app.post('/adminAuth/login', async (req, res) => {
    try{
        console.log(req.body.email);
        const user = await Admin.findOne({email: req.body.email});
        if(user) {
            console.log(user);
            console.log(req.body.password);
            if(await bcrypt.compare(req.body.password, user.password)) {
                console.log("email : "+user.email);
                req.session.email = user.email;
                console.log("session : "+req.session.email);
                res.status(200).json({
                    status: 'success',
                    message: 'Logged in successfully',
                });
            }else{
                res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials',
                });
            }
        }else{
            res.status(401).json({
                status: 'error',
                message: 'Invalid credentials',
            });
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

app.post('/adminAuth/logout', (req, res) => {
    try{
        req.session.email = null;
        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully',
        });
    }catch(err){
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

app.post('/adminAuth/competitions', async (req, res) => {
    try{
        const user = await Admin.findOne({email: req.session.email});
        if(user) {
            if(!user.allAccess) {
                req.body.club = user.club;
            }
            console.log("sending : "+JSON.stringify(req.body));
            fetch(COMPETITION_URL+'/competitions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body),
            })
        }else{
            res.status(401).json({
                status: 'error',
                message: 'Unauthorized',
            });
        }
    }catch(err){
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});


app.listen(port, () => console.log(`adminAuth microservice listening on port ${port}!`));