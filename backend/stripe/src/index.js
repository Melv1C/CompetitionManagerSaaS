const express = require('express');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { 
    freeInscriptions
} = require('./utils');

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

app.post('/api/stripe/checkout-sessions', async (req, res) => {
    const { events, success_url, cancel_url } = req.body;
    const { inscriptionData, dbName } = req.body;

    if (!events || !success_url || !cancel_url) {
        res.status(400).json({ status: 'error', message: 'Missing events, success_url or cancel_url' });
        return;
    }

    const metadata = { dbName: dbName };
    for (let i = 0; i < inscriptionData.length; i++) {
        metadata[`inscriptionData${i}`] = JSON.stringify(inscriptionData[i]);
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'bancontact'],
        line_items: events.map(event => {
            if (event.cost != 0) {
                return {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: event.name
                        },
                        unit_amount: event.cost*100,
                    },
                    quantity: 1,
                };
            }
        }),
        mode: 'payment',
        success_url: req.body.success_url,
        cancel_url: req.body.cancel_url,
        metadata: metadata
    });

    res.status(200).json({ id: session.id, url: session.url });
});

app.post('/api/stripe/webhook', async (req, res) => {
    try {
        const stripeEvent = req.body;
        switch (stripeEvent.type) {
            case 'checkout.session.completed':
                const metadata = stripeEvent.data.object.metadata;
                const inscriptionData = [];
                for (let key in metadata) {
                    if (key.startsWith('inscriptionData')) {
                        inscriptionData.push(JSON.parse(metadata[key]));
                    }
                }
                const dbName = metadata.dbName;

                await freeInscriptions(dbName, inscriptionData);

                res.status(200).json({ status: 'success', message: 'Inscriptions added successfully' });

                break;
            default:
                console.log(`Unhandled event type ${stripeEvent.type}`);
                res.status(400).json({ status: 'error', message: 'Unhandled event type' });

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

app.listen(port, () => console.log(`Stripe service listening on port ${port}!`));
