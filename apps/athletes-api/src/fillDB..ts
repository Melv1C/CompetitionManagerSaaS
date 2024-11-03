import axios from 'axios';
import dotenv from 'dotenv';
import { Athlete$ } from '@competition-manager/schemas';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import devData from './data.json';


dotenv.config();

const AthleteWithoutId$ = Athlete$.omit({ id: true, competitionId: true });
type AthleteWithoutId = z.infer<typeof AthleteWithoutId$>;


const addNewAthletes = async () => {

    const athletes = await prisma.athlete.findMany({
        where: {
            competitionId: null
        }
    });
    console.log(athletes);

    let newAthletes: AthleteWithoutId[] = [];

    const { data } = await axios.get('http://www.faisdelathle.be/extranet/exchange/AM_data/athletes_lrba.csv', {
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
    const lines = data.split('\n');
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split('\t');
        if (parseInt(line[0]) > 10000) {
            console.log(line[6]);
            const athlete: AthleteWithoutId = AthleteWithoutId$.parse({
                license: line[0],
                bib: parseInt(line[1]),
                firstName: line[3],
                lastName: line[4],
                gender: line[5],
                birthdate: line[6],
                club: line[9]
            });
            const found = athletes.find(a => a.license === athlete.license);
            if (!found) {
                await prisma.athlete.create({
                    data: athlete
                });
                newAthletes.push(athlete);
            }
            if (newAthletes.length >= 100) {
                break;
            }
        }
    }
    if (newAthletes.length === 0) {
        console.log('No new athletes');
    } else {
        console.log('New athletes:', newAthletes.length);
    }
}

export const initDb = async () =>{
    // Run the function every day at 3:00 AM
    const interval = 1000 * 60 * 60 * 24;
    const now = new Date();
    const millisTill3 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 0, 0, 0).getTime() - now.getTime();
    setTimeout(function() {
        setInterval(addNewAthletes, interval);
    }, millisTill3);
}

export const initDbDev = async () => {
    for (const athleteData of devData) {
        const athlete: AthleteWithoutId = AthleteWithoutId$.parse(athleteData);
        const found = await prisma.athlete.findFirst({
            where: {
                license: athlete.license
            }
        });
        if (!found) {
            await prisma.athlete.create({
                data: athlete
            });
        }
    }
}


