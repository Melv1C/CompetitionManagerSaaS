import React, { useEffect, useState } from 'react';
import { xml2json } from "xml-js";

import { Result, ResultDetail, Competition, Competition_Event, formatResult, getCategory } from 'cm-data';

import { Button, newColumn, Table, Input } from 'ui-kit';

import myAxios, {MySQLQuery} from '../AxiosHandler';

type UploadFromFileProps = {
    competition: Competition;
};

function handleHeats(heats: any, resultslist: Result[], event: Competition_Event, competition: Competition) {
    if (!(heats instanceof Array)) {
        heats = [heats];
    }
    for (let i = 0; i < heats.length; i++) {
        const heat = heats[i];
        if (heat === undefined || heat === null) {
            continue;
        }
        let participations = heat['participations']['participation'];
        if (!(participations instanceof Array)) {
            participations = [participations];
        }
        for (let participation of participations) {
            const competitor = participation['participant']['competitor'];
            const athleteId: string = competitor['license']['_text'];
            const lastName: string = competitor['athlete']['lastname']['_text'];
            const firstName: string = competitor['athlete']['firstname']['_text'];
            const bib: number = parseInt(competitor['bib']['_text']);
            const club: string = competitor['team']['abbreviation']['_text'];
            const points: number = parseInt(participation['points']['_text']);
            const initialOrder: number = parseInt(participation['initialorder']['_text']);
            const currentOrder: number = parseInt(participation['currentorder']['_text']);

            let results = participation['results']['result'];

            const newResult: Result = new Result();
            newResult.competition_id = competition.id;
            newResult.setEvent(event);

            newResult.athlete_ref = athleteId;
            newResult.lastName = lastName;
            newResult.firstName = firstName;
            newResult.bib = bib;
            newResult.club = club;

            newResult.category = getCategory(new Date(competitor['athlete']['birthdate']['_text']), new Date(competition.competitionDate), competitor['athlete']['gender']['_text'].replace('W', 'F'));
            
            newResult.points = points;
            newResult.initialOrder = initialOrder;
            newResult.tempOrder = currentOrder;
            newResult.finalOrder = currentOrder;

            newResult.heat = i + 1;

            if (!(results instanceof Array)) {
                results = [results];
            }

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                if (result === undefined || result === null) {
                    continue;
                }
                let val: number, trynum: string, res: string, wind: string;
                switch (event.event_resultType) {
                    case 'Time':
                        val = Math.round(parseFloat(result['result_value']['_text']) * (parseFloat(result['result_value']['_text']) < 0 ? 1 : 1000));
                        trynum = "0";
                        res = formatResult(val, event.event_resultType);
                        wind = result['wind']['_text'];
                        break;
                    case 'Height':
                        const tryresult = result['value']['_text'];
                        const height = parseFloat(result['result_value']['_text']);
                        if (tryresult === '0') {
                            val = height;
                        } else if (tryresult === 'X') {
                            val = -1;
                        } else if (tryresult === '-') { 
                            val = -2;
                        } else if (tryresult === 'DNS') { 
                            val = -3;
                        } else if (tryresult === 'r') { 
                            val = -8;
                        } else if (tryresult === 'NM') { // => no mark (NM)
                            val = -7;
                        } else {
                            val = -8;
                        }
                        trynum = height.toString();
                        res = val <= 0 ? formatResult(val, event.event_resultType) : '0';
                        wind = '';
                        break;
                    case 'Distance':
                        val = parseFloat(result['result_value']['_text']);
                        trynum = `${i+1}`
                        res = formatResult(val, event.event_resultType);
                        wind = result['wind']['_text'];
                        break;
                    case 'Points':
                        throw new Error('Points not supported');
                        // val = parseFloat(result['result_value']['_text']);
                        // trynum = 0;
                        // res = formatResult(val, event.event_resultType);
                        // wind = result['wind']['_text'];
                        // break;

                    default:
                        val = parseFloat(result['result_value']['_text']);
                        trynum = `0`;
                        res = formatResult(val, event.event_resultType);
                        wind = result['wind']['_text'];
                        break;
                }
                if (val <= -9) {
                    continue;
                }
                const detail: ResultDetail = newResult.newDetail();
                detail.setPerformance(trynum, val, res, wind);
            }

            if (newResult.details.length > 0) {
                newResult.getBest();
                resultslist.push(newResult);
            }
        }
    }

    return resultslist;
}

