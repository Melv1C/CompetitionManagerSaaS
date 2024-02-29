import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { COMPETITIONS_URL, INSCRIPTIONS_URL } from '../../../../Gateway'

import './Events.css'

function EventsList({availableEvents, events, setEvents, competitionId, inscriptions, free}) {

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
                return <EventItem key={index} event={event} setEvents={setEvents} events={events} competitionId={competitionId} inscriptions={inscriptions} free={free} />
            })}
        </div>
    )
}

function EventItem({event, setEvents, events, competitionId, inscriptions, free}) {
    const [checked, setChecked] = useState(false);

    const [place, setPlace] = useState(null);

    useEffect(() => {
        if (events.map(e => e.name).includes(event.name)) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    }, [events, event])

    useEffect(() => {
        const eventInscriptions = inscriptions.filter(i => i.event === event.name);
        setPlace(event.maxParticipants - eventInscriptions.length);
    }, [event, competitionId])

    return (
        <div className='event-item'>
            <div className='event-item-time'>{event.time}</div>
            <div className='event-item-name'>{event.pseudoName}</div>
            <Place place={place} />
            <input type='checkbox' checked={checked} className='event-item-checkbox' onChange={() => {
                if (!checked) {
                    setEvents([...events, event]);
                } else {
                    setEvents(events.filter(e => e.name !== event.name));
                }
                setChecked(!checked);
            }} />
            {(event.cost === 0 || free) ? <div className='event-item-cost'></div> : <div className='event-item-cost'>{event.cost}€</div>}
            
        </div>
    )
}

function Place({place}) {
    if (place === null) {
        return <div className='event-item-place green'>Places illimitées</div>
    } else if (place === 0) {
        return <div className='event-item-place red'>Complet</div>
    } else if (place > 10) {
        return <div className='event-item-place green'>{place} places restantes</div>
    } else if (place > 5) {
        return <div className='event-item-place orange'>{place} places restantes</div>
    } else {
        return <div className='event-item-place red'>{place} places restantes</div>
    }
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

export const Events = ({events, setEvents, setStep, competitionId, category, free}) => {

    const [availableEvents, setAvailableEvents] = useState([]);

    const [inscriptions, setInscriptions] = useState([]);

    useEffect(() => {
        axios.get(`${COMPETITIONS_URL}/${competitionId}/events?category=${category}`)
        .then(res => {
            const availableEventsData = res.data.data;
            setEvents(events.filter(e => availableEventsData.map(e => e.name).includes(e.name)));            
            setAvailableEvents(availableEventsData);
        })
        .catch(err => {
            console.log(err);
        })
    }, [competitionId, category])

    useEffect(() => {
        axios.get(`${INSCRIPTIONS_URL}/${competitionId}`)
        .then(res => {
            setInscriptions(res.data.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [competitionId])

    return (
        <div className='step-page'>
            <h2>Épreuves</h2>
            <div className='events'>
                <EventsList availableEvents={availableEvents} events={events} setEvents={setEvents} competitionId={competitionId} inscriptions={inscriptions} free={free} />    

            </div>
            <ControlButtons setStep={setStep} setEvents={setEvents} events={events} />
        </div>
    )
}
