const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const { Admin } = require("./schemas");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const session = require('express-session');
const axios = require('axios');

const MONGO_URI = process.env.MONGO_URI|| 'mongodb://localhost:27017/admins';

async function generateId() {
    let id = crypto.randomBytes(10).toString('hex');
    while (await Admin.findById(id)) {
        id = crypto.randomBytes(10).toString('hex');
    }
    return id;
}


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
        id: "10",
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

// Create admin
app.post('/api/admins', async (req, res) => {
    try {
        const adminId = req.body.adminId;

        const email = req.body.email;
        const password = req.body.password;
        const club = req.body.club;
        const allAccess = req.body.allAccess;

        // Check if the adminId is valid and has allAccess
        const admin = await Admin.findById(adminId);
        if (!admin || !admin.allAccess) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized',
            });
        }

        // Create a new admin
        const id = await generateId();
        const newAdmin = new Admin({
            id,
            email,
            password,
            club,
            allAccess,
        });

        await newAdmin.save();
        res.status(201).json({
            status: 'success',
            message: 'Admin created successfully',
            data: newAdmin,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }    
});

// Login
app.get('/api/admins', async (req, res) => {
    try {
        const email = req.query.email;
        const password = req.query.password;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                status: 'error',
                message: 'User not found',
            });
        }

        // Check if the password is correct
        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) {
            return res.status(401).json({
                status: 'error',
                message: 'Password incorrect',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Logged in successfully',
            data: {
                id: admin.id,
                email: admin.email,
                club: admin.club,
                allAccess: admin.allAccess,
            }
        });

    } catch(err){
        console.log(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
        
});

// Check userId
app.get('/api/admins/:id', async (req, res) => {
    try {
        const adminId = req.params.id;

        const admin = await Admin.findOne({ id: adminId });
        if (!admin) {
            return res.status(404).json({
                status: 'error',
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Admin found',
            data: {
                id: admin.id,
                email: admin.email,
                club: admin.club,
                allAccess: admin.allAccess
            }
        });

    } catch(err){
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
        
});

app.listen(port, () => console.log(`adminAuth microservice listening on port ${port}!`));