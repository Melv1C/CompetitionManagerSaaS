import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

import { Server } from "socket.io";
import { createServer } from "http";

import { Athlete, Result, ResultDetail, Competition, Competition_Event, Event, formatResult} from 'cm-data';
import { MySQL } from 'cm-back';

MySQL.init();
dotenv.config();

const serviceName = "results";
const port = process.env.PORT || 3000;
const prefix = process.env.PREFIX || '/results';

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        // origin: '*',
        origin: ['http://localhost:4000', 'https://competitionmanager.be'],
    }
});

io.on('connection', (socket) => {
    // console.log('a user connected', socket.id);
    socket.on('disconnect', () => {
        // console.log('user disconnected', socket.id);
    });

    socket.on('joinCompetition', async (competition_name) => {
        // first leave all competition rooms
        const competitionRooms = socket.rooms.values();
        for (let room of competitionRooms) {
            if (room.startsWith("Competition-")) {
                socket.leave(room);
                // console.log('leaving room for competition', room, socket.id);
            }
        }
        const competition: Competition = await MySQL.loadBy(Competition, "name", competition_name);
        socket.join(`Competition-${competition.id}`);
        // console.log('joining room for competition', competition.id, competition.name, socket.id);
    });

    socket.on('joinEvent', async (event_name) => {
        // first leave all event rooms
        const eventRooms = socket.rooms.values();
        for (let room of eventRooms) {
            if (room.startsWith("Event-")) {
                socket.leave(room);
                // console.log('leaving room for event', room, socket.id);
            }
        }
        const event: Competition_Event = await MySQL.loadBy(Competition_Event, "name", event_name);

        // const linkEvents = await MySQL.loadAllBy(Competition_Event, {parentEvent_id: event.id});
        // for (let linkEvent of linkEvents) {
        //     socket.join(`Event-${linkEvent.id}`);
        //     console.log('joining room for event', linkEvent.id, linkEvent.name, socket.id);
        // }

        socket.join(`Event-${event.id}`);
        // console.log('joining room for event', event.id, event.name, socket.id);
    });

    socket.on('leave', async (type: "Competition" | "Event", room) => {
        switch (type) {
            case "Competition":
                const competition: Competition = await MySQL.loadBy(Competition, "name", room);
                socket.leave(`Competition-${competition.id}`);
                console.log('leaving room for competition', competition.id, socket.id);
                break;
            case "Event":
                const event: Competition_Event = await MySQL.loadBy(Competition_Event, "name", room);
                socket.leave(`Event-${event.id}`);
                console.log('leaving room for event', event.id, socket.id);
                break;
        }
    });
});

async function sendResult(result: Result, type: "POST" | "PUT" | "DELETE") {
    // load details if not already loaded
    if (!result.details || result.details.length == 0) {
        result.details = await MySQL.loadAllBy(ResultDetail, {"result_id": result.id});
    }

    if (type === "POST") {
        // send new result to all clients
        io.to(`Competition-${result.competition_id}`).emit('Event', result.event_name);
    }

    io.to(`Event-${result.competitionEvent_id}`).emit('Result', type, result);
}

