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

//function ControlButtons({step, setStep}) {
//    return (
//        <div className='control-buttons'>
//            {step > 1 ? <button onClick={()=>{setStep(step-1)}}>Précédent</button> : null}
//            {step < 4 ? <button onClick={()=>{setStep(step+1)}}>Suivant</button> : <button onClick={()=>{setStep(step+1)}}>Terminer</button>}
//        </div>
//    )
//}

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
    const [records, setRecords] = useState({});

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
        }
    }, [athleteId])


    useEffect(() => {
        if (athlete === null) {
            setEvents([]);
            setRecords([]);
        }
    }, [athlete])

    // if no event is selected step is max 2
    useEffect(() => {
        if (events.length === 0 && step > 2) {
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

            {/*<ControlButtons step={step} setStep={setStep} />*/}
        </div>
    )
}
