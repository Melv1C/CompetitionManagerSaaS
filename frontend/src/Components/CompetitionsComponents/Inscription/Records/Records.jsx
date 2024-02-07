import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';

import axios from 'axios';

import './Records.css'

function ControlButtons({setStep, records, events}) {
    return (
        <div className='control-buttons'>
            <button onClick={()=>{setStep(2)}}>Précédent</button>
            <button onClick={()=>{setStep(4)}}>Suivant</button>
        </div>
    )
}

export const Records = ({events, records, setRecords, setStep}) => {

    const [searchParams, setSearchParams] = useSearchParams();

    const athleteId = searchParams.get('athleteId');

    const [ personalRecords, setPersonalRecords ] = useState({});

    useEffect(() => {
        for (let event of events) {

            const url = process.env.NODE_ENV === 'development' ? 'http://localhost/api/athletes' : '/api/athletes';

            axios.get(`${url}/${athleteId}/${event}?maxYears=1`)
                .then(response => {
                    setPersonalRecords({...personalRecords, [event]: response.data.data.perf});
                })
                .catch(error => {
                    console.log(error);
                });
        } 
    }, [events, athleteId]);


    return (
        <div className='step-page'>
            <h2>Records</h2>

            <div className='records-list'>
                {events.map((event, index) => {
                    return (
                        <div className='record-item' key={index}>
                            <div className='record-item-name'>{event}</div>
                            <input type='number' value={personalRecords[event]} onChange={(e) => {
                                setPersonalRecords({...personalRecords, [event]: e.target.value});
                            }} />

                        </div>
                    )
                })}
            </div>

            <ControlButtons setStep={setStep} records={records} events={events} />
        </div>
    )
}
