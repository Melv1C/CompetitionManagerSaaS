const nano = require('nano')(process.env.COUCHDB_URL);

function addInscription(dbName, inscription) {
    const db = nano.use(dbName);
    return new Promise((resolve, reject) => {
        db.insert(inscription, (err, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function getInscriptions(dbName) {
    const db = nano.use(dbName);
    return new Promise((resolve, reject) => {
        db.list({ include_docs: true }, (err, body) => {
            if (err) {
                reject(err);
            } else {
                let inscriptions = body.rows.map((row) => row.doc);
                inscriptions = inscriptions.filter((inscription) => !inscription._id.startsWith('_design'));
                resolve(inscriptions);
            }
        });
    });
}

function getInscription(dbName, inscriptionId) {
    const db = nano.use(dbName);
    return new Promise((resolve, reject) => {
        db.get(inscriptionId, (err, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

module.exports = {
    getInscriptions,
    getInscription,
    addInscription
};
