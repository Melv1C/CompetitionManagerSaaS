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

function EventsRecordsSummary({events, records, free}) {
    return (
        <div className='events-records-summary'>
            <h3>Épreuves</h3>
            <div className='events-records-summary-content'>
                {events.map((event, index) => {
                    return <EventItem key={index} event={event} records={records} free={free} />
                })}
            </div>
        </div>
    )
}

function EventItem({event, records, free}) {

    const isMultiEvent = event.subEvents ? event.subEvents.length > 0 : false;
    const isSubEvent = event.superEvent !== undefined;

    let record;
    if (isSubEvent) {
        record = records[event.superEvent][event.name]
    } else if (isMultiEvent) {
        record = records[event.pseudoName]["total"]
    } else {
        record = records[event.name];
    }

    return (
        <div className='event-item'>
            <div className='event-item-time'>{event.time}</div>
            <div className='event-item-name'>{event.pseudoName}</div>
            <div className='event-item-record'>{formatRecord(event, record)}</div>
            {(event.cost !== 0 && !free) ? <div className='event-item-cost'>{event.cost} €</div> : <div className='event-item-cost'></div>}
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

    // get isInscribed from url
    const urlSearchParams = new URLSearchParams(window.location.search);
    const isInscribed = urlSearchParams.get('isInscribed');

    if (isInscribed === 'true') {
        console.log(`PUT ${INSCRIPTIONS_URL}/${competitionId}/${athlete.id}`);
        axios.put(`${INSCRIPTIONS_URL}/${competitionId}/${athlete.id}`, {
            userId: user.uid,
            events: events.map(event => event.pseudoName),
            records: records,
            success_url: `/competitions/${competitionId}?subPage=inscription&athleteId=${athlete.id}&step=5`,
            cancel_url: `/competitions/${competitionId}?subPage=inscription&athleteId=${athlete.id}&step=4`
        })
        .then(res => {
            console.log(res);
            if (res.status === 200) {
                // if url returned, redirect to url
                try {
                    window.location.href = res.data.data.url;
                } catch (err) {
                    setStep(5);
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
        return;
    }
    axios.post(`${INSCRIPTIONS_URL}/${competitionId}`, {
        userId: user.uid,
        athleteId: athlete.id,
        events: events.map(event => event.pseudoName),
        records: records,
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


export const Summary = ({athlete, events, records, setStep, competitionId, user, free}) => {
    const [totalCost, setTotalCost] = useState(0);
    useEffect(() => {
        if (free) {
            setTotalCost(0);
        } else {
            setTotalCost(events.reduce((acc, event) => acc + event.cost, 0));
        }
    }, [events, free])

    if (!athlete) {
        return <div>Chargement...</div>
    }

    let eventsList = [];
    for (let event of events) {
        eventsList.push(event);
        for (let subEvent of event.subEvents) {
            eventsList.push({...subEvent, pseudoName: `${event.pseudoName} - ${subEvent.name}`, superEvent: event.pseudoName});
        }
    }

    return (
        <div className='step-page'>
            <h2>Récapitulatif</h2>
            <div className='summary'>
                <AthleteSummary athlete={athlete} />
                <EventsRecordsSummary events={eventsList} records={records} free={free} />
                <TotalCost totalCost={totalCost} />
            </div>
            <ControlButtons setStep={setStep} totalCost={totalCost} athlete={athlete} events={events} records={records} competitionId={competitionId} user={user}/>
        </div>

    )
}
