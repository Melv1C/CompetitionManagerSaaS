require('dotenv').config();
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

/*
    * Get a database by name
    * @param {string} dbName
    * @returns {boolean} true if the database exists, false otherwise
    * @throws {Error} if an error occurs while getting the database
*/
function getDatabase(dbName) {
    return new Promise((resolve, reject) => {
        nano.db.get(dbName, (err) => {
            if (err) {
                if (err.statusCode === 404) {
                    resolve(false);
                } else {
                    reject(err);
                }
            } else {
                resolve(true);
            }
        });
    });
}

function addAthlete(dbName, athlete) {
    const db = nano.use(dbName);
    return new Promise((resolve, reject) => {
        db.insert(athlete, (err, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function getAthletes(dbName) {
    const db = nano.use(dbName);
    return new Promise((resolve, reject) => {
        db.list({ include_docs: true }, (err, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body.rows.map(row => row.doc));
            }
        });
    });
}

function getAthlete(dbName, id) {
    const db = nano.use(dbName);
    return new Promise((resolve, reject) => {
        db.get(id, (err, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(removePrivateFields(body));
            }
        });
    });
}

function removePrivateFields(athlete) {
    delete athlete._id;
    delete athlete._rev;
    return athlete;
}

module.exports = {
    createDatabase,
    deleteDatabase,
    getDatabase,
    addAthlete,
    getAthletes,
    getAthlete,
};