// allow cross-origin requests
app.use((req: Request, res: Response, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());

// renvoie la liste des noms d'épreuves ou il y a au moins un résultats
app.get(`${prefix}/:competition_name`, async (req: Request, res: Response) => {
    const competition: Competition = await MySQL.loadBy(Competition, "name", req.params.competition_name);
    const results: Result[] = await MySQL.loadAllBy(Result, {"competition_id": competition.id});
    const events: string[] = results.map((r) => r.event_name).filter((value, index, self) => self.indexOf(value) === index);
    res.status(200).json({
        status: 'success',
        message: 'Retrieved all event names',
        data: events
    });
});

app.get(`${prefix}/:competition_name/:event_name`, async (req: Request, res: Response) => {

    const competition: Competition = await MySQL.loadBy(Competition, "name", req.params.competition_name);

    const results: Result[] = await MySQL.loadAllBy(Result, {"competition_id": competition.id, "event_name": req.params.event_name});

    for (let i = 0; i < results.length; i++) {
        results[i].details = await MySQL.loadAllBy(ResultDetail, {"result_id": results[i].id});
    }

    // const otherEventsNames: string[] = (await MySQL.query(`SELECT ce.name FROM competition_events ce JOIN competition_events ce2 on ce2.id = ce.parentEvent_id AND ce2.name = ?`, [req.params.event_name])).map((r: any) => r.name);

    // for (let otherEventName of otherEventsNames) {
    //     const otherResults: Result[] = await MySQL.loadAllBy(Result, {"competition_id": competition.id, "event_name": otherEventName});

    //     for (let i = 0; i < otherResults.length; i++) {
    //         otherResults[i].details = await MySQL.loadAllBy(ResultDetail, {"result_id": otherResults[i].id});
    //     }

    //     results.push(...otherResults);
    // }

    res.status(200).json({
        status: 'success',
        message: 'Retrieved all results',
        data: results
    });
});


async function updateParentEventId(result: Result) {

    // check if the result has a valid perf and no points
    // if so, we don't update the parent event
    if (result.value > 0 && result.points == 0) {
        return;
    } 

    const competitionEvent = await MySQL.load(Competition_Event, result.competitionEvent_id);
    
    if (!competitionEvent.parentEvent_id) {
        return;
    }

    const parentEvent = await MySQL.load(Competition_Event, competitionEvent.parentEvent_id);

    let parentResult: Result | undefined = undefined;
    try {
        parentResult = (await MySQL.loadAllBy(Result, {competitionEvent_id: parentEvent.id, athlete_ref: result.athlete_ref}))[0];
        if (!parentResult) {
            throw new Error("No parent result found");
        }
    } catch (e) {
        //console.log(e);
        parentResult = new Result();
        parentResult.competition_id = result.competition_id;
        parentResult.setEvent(parentEvent);
        parentResult.athlete_ref = result.athlete_ref;
        parentResult.lastName = result.lastName;
        parentResult.firstName = result.firstName;
        parentResult.bib = result.bib;
        parentResult.club = result.club;
        parentResult.category = result.category;
    }

    const type = parentResult.id > 0 ? 'PUT' : 'POST';
    if (parentResult.id == 0) {
        await MySQL.save(parentResult);
    } else {
        parentResult.details = await MySQL.loadAllBy(ResultDetail, {result_id: parentResult.id});
    }

    // search if a detail already exists for this event
    const EventAbbr: string = (await MySQL.query(`SELECT ce.event_abbr from competition_events ce where ce.id = ?`, [result.competitionEvent_id]))[0].event_abbr;
    let detail: ResultDetail | undefined = parentResult.details.find((rd) => rd.trynum == EventAbbr);
    if (!detail) {
        detail = parentResult.newDetail();
        detail.trynum = EventAbbr;
    } 

    detail.value = result.points;
    detail.result = formatResult(result.points, parentResult.event_resultType);
    await MySQL.save(detail);

    // console.log(parentResult.details);
    parentResult.getBest();
    
    await MySQL.save(parentResult);

    io.to(`Competition-${parentResult.competition_id}`).emit('Event', parentResult.event_name);
    io.to(`Event-${parentResult.competitionEvent_id}`).emit('Result', type, parentResult);
}

app.post(`${prefix}/:competition_id/:event_id`, async (req: Request, res: Response) => {
    try {
        const results: Result[] = req.body.results.map((r: any) => {
            const result = Result.fromJson(r);
            result.details = r.details.map((rd: any) => ResultDetail.fromJson(rd));
            if (result.competition_id != parseInt(req.params.competition_id) || result.competitionEvent_id != parseInt(req.params.event_id)) {
                throw new Error("Invalid competition_id or event_id");
            }
            return result;
        });

        // Delete all results for this event
        const oldResults: Result[] = await MySQL.loadAllBy(Result, {competition_id: req.params.competition_id, competitionEvent_id: req.params.event_id});
        for (let oldResult of oldResults) {
            // Delete all result details first
            const resultDetails: ResultDetail[] = await MySQL.loadAllBy(ResultDetail, {result_id: oldResult.id});
            for (let i = 0; i < resultDetails.length; i++) {
                await MySQL.remove(resultDetails[i]);
            }
            await MySQL.remove(oldResult);
        }

        for (let result of results) {
            await MySQL.save(result);

            for (let newResultDetail of result.details) {
                newResultDetail.result_id = result.id;
                await MySQL.save(newResultDetail);
            }

            io.to(`Competition-${req.params.competition_id}`).emit('Event', result.event_name);

            await updateParentEventId(result);
        }

        io.to(`Event-${req.params.event_id}`).emit('AllResult', results[0].event_name, results);

        res.status(201).json({
            status: 'success',
            message: 'Results created',
            data: results
        });

    } catch (e) {
        console.log("Error creating results", e);
        res.status(400).json({
            status: 'error',
            message: 'Error creating results'
        });
    }

});

app.post(`${prefix}`, async (req: Request, res: Response) => {
    try {
        const result: Result = Result.fromJson(req.body);

        for (let i = 0; i < result.details.length; i++) {
            result.details[i] = ResultDetail.fromJson(result.details[i]);
        }

        await MySQL.save(result);

        for (let newResultDetail of result.details) {
            newResultDetail.result_id = result.id;
            await MySQL.save(newResultDetail);
        }

        await sendResult(result, 'POST');

        await updateParentEventId(result);

        res.status(201).json({
            status: 'success',
            message: 'Result created',
            data: result
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({
            status: 'error',
            message: 'Error creating result'
        });
    }
});

app.put(`${prefix}/:id`, async (req: Request, res: Response) => {

    console.log(req.body);

    const id: number = parseInt(req.params.id);
    const result: Result = Result.fromJson(req.body);
    result.id = id;
    for (let i = 0; i < result.details.length; i++) {
        result.details[i] = ResultDetail.fromJson(result.details[i]);
        result.details[i].result_id = result.id;
    }
    await MySQL.save(result);

    const oldResultDetails: ResultDetail[] = await MySQL.loadAllBy(ResultDetail, {result_id: result.id});
    for (let oldResultDetail of oldResultDetails) {
        const newResultDetail: ResultDetail | undefined = result.details.find((rd) => rd.id === oldResultDetail.id);
        if (!newResultDetail) {
            // Delete if not in new list
            await MySQL.remove(oldResultDetail);
        } else {
            await MySQL.save(newResultDetail);
        }
    }

    for (let newResultDetail of result.details) {
        if (!oldResultDetails.find((rd) => rd.id === newResultDetail.id)) {
            // Insert if not in old list
            if (newResultDetail.id > 0) {
                newResultDetail.id = 0;
            }
            await MySQL.save(newResultDetail);
        }
    }

    await sendResult(result, 'PUT');

    updateParentEventId(result);

    res.status(200).json({
        status: 'success',
        message: 'Result updated',
        data: result
    });
});

app.delete(`${prefix}/:id`, async (req: Request, res: Response) => {

    const id: number = parseInt(req.params.id);
    const result: Result = await MySQL.load(Result, id);

    // Delete all result details first
    const resultDetails: ResultDetail[] = await MySQL.loadAllBy(ResultDetail, {result_id: id});
    for (let i = 0; i < resultDetails.length; i++) {
        await MySQL.remove(resultDetails[i]);
    }

    await MySQL.remove(result);

    await sendResult(result, 'DELETE');

    await updateParentEventId(result);

    res.status(200).json({
        status: 'success',
        message: 'Result deleted',
        data: result
    });
});
    
server.listen(port, () => {
    console.log(`${serviceName} running at http://localhost:${port}`);
});

