import express, { Express, Request, Response } from "express";
import axios from "axios";

import { xml2json } from "xml-js";

import fs from "fs";


require('dotenv').config();

const app: Express = express();
const port = process.env.PORT || 3000;
const prefix = process.env.PREFIX || '/api/results';

interface Result {
    id: string;
    name: string;
    event: string;
    value: string;
    wind?: string;
}

app.get(`${prefix}/`, async (req: Request, res: Response) => {
    
    console.log('GET /');
    //res.send('Hello World!');

    //const filename: string = './100m TC F_list.xml';
    //const filename: string = './Longueur -  BEN M_list.xml';
    const filename: string = './Hauteur - SCO M_list.xml';
    //const filename: string = './Penta MIN M_list.xml';
    //const filename: string = './Poids 4kg - CAD M_list.xml';

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        //console.log(data);
        const json = xml2json(data, {compact: true, spaces: 4});
        //console.log(json);
        let dataJson = JSON.parse(json);
        console.log(dataJson);
        const event = dataJson['event']['name']['_text'];
        dataJson = dataJson['event']['rounds']['round']['heats']['heat']['participations']['participation'];

        const results: Result[] = dataJson.map((result: any) => {
            return {
                id: result['participant']['competitor']['license']['_text'],
                name: result['participant']['competitor']['displayname']['_text'],
                event: event,
                value: result['results']['result']['result_value']['_text'],
                wind: result['results']['result']['wind']['_text']
            };
        });

        res.send(results);
    });
    
});



app.listen(port, () => console.log(`Athletes microservice listening on port ${port}!`));