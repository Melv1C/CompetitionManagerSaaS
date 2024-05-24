import React, { useEffect,useState } from 'react'
import axios from 'axios';
import { ATLHETES_URL, INSCRIPTIONS_URL, COMPETITIONS_URL } from '../../Gateway';

import { useSearchParams, useParams } from 'react-router-dom';
import './Inscription.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleList, faUser, faPersonRunning, faStopwatch } from '@fortawesome/free-solid-svg-icons'

import { OneDayAthlete } from './OneDayAthlete/OneDayAthlete';
import { Athlete } from './Athlete/Athlete'
import { Events } from './Events/Events'
import { Records } from './Records/Records'
import { Summary } from './Summary/Summary'
import { Success } from './Success/Success'



function ProgressBar({step}) {

    return (
        <div className='progress-bar'>
            {step > 1 ? <div className='step active'>
                <div><FontAwesomeIcon icon={faUser} /></div>
            </div> 
            : <div className='step'>
                <div><FontAwesomeIcon icon={faUser} /></div>
            </div>}

            {step > 2 ? <div className='step active'>
                <div><FontAwesomeIcon icon={faPersonRunning} /></div>
            </div>
            : <div className='step'>
                <div><FontAwesomeIcon icon={faPersonRunning} /></div>
            </div>}

            {step > 3 ? <div className='step active'>
                <div><FontAwesomeIcon icon={faStopwatch} /></div>
            </div>
            : <div className='step'>
                <div><FontAwesomeIcon icon={faStopwatch} /></div>
            </div>}

            {step > 4 ? <div className='step active'>
                <div><FontAwesomeIcon icon={faRectangleList} /></div>
            </div>
            : <div className='step'>
                <div><FontAwesomeIcon icon={faRectangleList} /></div>
            </div>}
        </div>
    )
}

