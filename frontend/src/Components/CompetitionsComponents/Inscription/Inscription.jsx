import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';
import { ATLHETES_URL, INSCRIPTIONS_URL, COMPETITIONS_URL } from '../../../Gateway'

import {auth} from '../../../Firebase'

import { useSearchParams } from 'react-router-dom';


import './Inscription.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleList, faUser, faPersonRunning, faStopwatch } from '@fortawesome/free-solid-svg-icons'

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

export const Inscription = ({competition}) => {

    const id = competition.id;

    const [searchParams, setSearchParams] = useSearchParams();
    
    const step = parseInt(searchParams.get('step')) || 1;
    const setStep = (step) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('step', step);
        setSearchParams(newSearchParams);
    }

    const athleteId = searchParams.get('athleteId');
    const setAthleteId = (athlete) => {

        if (athlete === null) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete('athleteId');
            setSearchParams(newSearchParams);
            setAthlete(null);
        } else {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('athleteId', athlete.id);
            setSearchParams(newSearchParams);
        }
    }

    const [athlete, setAthlete] = useState(null);
    const [events, setEvents] = useState([]);
    const [records, setRecords] = useState({});

    const setRecord = (event, record, subEvent=null) => {

        setRecords((prevRecords) => {
            if (subEvent) {
                return {...prevRecords, [event]: {...prevRecords[event], [subEvent]: record}}
            } else {
                return {...prevRecords, [event]: record}
            }
        })
    }

    // loads athlete from URL
    useEffect(() => {        
        if (athleteId) {
            axios.get(`${ATLHETES_URL}/${athleteId}`)
            .then(res => {
                setAthlete(res.data.data);
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

    // if no user is logged in, message is displayed
    const [user, setUser] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(true);
            } else {
                setUser(false);
            }
        })
    }, [])

    const [freeEvents, setFreeEvents] = useState(new Set());

    // load information if already inscribed
    useEffect(() => {
        if (athlete) {
            axios.get(`${INSCRIPTIONS_URL}/${competition.id}`)
            .then(async res => {
                const inscriptions = res.data.data;
                const athleteInscriptions = inscriptions.filter(i => i.athleteId === athlete.id);
                setFreeEvents(new Set(athleteInscriptions.map(i => i.event)));
                // set events and records
                if (athleteInscriptions.length > 0) {

                    // add to url isInsribed to true
                    const newSearchParams = new URLSearchParams(searchParams);
                    newSearchParams.set('isInscribed', 'true');
                    setSearchParams(newSearchParams);
                    

                    const events = (await axios.get(`${COMPETITIONS_URL}/${competition.id}/events?category=${athlete.category}`)).data.data;
                    console.log(events);
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

    if (!user) {
        return (
            <div className='competition-page'>
                <h2>Veuillez vous connecter pour vous inscrire à une compétition</h2>
            </div>
        )
    }

    return (
        <div className='competition-page'>
            <ProgressBar step={step} />

            {step === 1 ? <Athlete athlete={athlete} setAthlete={setAthleteId} setStep={setStep} competitionId={id} /> : null}
            {step === 2 ? <Events events={events} setEvents={setEvents} setStep={setStep} competitionId={id} category={athlete ? athlete.category : null} free={(competition.freeClub && athlete?.club === competition.club) ? true : false} freeEvents={freeEvents} /> : null}
            {step === 3 ? <Records events={events} records={records} setRecord={setRecord} setStep={setStep} /> : null}
            {step === 4 ? <Summary athlete={athlete} events={events} records={records} setStep={setStep} competitionId={id} free={(competition.freeClub && athlete?.club === competition.club) ? true : false} /> : null}
            {step === 5 ? <Success competitionId={id} /> : null}
        </div>
    )
}

