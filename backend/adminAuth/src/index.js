const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const { Admin } = require("./schemas");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const session = require('express-session');

const MONGO_URI = process.env.MONGO_URI|| 'mongodb://localhost:27017/adminAuth';


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

app.use(session({
    secret: "propre123",
    email: null,
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.post('/adminAuth/createAccount', async (req, res) => {
    try{
        const user = Admin.findOne({email: req.session.email});
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
        const user = Admin.findOne({email: req.body.email});
        if(user) {
            if(await bcrypt.compare(req.body.pswd, user.password)) {
                req.session.email = user.email;
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
        }
    }catch(err){
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


app.listen(port, () => console.log(`adminAuth microservice listening on port ${port}!`));