export const Inscription = (props) => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    
    let step = parseInt(searchParams.get('step')) || 1;
    const setStep = (step) => {
        setSearchParams((prev) => {
            prev.set('step', step);
            return prev;
        });
    }

    const athleteId = searchParams.get('athleteId');
    const setAthleteId = (athlete) => {
        if (athlete === null) {
            setSearchParams(prev => {
                prev.delete('athleteId');
                return prev;
            });
            setAthlete(null);
        } else {
            setSearchParams(prev => {
                prev.set('athleteId', athlete.id);
                return prev;
            });
        }
    }

    const [athlete, setAthlete] = useState(null);
    const [events, setEvents] = useState([]);
    const [records, setRecords] = useState({});

    const setRecord = (event, record, subEvent=null, type=null) => {
        setRecords((prevRecords) => {
            if (subEvent) {
                if (!prevRecords[event]) {
                    return {...prevRecords, [event]: {[subEvent]: record}}
                } else if (!prevRecords[event][subEvent]) {
                    return {...prevRecords, [event]: {...prevRecords[event], [subEvent]: record}}
                } else if (type === 'setTo0IfUndef' && prevRecords[event][subEvent]) {
                    return prevRecords;
                } else if (type === 'setToRecordIfNotDef' && parseFloat(prevRecords[event][subEvent]) !== 0) {
                    return prevRecords;
                }
                return {...prevRecords, [event]: {...prevRecords[event], [subEvent]: record}}
            } else {
                if (!prevRecords[event]) {
                    return {...prevRecords, [event]: record}
                } else if (type === 'setTo0IfUndef' && prevRecords[event]) {
                    return prevRecords;
                } else if (type === 'setToRecordIfNotDef' && parseFloat(prevRecords[event]) !== 0) {
                    return prevRecords;
                }
                return {...prevRecords, [event]: record}
            }
        })
    }

    // loads athlete from URL
    useEffect(() => {        
        if (athleteId) {
            axios.get(`${ATLHETES_URL}/${athleteId}`)
            .then(res => {
                const athlete = res.data.data;
                athlete.id = athlete.id.toString();
                setAthlete(athlete);
            })
            .catch(err => {
                console.log(err);
            })
        } else {
            setAthlete(null);
            setEvents([]);
            localStorage.removeItem('events');
            setRecords({});
            localStorage.removeItem('records');
            setStep(1);
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete('isInscribed');
            setSearchParams(newSearchParams);
            
        }
    }, [athleteId])

    // loads events and records from local storage
    useEffect(() => {
        const events = JSON.parse(localStorage.getItem('events')) || [];
        setEvents(events);

        const records = JSON.parse(localStorage.getItem('records')) || {};
        setRecords(records);

        if (events.length === 0 && (step > 2 && step < 5)) {
            setStep(2);
        }
    }, [])

    // saves events and records to local storage
    useEffect(() => {
        if (events.length === 0) {
            localStorage.removeItem('events');
        } else {
            localStorage.setItem('events', JSON.stringify(events));
        }

        // delete records for events that are not in events
        if (Object.keys(records).length != 0) {
            for (let event in records) {
                if (!events.map(e => e.pseudoName).includes(event)) {
                    delete records[event];
                }
            }
        }
    }, [events])

    useEffect(() => {
        if (Object.keys(records).length === 0) {
            localStorage.removeItem('records');
        } else {
            localStorage.setItem('records', JSON.stringify(records));
        }
    }, [records])

    const [freeEvents, setFreeEvents] = useState(new Set());

    const [isForeignAthlete, setIsForeignAthlete] = useState(false);

    // load information if already inscribed
    useEffect(() => {
        if (athlete) {
            axios.get(`${INSCRIPTIONS_URL}/${id}`)
            .then(async res => {
                const inscriptions = res.data.data;
                const athleteInscriptions = inscriptions.filter(i => i.athleteId === athlete.id);
                //setFreeEvents(new Set(athleteInscriptions.map(i => i.event)));
                // set events and records
                if (athleteInscriptions.length > 0) {

                    // add to url isInsribed to true
                    const newSearchParams = new URLSearchParams(searchParams);
                    newSearchParams.set('isInscribed', 'true');
                    setSearchParams(newSearchParams);
                    

                    const events = (await axios.get(`${COMPETITIONS_URL}/${id}/events?category=${athlete.category}`)).data.data;
                    for (let i of athleteInscriptions) {
                        const event = events.find(e => e.pseudoName === i.event);
                        if (event) {
                            setEvents((prevEvents) => {
                                if (prevEvents.find(e => e.pseudoName === event.pseudoName)) {
                                    return prevEvents;
                                } else {
                                    return [...prevEvents, event];
                                }
                            })
                        }

                        switch (i.eventType) {
                            case 'event':
                                setRecord(i.event, i.record);
                                break;
                            case 'multiEvent':
                                setRecord(i.event, i.record, "total");
                                break;
                            case 'subEvent':
                                setRecord(i.parentEvent, i.record, i.event.replace(i.parentEvent + ' - ', ''));
                                break;
                            default:
                                break;
                        }
                    }
                }
                
            })
        }
    }, [athlete])

    // load free events
    useEffect(() => {
        if (!athlete) {
            return;
        }
        console.log('loading free events');
        axios.get(`${INSCRIPTIONS_URL}/${id}/freeEvents?athleteId=${athlete.id}`)
        .then(res => {
            setFreeEvents(new Set(res.data.data));
        })
        .catch(err => {
            console.log(err);
        })
    }, [athlete])

    // change cost of event if in freeEvents
    useEffect(() => {
        for (let event of events) {
            if (freeEvents.has(event.pseudoName)) {
                event.cost = 0;
            }
        }
    }, [freeEvents])

    return (
        <div className='competition-page'>
            <ProgressBar step={step} />
            {step === -1 ? <OneDayAthlete competitionId={id} isForeignAthlete={isForeignAthlete} setStep={setStep} setAthleteId={setAthleteId} setIsForeignAthlete={setIsForeignAthlete} /> : null}

            {step === 1 ? <Athlete athlete={athlete} setAthlete={setAthleteId} setStep={setStep} competitionId={id} oneDay={true} setIsForeignAthlete={setIsForeignAthlete} user={props.user}/> : null}
            {step === 2 ? <Events events={events} setEvents={setEvents} setStep={setStep} competitionId={id} category={athlete ? athlete.category : null} free={true} freeEvents={freeEvents} /> : null}
            {step === 3 ? <Records events={events} records={records} setRecord={setRecord} setStep={setStep} competitionId={id}/> : null}
            {step === 4 ? <Summary athlete={athlete} events={events} records={records} setStep={setStep} competitionId={id} free={true} user={props.user}/> : null}
            {step === 5 ? <Success competitionId={id} /> : null}
        </div>
    )
}

