const nano = require('nano')(process.env.COUCHDB_URL);

function createDatabase(dbName) {
    return new Promise((resolve, reject) => {
        nano.db.create(dbName, (err) => {
            if (err) {
                if (err.statusCode === 412) {
                    resolve(nano.db.use(dbName));
                } else {
                    reject(err);
                }
            } else {
                resolve(nano.db.use(dbName));
            }
        });
    });
}

function deleteDatabase(dbName) {
    return new Promise((resolve, reject) => {
        nano.db.destroy(dbName, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
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

function getUsefullInscriptions(inscriptions) {
    return inscriptions.filter((inscription) => !inscription._id.startsWith('_design'));
}

function RemoveUninscribedInscriptions(inscriptions) {
    return inscriptions.filter((inscription) => inscription.inscribed);
}

function getAllInscriptions(dbName) {
    const db = nano.use(dbName);
    return new Promise((resolve, reject) => {
        db.list({ include_docs: true }, (err, body) => {
            if (err) {
                reject(err);
            } else {
                let inscriptions = getUsefullInscriptions(body.rows.map((row) => row.doc));
                resolve(inscriptions);
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
                let inscriptions = getUsefullInscriptions(body.rows.map((row) => row.doc));
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

async function deleteInscription(dbName, inscriptionId) {
    // change the data field inscribed to false in the database
    const inscription = await getInscription(dbName, inscriptionId);
    inscription.inscribed = false;
    return await addInscription(dbName, inscription);
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
    createDatabase,
    deleteDatabase,
    getInscriptions,
    getInscription,
    deleteInscription,
    updateInscription,
    addInscription,
    getAllInscriptions
};
