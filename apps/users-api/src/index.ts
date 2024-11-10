import express from "express";
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import routes from './routes';

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
const PREFIX = process.env.PREFIX || '/api';

// allow CORS 
// To extract in utils
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(`${PREFIX}/users`, routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
