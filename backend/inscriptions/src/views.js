const nano = require('nano')(process.env.COUCHDB_URL);

function getRelevantData(data) {
    // data.value is { count: 1, distinctAthletes: [doc.athleteId]} => data.value = 1
    if (Object.keys(data.value).length === 2 && ['count', 'distinctAthletes'].every((key) => Object.keys(data.value).includes(key))) {
        return { key: data.key, value: data.value.count };
    } 
    return data;
 }

function addViews(db) {
    const views = {
        _id: '_design/queries',
        views: {
            NumberOfAthletesByClub: {
                map: function (doc) {
                    if (doc.inscribed) {
                        emit(doc.club, { count: 1, distinctAthletes: [doc.athleteId]});
                    }
                }.toString(),
                reduce: function (keys, values, rereduce) {
                    let distinctAthletes = []
                    for (let i = 0; i < values.length; i++) {
                        values[i].distinctAthletes.forEach((athlete) => {
                            if (!distinctAthletes.includes(athlete)) {
                                distinctAthletes.push(athlete);
                            }
                        });
                    }
                    return { count: distinctAthletes.length, distinctAthletes: distinctAthletes };          
                }.toString()
            },
            NumberOfAthletesByEvent: {
                map: function (doc) {
                    if (doc.inscribed) {
                        emit(doc.event, { count: 1, distinctAthletes: [doc.athleteId] });
                    }
                }.toString(),
                reduce: function (keys, values, rereduce) {
                    let distinctAthletes = []
                    for (let i = 0; i < values.length; i++) {
                        values[i].distinctAthletes.forEach((athlete) => {
                            if (!distinctAthletes.includes(athlete)) {
                                distinctAthletes.push(athlete);
                            }
                        });
                    }
                    return { count: distinctAthletes.length, distinctAthletes: distinctAthletes };                    
                }.toString()
            },
            NumberOfAthletesByCategory: {
                map: function (doc) {
                    if (doc.inscribed) {
                        emit(doc.category, { count: 1, distinctAthletes: [doc.athleteId] });
                    }
                }.toString(),
                reduce: function (keys, values, rereduce) {
                    let distinctAthletes = []
                    for (let i = 0; i < values.length; i++) {
                        values[i].distinctAthletes.forEach((athlete) => {
                            if (!distinctAthletes.includes(athlete)) {
                                distinctAthletes.push(athlete);
                            }
                        });
                    }
                    return { count: distinctAthletes.length, distinctAthletes: distinctAthletes };                    
                }.toString()
            },
            NumberOfEventsByAthlete: {
                map: function (doc) {
                    if (doc.inscribed) {
                        emit(doc.athleteId, 1);
                    }
                }.toString(),
                reduce: '_count'
            },
            NumberOfDeinscriptions: {
                map: function (doc) {
                    if (!doc.inscribed) {
                        emit(doc.athleteId, 1);
                    }
                }.toString(),
                reduce: '_count'
            },
        }
    };
    return addView(db, '_design/queries', views);
}

function addView(dbName, viewName, view) {
    const db = nano.use(dbName);
    return new Promise((resolve, reject) => {
        db.insert(view, viewName, (err, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function getGroupedView(dbName, viewName) {
    const db = nano.use(dbName);
    return new Promise((resolve, reject) => {
        db.view("queries", viewName, { group: true }, (err, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body.rows.map(getRelevantData));
            }
        });
    });
}

module.exports = {
    addViews,
    addView,
    getGroupedView
};