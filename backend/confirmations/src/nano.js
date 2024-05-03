const nano = require('nano')(process.env.COUCHDB_URL);

function RemoveUninscribedInscriptions(inscriptions) {
    return inscriptions.filter((inscription) => inscription.inscribed);
}

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
                inscriptions = RemoveUninscribedInscriptions(inscriptions);
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

async function updateInscription(dbName, inscription) {
    const db = nano.use(dbName);
    return new Promise((resolve, reject) => {
        db.insert(inscription, (err, body) => {
            if (err) {
                // Handle conflict error
                if (err.statusCode === 409) {
                    // Fetch the latest revision token for the document
                    getInscription(dbName, inscription._id)
                        .then(doc => {
                            // Retry the update with the latest revision token
                            inscription._rev = doc._rev;
                            updateInscription(dbName, inscription)
                                .then(resolve)
                                .catch(reject);
                        })
                        .catch(reject);
                } else {
                    reject(err);
                }
            } else {
                resolve(body);
            }
        });
    });
}

module.exports = {
    getInscriptions,
    getInscription,
    addInscription,
    updateInscription,
};
