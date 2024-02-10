import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';

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

export const Inscription = ({id}) => {

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

    //const [step, setStep] = useState(1);

    const [athlete, setAthlete] = useState(null);
    const [events, setEvents] = useState([]);
    const setBackupEvents = (events) => {
        if (events.length === 0) {
            localStorage.removeItem('events');
            setEvents(events);
        } else {
            localStorage.setItem('events', JSON.stringify(events));
            setEvents(events);
        }
    }
    const [records, setRecords] = useState({});
    const setBackupRecords = (records) => {
        if (Object.keys(records).length === 0) {
            localStorage.removeItem('records');
            setRecords(records);
        } else {
            localStorage.setItem('records', JSON.stringify(records));
            setRecords(records);
        }
    }

    // loads athlete from URL

    useEffect(() => {
        const url = process.env.NODE_ENV === 'development' ? 'http://localhost/api/athletes' : '/api/athletes';
        
        if (athleteId) {
            axios.get(`${url}/${athleteId}`)
            .then(res => {
                setAthlete(res.data.data);
            })
            .catch(err => {
                console.log(err);
            })
        } else {
            setAthlete(null);
            setBackupEvents([]);
            setBackupRecords({});
        }
    }, [athleteId])

    // loads events and records from local storage
    useEffect(() => {
        const events = JSON.parse(localStorage.getItem('events')) || [];
        setEvents(events);

        const records = JSON.parse(localStorage.getItem('records')) || {};
        setRecords(records);
    }, [])

    // if no event is selected step is max 2
    useEffect(() => {
        if (events.length === 0 && (step > 2 && step < 5)) {
            setStep(2);
        }
    }, [events])

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

            {step === 1 ? <Athlete athlete={athlete} setAthlete={setAthleteId} setStep={setStep} /> : null}
            {step === 2 ? <Events events={events} setEvents={setEvents} setStep={setStep} competitionId={id} category={"SEN M"} /> : null}
            {step === 3 ? <Records events={events} records={records} setRecords={setRecords} setStep={setStep} /> : null}
            {step === 4 ? <Summary athlete={athlete} events={events} records={records} setStep={setStep} competitionId={id} /> : null}
            {step === 5 ? <Success competitionId={id} /> : null}
        </div>
    )
}
