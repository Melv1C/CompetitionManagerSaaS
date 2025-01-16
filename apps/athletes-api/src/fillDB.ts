import axios from 'axios';
import { CreateAthlete$ } from '@competition-manager/schemas';
import { prisma } from '@competition-manager/prisma';
import devData from './data.json';
import foreignClubData from './foreignClub.json';
import { env } from '.';

const checkValidityOfAthlete = (athlete: any) => {
    if (new Date(athlete.birthdate) < new Date('1900-01-01')) return false;
    if (new Date(athlete.birthdate) > new Date()) return false;

    return true;
}


const createForeignClub = async () => {
    for (const clubData of foreignClubData) {
        const club = await prisma.club.findUnique({
            where: {
                abbr: clubData.abbr
            }
        });
        if (!club) {
            await prisma.club.create({
                data: clubData
            });
        }
    }
}
createForeignClub();


const createClub = async (clubAbbr: string) => {
    const club = await prisma.club.findUnique({
        where: {
            abbr: clubAbbr
        }
    });
    if (club) {
        return club;
    }
    const { data } = await axios.get(`https://www.beathletics.be/api/club/${clubAbbr}`);
    return await prisma.club.create({
        data: {
            name: data.name,
            abbr: data.abbr,
            address: data.areaServed,
            province: data.province,
            fedNumber: data.fedNumber,
            country: data.federation.country,
            fedAbbr: data.federation.abbr
        }
    });
}

const addNewAthletes = async () => {

    console.log('---------------------------------');
    console.log('Adding new athletes ...');

    const athletes = await prisma.athlete.findMany({
        where: {
            competitionId: null
        }
    });

    let newAthletes = 0;

    const { data } = await axios.get('http://www.faisdelathle.be/extranet/exchange/AM_data/athletes_lrba.csv', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'http://www.google.com/',
            'Connection': 'keep-alive'
        },
        auth: {
            username: env.LBFA_USER,
            password: env.LBFA_PASS
        }
    })
    const lines = data.split('\n');
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split('\t');
        if (parseInt(line[0]) > 10000) {
            const athleteData = {
                license: line[0],
                bib: parseInt(line[1]),
                firstName: line[3],
                lastName: line[4],
                gender: line[5],
                birthdate: line[6],
                clubAbbr: line[9]
            };

            if (!checkValidityOfAthlete(athleteData)) {
                console.log('Invalid athlete:', athleteData);
                continue;
            }

            const { clubAbbr, ...athlete } = CreateAthlete$.parse(athleteData);
            const club = await createClub(clubAbbr) // get or create if not exist
            if (!athletes.find(a => a.license === athlete.license)) {
                await prisma.athlete.create({
                    data: {
                        ...athlete,
                        club: {
                            connect: {
                                abbr: club.abbr
                            }
                        }
                    }
                });
                newAthletes ++;
            }
        }
    }
    if (newAthletes === 0) {
        console.log('No new athletes');
    } else {
        console.log('New athletes:', newAthletes);
    }
    console.log('---------------------------------');
}

export const initDb = async () =>{
    await addNewAthletes();
    const interval = 1000 * 60 * 60 * 24;
    const now = new Date();
    const millisTill3 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 0, 0, 0).getTime() - now.getTime();
    setTimeout(function() {
        setInterval(addNewAthletes, interval);
    }, millisTill3);
}

export const initDbDev = async () => {
    for (const athleteData of devData) {
        const { clubAbbr, ...athlete } = CreateAthlete$.parse(athleteData);
        const club = await createClub(clubAbbr);
        const athleteInDB = await prisma.athlete.findFirst({
            where: {
                license: athlete.license
            }
        });
        if (!athleteInDB) {
            await prisma.athlete.create({
                data: {
                    ...athlete,
                    club: {
                        connect: {
                            id: club.id
                        }
                    }
                }
            });
        }
    }
}


