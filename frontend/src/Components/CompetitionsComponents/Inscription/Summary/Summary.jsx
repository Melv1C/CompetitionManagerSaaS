import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { auth } from '../../../../Firebase'

import { formatRecord } from '../../../../RecordsHandler'

import './Summary.css'

function AthleteSummary({athlete}) {
    return (
        <div className='athlete-summary'>
            <h3>Athlète</h3>
            <div className='athlete-summary-content'>
                {athlete.firstName} {athlete.lastName} ({athlete.club})
            </div>
        </div>
    )
}

function EventsRecordsSummary({events, records}) {
    return (
        <div className='events-records-summary'>
            <h3>Épreuves</h3>
            <div className='events-records-summary-content'>
                {events.map((event, index) => {
                    return <EventItem key={index} event={event} records={records} />
                })}
            </div>
        </div>
    )
}

function EventItem({event, records}) {
    return (
        <div className='event-item'>
            <div className='event-item-time'>{event.time}</div>
            <div className='event-item-name'>{event.name}</div>
            <div className='event-item-record'>{formatRecord(event, records[event.name])}</div>
            {event.cost !== 0 ? <div className='event-item-cost'>{event.cost} €</div> : <div className='event-item-cost'></div>}
        </div>
    )
}

function TotalCost({totalCost}) {
    if (totalCost === 0) {
        return null;
    }
    return (
        <div className='total-cost'>
            <h3>Coût total</h3>
            <div className='total-cost-content'>{totalCost} €</div>
        </div>
    )
}

function ControlButtons({setStep, totalCost, athlete, events, records, competitionId}) {
    return (
        <div className='control-buttons'>
            <button onClick={()=>{setStep(3)}}>Précédent</button>
            <button onClick={()=>{postInscription(athlete, events, records, competitionId, setStep)}}>{totalCost === 0 ? 'Valider' : 'Payer'}</button>
        </div>
    )
}

function postInscription(athlete, events, records, competitionId, setStep) {
    console.log(athlete, events, records);

    const url = process.env.NODE_ENV === 'development' ? 'http://localhost/api/inscriptions' : '/api/inscriptions';

    axios.post(`${url}/${competitionId}`, {
        userId: auth.currentUser.uid,
        athleteId: athlete.id,
        events: events.map(event => event.name),
        records: records
    })
    .then(res => {
        console.log(res);
        setStep(5);
    })
    .catch(err => {
        console.log(err);
    })

}


export const Summary = ({athlete, events, records, setStep, competitionId}) => {
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        setTotalCost(events.reduce((acc, event) => acc + event.cost, 0));
    }, [events]);


    return (
        <div className='step-page'>
            <h2>Récapitulatif</h2>
            <div className='summary'>
                <AthleteSummary athlete={athlete} />
                <EventsRecordsSummary events={events} records={records} />
                <TotalCost totalCost={totalCost} />
            </div>
            <ControlButtons setStep={setStep} totalCost={totalCost} athlete={athlete} events={events} records={records} competitionId={competitionId} />
        </div>

    )
}
