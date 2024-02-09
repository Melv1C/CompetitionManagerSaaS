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

function getInscriptions(dbName) {
    const db = nano.use(dbName);
    return new Promise((resolve, reject) => {
        db.list({ include_docs: true }, (err, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body.rows.map((row) => row.doc));
            }
        });
    });
}

function getInscription(dbName, inscriptionId) {
    console.log('getInscription', dbName, inscriptionId);
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

function updateInscription(dbName, inscription) {
    const db = nano.use(dbName);
    console.log(inscription);
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

function deleteInscription(dbName, inscriptionId, rev) {
    const db = nano.use(dbName);
    return new Promise((resolve, reject) => {
        db.destroy(inscriptionId, rev, (err, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

module.exports = {
    createDatabase,
    deleteDatabase,
    addInscription,
    getInscriptions,
    getInscription,
    updateInscription,
    deleteInscription
};
