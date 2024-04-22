const { 
    createDatabase,
    getAthletes,
    addAthlete,
 } = require('./nano');

const axios = require('axios');

async function addNewAthletes() {
    athletes = await getAthletes('global_athletes');
    axios.get('http://www.faisdelathle.be/extranet/exchange/AM_data/athletes_lrba.csv', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'http://www.google.com/',
            'Connection': 'keep-alive'
        },
        auth: {
            username: 'AM4LBFA',
            password: 'Marathon42195'
        }
        })
        .then(response => {
            const data = response.data;
            const lines = data.split('\n');
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].split('\t');
                if (parseInt(line[0]) > 10000) {
                    const athlete = {
                        _id: line[0],
                        id: parseInt(line[0]),
                        bib: parseInt(line[1]),
                        firstName: line[3],
                        lastName: line[4],
                        gender: line[5] === 'M' ? 'Male' : "Female",
                        birthDate: line[6],
                        club: line[9]
                    };
                    const found = athletes.find(a => a.id === athlete.id);
                    if (!found) {
                        addAthlete('global_athletes', athlete)
                            .then(() => {
                                console.log(`Athlete ${athlete.id} added successfully`);
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    }
                }
            }

        })
        .catch(error => {

            console.error('Error:', error.message);
        });
}

            



function initDB() {

    createDatabase('global_athletes')
        .then(() => {
            console.log('Database global_athletes created successfully');
            addNewAthletes(); 
        })
        .catch((err) => {
            console.error(err);
        });

    // Run the function every day at 3:00 AM
    const interval = 1000 * 60 * 60 * 24;
    const now = new Date();
    const millisTill3 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 0, 0, 0) - now;
    setTimeout(function() {
        setInterval(addNewAthletes, interval);
    }, millisTill3);

     
}

module.exports = {
    initDB,
}