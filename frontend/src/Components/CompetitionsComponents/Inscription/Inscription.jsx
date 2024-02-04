import React, { useEffect } from 'react'
import { useState } from 'react'

import {auth} from '../../../Firebase'


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

function ControlButtons({step, setStep}) {
    return (
        <div className='control-buttons'>
            {step > 1 ? <button onClick={()=>{setStep(step-1)}}>Précédent</button> : null}
            {step < 4 ? <button onClick={()=>{setStep(step+1)}}>Suivant</button> : <button onClick={()=>{setStep(step+1)}}>Terminer</button>}
        </div>
    )
}



export const Inscription = ({id}) => {

    const [step, setStep] = useState(1);

    const [athlete, setAthlete] = useState(null);
    const [events, setEvents] = useState([]);
    const [records, setRecords] = useState([]);

    if (athlete) {
        console.log("athlete in inscription");
        console.log(athlete);
    }

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

    useEffect(() => {
        if (athlete === null) {
            setEvents([]);
            setRecords([]);
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

            {step === 1 ? <Athlete athlete={athlete} setAthlete={setAthlete} setStep={setStep} /> : null}
            {step === 2 ? <Events events={events} setEvents={setEvents} setStep={setStep} competitionId={id} category={athlete.category} /> : null}
            {step === 3 ? <Records events={events} records={records} setRecords={setRecords} setStep={setStep} /> : null}

            {/*<ControlButtons step={step} setStep={setStep} />*/}
        </div>
    )
}
