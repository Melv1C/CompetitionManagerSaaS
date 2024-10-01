import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import axios from 'axios';

import { MySQL, checkToken, generateToken, Token, ExpiredTokenError, checkRole } from 'cm-back';
import { User, Competition, Competition_Event, Event } from "cm-data";

MySQL.init();
dotenv.config();

const port = process.env.PORT || 3000;
const serviceName = 'admin';
const prefix = process.env.PREFIX || '/admin';

const app: Express = express();

// allow CORS
app.use(cors());

app.use(express.json());

app.post(`${prefix}/login`, async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user: User = await MySQL.loadBy(User, 'username', username);

        if (!bcrypt.compareSync(password, user.password)) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }

        const token = generateToken(user);

        res.status(200).json({ 
            id: user.id,
            username: user.username,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid username' });
        return;
    }
});

app.post(`${prefix}/refresh-token`, async (req: Request, res: Response) => {
    // get the token from the authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
    try {
        const decodedToken = Token.decode(token);
        const user: User = await MySQL.load(User, decodedToken.user_id);
        if (!user || user.id == 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const newToken = generateToken(user);
        res.status(200).json({ token: newToken });
    } catch (error) {
        if (error instanceof ExpiredTokenError) {
            res.status(401).json({ message: 'Token expired' });
        } else {
            res.status(401).json({ message: 'Invalid token' });
        }
    }
});

app.post(`${prefix}/MYSQL`, [checkToken, checkRole('admin')], async (req: Request, res: Response) => {
    const { query, values } = req.body;
    try {
        const data = await MySQL.query(query, values);
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error });
    }
});

async function getIdIfFound(entity: any, field: string, value: string): Promise<number> {
    try {
        const result = await MySQL.loadBy(entity, field, value);
        return result.id;
    } catch (e) {
        //console.log(e);
        return 0;
    }
}

app.post(`${prefix}/fetchData`, async (req: Request, res: Response) => {
    // get all competitions from the database (/api/competitions)
    const competitions = await axios.get('https://competitionmanager.be/api/competitions');
    const datas = competitions.data.data;

    for (let data of datas) {
        console.log("1");
        let id = await getIdIfFound(Competition, "name", data.name);
        console.log("2");
        const competition = new Competition();
        if (id > 0) {
            competition.id = id;
        }
        competition.name = data.name;
        competition.competitionDate = new Date(data.date);
        competition.inscriptionEnd = new Date(data.closeDate);
        competition.location = data.location;
        competition.club = data.club;
        competition.freeForOrgClub = data.freeClub;
        competition.linkSchedule = data.schedule;
        competition.contactEmail = data.email;
        competition.description = data.description;
        competition.open = data.open;
        competition.oneDayAthlete = data.oneDay;
        competition.foreignAthlete = data.oneDay;
        console.log("3");
        await MySQL.save(competition);
        console.log("4");
        for (let event of data.events) {
            
            const mysqlEventId = await getIdIfFound(Event, "name", event.name);
            if (mysqlEventId == 0) {
                continue;
            }

            const mysqlCompetitionEventId = await getIdIfFound(Competition_Event, "name", event.pseudoName);
            
            const competitionEvent = new Competition_Event();
            if (mysqlCompetitionEventId > 0) {
                competitionEvent.id = mysqlCompetitionEventId;
            }

            competitionEvent.competition_id = competition.id;
            competitionEvent.setEvent(await MySQL.load(Event, mysqlEventId));
            competitionEvent.name = event.pseudoName;
            competitionEvent.time = event.time;
            competitionEvent.maxAthletes = event.maxParticipants || 0;
            competitionEvent.price = event.cost;
            competitionEvent.categories = event.categories;
            competitionEvent.parentEvent_id = 0;

            console.log("5");
            await MySQL.save(competitionEvent);
            console.log("6");
            competition.events.push(competitionEvent);

            for (let subevent of event.subEvents) {
                const mysqlSubEventId = await getIdIfFound(Event, "name", subevent.name);
                if (mysqlSubEventId == 0) {
                    continue;
                }

                const mysqlCompetitionSubEventId = await getIdIfFound(Competition_Event, "name", subevent.pseudoName);

                const competitionSubEvent = new Competition_Event();
                if (mysqlCompetitionSubEventId > 0) {
                    competitionSubEvent.id = mysqlCompetitionSubEventId;
                }

                competitionSubEvent.competition_id = competition.id;
                competitionSubEvent.setEvent(await MySQL.load(Event, mysqlSubEventId));
                competitionSubEvent.name = event.pseudoName + " - " + subevent.name;
                competitionSubEvent.time = subevent.time;
                competitionSubEvent.maxAthletes = event.maxParticipants;
                competitionSubEvent.price = 0;
                competitionSubEvent.categories = event.categories;
                competitionSubEvent.parentEvent_id = competitionEvent.id;

                await MySQL.save(competitionSubEvent);

                competition.events.push(competitionSubEvent);

            }
        }
    }
    res.status(200).json({
        status: 'success',
        message: 'Fetched all competitions'
    });
});



app.listen(port, () => {
    console.log(`${serviceName} service running at port ${port} with prefix ${prefix}`);
});