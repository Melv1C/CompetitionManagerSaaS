
const axios = require('axios');

const { addInscription } = require('./nano');


async function freeInscriptions(dbName, inscriptionData) {
    for (let i = 0; i < inscriptionData.length; i++) {
        await addInscription(dbName, inscriptionData[i]);
    }
}

async function stripeInscriptions(dbName, inscriptionData, events, success_url, cancel_url) {
    const url = process.env.STRIPE_URL || '';
    const stripeData = {
        events: events,
        success_url: success_url,
        cancel_url: cancel_url,
        inscriptionData: inscriptionData,
        dbName: dbName,
        email: inscriptionData[0].email
    };
    const response = await axios.post(url + '/api/stripe/checkout-sessions', stripeData);
    return response.data;
}

const privateFields = ['_rev', 'userId'];
function removePrivateFields(inscription) {
    for (field of privateFields) {
        delete inscription[field];
    }
    return inscription;
}

module.exports = {
    freeInscriptions,
    stripeInscriptions,
    removePrivateFields
};
