import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

import './Events.css'

function EventsList({availableEvents, events, setEvents}) {

    if (availableEvents.length === 0) {
        return (
            <div className='events-list'>
                <div className='no-events'>Aucune épreuve disponible</div>
            </div>
        )
    }

    return (
        <div className='events-list'>
            {availableEvents.map((event, index) => {
                return <EventItem key={index} event={event} setEvents={setEvents} events={events} />
            })}
        </div>
    )
}

function EventItem({event, setEvents, events}) {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (events.includes(event.name)) {
            setChecked(true);
        }
    }, [events, event])

    return (
        <div className='event-item'>
            <div className='event-item-time'>{event.time}</div>
            <div className='event-item-name'>{event.name}</div>
            <input type='checkbox' checked={checked} className='event-item-checkbox' onChange={() => {
                if (!checked) {
                    setEvents([...events, event.name]);
                } else {
                    setEvents(events.filter(e => e !== event.name));
                }
                setChecked(!checked);
            }} />
            <span className='checkmark'></span>
            
        </div>
    )
}

function nextStep(setStep, events) {
    if (events.length === 0) {
        alert('Veuillez sélectionner au moins une épreuve');
    } else {
        setStep(3);
    }
}

function ControlButtons({setStep, events}) {
    return (
        <div className='control-buttons'>
            <button onClick={()=>{setStep(1)}}>Précédent</button>
            <button onClick={()=>{nextStep(setStep, events)}}>Suivant</button>
        </div>
    )
}

export const Events = ({events, setEvents, setStep, competitionId, category}) => {

    const [availableEvents, setAvailableEvents] = useState([]);

    useEffect(() => {
        const url = process.env.NODE_ENV === 'development' ? 'http://localhost/api/competitions' : '/api/competitions';

        axios.get(`${url}/${competitionId}/events?category=${category}`)
        .then(res => {
            const events = res.data.data;
            setAvailableEvents(events);
        })
        .catch(err => {
            console.log(err);
        })
    }, [competitionId, category])

    return (
        <div className='step-page'>
            <h2>Épreuves</h2>
            <div className='events'>
                <EventsList availableEvents={availableEvents} events={events} setEvents={setEvents} />          

            </div>
            <ControlButtons setStep={setStep} setEvents={setEvents} events={events} />
        </div>
    )
}
