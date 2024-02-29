import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { INSCRIPTIONS_URL } from '../../../Gateway'

import { formatRecord } from '../../../RecordsHandler'

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
            <div className='event-item-name'>{event.pseudoName}</div>
            <div className='event-item-record'>{formatRecord(event, records[event.pseudoName])}</div>
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

function ControlButtons({setStep, totalCost, athlete, events, records, competitionId,user}) {
    return (
        <div className='control-buttons'>
            <button onClick={()=>{setStep(3)}}>Précédent</button>
            <button onClick={()=>{postInscription(athlete, events, records, competitionId, setStep, user)}}>{totalCost === 0 ? 'Valider' : 'Payer'}</button>
        </div>
    )
}

function postInscription(athlete, events, records, competitionId, setStep, user) {
    console.log(athlete, events, records);

    let newRecords = {};
    for (let event in records) {
        let RealEvent = events.find(e => e.pseudoName == event);
        newRecords[RealEvent.name] = records[event];
    }
    console.log(newRecords);
    console.log(user)
    axios.post(`${INSCRIPTIONS_URL}/${competitionId}?admin=${user.uid}`, {
        userId: user.uid,
        athleteId: athlete.id,
        events: events.map(event => event.name),
        records: newRecords,
        success_url: `/competitions/${competitionId}?subPage=inscription&athleteId=${athlete.id}&step=5`,
        cancel_url: `/competitions/${competitionId}?subPage=inscription&athleteId=${athlete.id}&step=4`
    })
    .then(res => {
        console.log(res);
        if (res.status === 200) {
            // redirect to res.data.url
            window.location.href = res.data.data.url;
        } else if (res.status === 201) {
            setStep(5);
        } else {
            console.log(res);
        }
    })
    .catch(err => {
        console.log(err);
    })

}


export const Summary = ({athlete, events, records, setStep, competitionId, user}) => {
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        setTotalCost(events.reduce((acc, event) => acc + event.cost, 0));
    }, [events]);

    if (!athlete) {
        return <div>Chargement...</div>
    }


    return (
        <div className='step-page'>
            <h2>Récapitulatif</h2>
            <div className='summary'>
                <AthleteSummary athlete={athlete} />
                <EventsRecordsSummary events={events} records={records} />
                <TotalCost totalCost={totalCost} />
            </div>
            <ControlButtons setStep={setStep} totalCost={totalCost} athlete={athlete} events={events} records={records} competitionId={competitionId} user={user}/>
        </div>

    )
}
