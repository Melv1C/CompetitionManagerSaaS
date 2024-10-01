import axios from 'axios';
import dotenv from 'dotenv';
import { Athlete } from "cm-data";
import { MySQL } from "cm-back";


dotenv.config();

export async function fillDB(): Promise<void> {

    const athletes: Athlete[] = await MySQL.loadAll(Athlete);

    let newAthletes: Athlete[] = [];

    axios.get('http://www.faisdelathle.be/extranet/exchange/AM_data/athletes_lrba.csv', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'http://www.google.com/',
            'Connection': 'keep-alive'
        },
        auth: {
            username: process.env.LBFA_USER || '',
            password: process.env.LBFA_PASS || ''
        }
        })
        .then(async response => {
            const data = response.data;
            const lines = data.split('\n');
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].split('\t');
                if (parseInt(line[0]) > 10000) {
                    const athlete: Athlete = Athlete.fromJson({
                        licence: line[0],
                        bib: parseInt(line[1]),
                        firstName: line[3],
                        lastName: line[4],
                        gender: line[5],
                        birthDate: line[6],
                        club: line[9]
                    });
                    const found = athletes.find(a => a.licence === athlete.licence);
                    if (!found) {
                        await MySQL.save<Athlete>(athlete);
                        newAthletes.push(athlete);
                    }
                }
            }
            if (newAthletes.length === 0) {
                console.log('No new athletes');
            } else {
                console.log('New athletes:', newAthletes.length);
            }
        }
    ).catch(error => {
        console.error(error);
    });
}
            