const UploadFromFile: React.FC<UploadFromFileProps> = ({ competition }) => {

    const [sendDisabled, setSendDisabled] = useState<boolean>(true);
    const [results, setResults] = useState<Result[]>([]);
    const [viewResults, setViewResults] = useState<Result[]>([]);
    const [events, setEvents] = useState<Competition_Event[]>([]);

    useEffect(() => {
        const newRes = [];
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const newResult = Result.fromJson(result);
            newResult.id = i;
            newRes.push(newResult);
        }
        setViewResults(newRes);
    }, [results]);

    const columns = [
        newColumn({ title: 'Bib', link: 'bib', width: 50, type: 'number' }),
        newColumn({ title: 'Licence', link: 'athlete_ref', width: 100 }),
        newColumn({ title: 'Name', link: 'fullName', width: 200, valueGetter: (row: any) => row.firstName + ' ' + row.lastName }),
        newColumn({ title: 'Club', link: 'club', width: 100 }),
        newColumn({ title: 'Category', link: 'category', width: 100 }),
        newColumn({ title: 'Event', link: 'event_name', width: 200, valueFormatter: (value: any) => value.split(' - ')[1] }),
        newColumn({ title: 'Value', link: 'value', width: 100, type: 'number'}),
        newColumn({ title: 'Result', link: 'result', width: 100}),
        newColumn({ title: 'Points', link: 'points', width: 100, type: 'number' }),
    ];

    function fetchEvents() {
        MySQLQuery("SELECT * FROM competition_events WHERE competition_id = ?", [competition.id]).then((data) => {
            setEvents(data.map((data: any) => Competition_Event.fromJson(data)));
        });
    }

    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
        }
    };

    const getResult = async () => {
        if (!file) {
            alert('No file selected');
            return;
        }

        // get json from xml
        const reader = new FileReader();
        reader.onload = async (e) => {
            if (e.target) {
                
                let resultslist: Result[] = [];

                const text = e.target.result as string;
                const json = xml2json(text, {compact: true, spaces: 4});
                const dataJson = JSON.parse(json);
                //console.log(dataJson);
                let eventName: string = dataJson['event']['name']['_text'];
                console.log(eventName);
                console.log(events);
                const eventId: number = events.find(e => e.name === eventName)?.id || 0;
                if (eventId === 0) {
                    alert('Event not found');
                    return;
                }
                const event: Competition_Event = events.find(e => e.name === eventName) || new Competition_Event();

                let rounds = dataJson['event']['rounds']['round'];

                if (!(rounds instanceof Array)) {
                    let heats = rounds['heats']['heat'];
                    
                    handleHeats(heats, resultslist, event, competition);

                } else {
                    for (let round of rounds) {
                        if (round['_attributes']['combinedTotal'] === 'false') {
                            // eventname = AAA - BBB si round['name'] = BBB - AAA
                            eventName = round['name']['_text'].split(' - ')[1] + ' - ' + round['name']['_text'].split(' - ')[0];
                            const subeventId: number = events.find(e => e.name === eventName)?.id || 0;
                            console.log(eventName);
                            console.log(events.map(e => e.name));
                            if (subeventId === 0) {
                                alert('Event not found');
                                return;
                            }
                            const subevent: Competition_Event = events.find(e => e.name === eventName) || new Competition_Event();
                            let heats = round['heats']['heat'];
                            
                            handleHeats(heats, resultslist, subevent, competition);
                        } 
                    }                        
                }
                setResults(resultslist);
            }
        };
        reader.readAsText(file);
    };

    

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (results.length > 0) {
            console.log("Want to upload results");
            onUpload(results);
            setResults([]);
        }
    }

    const onUpload = async (results: Result[]) => {
        // get unique event ids
        
        let eventIdsOfResults = results.map(r => r.competitionEvent_id);
        eventIdsOfResults = [...new Set(eventIdsOfResults)];

        for (let eventId of eventIdsOfResults) {
            const URL = `https://competitionmanager.be/api/results`;
            await myAxios.post(`${URL}/${competition.id}/${eventId}`, {
                results: results.filter(r => r.competitionEvent_id === eventId)
            });
        }

        setResults([]);
    };

    useEffect(() => {
        if (results.length > 0) {
            setSendDisabled(false);
        } else {
            setSendDisabled(true);
        }
    }, [results]);

    useEffect(() => {
        fetchEvents();
    }, [competition]);

    return (
        <>
            <h2>Upload Results</h2>
            <div>
                <input type="file" onChange={handleFileChange} />
                <Input type='text' value={file?.name || ''} disabled />
                <Button variant='info' onClick={getResult}>Get Results</Button>
                <Button variant='success' onClick={handleSubmit} disabled={sendDisabled}>Send Results</Button>
            </div>

            <h2>Results View</h2>

            <Table
                columns={columns}
                data={viewResults}
                UpdateData={(_) => {}}
            />
        </>
        
    );
};

export default UploadFromFile;