import express from "express";
import 'dotenv/config';

import { corsMiddleware } from '@competition-manager/utils';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const PREFIX = process.env.PREFIX || '/api';

app.use(corsMiddleware);

app.post(`${PREFIX}/stripe/webhook`, (req, res) => {
    console.log('Stripe webhook received');
    res.send('Stripe webhook received');
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

