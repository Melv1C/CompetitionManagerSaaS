import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { INSCRIPTIONS_URL } from '../../../../Gateway'

import { auth } from '../../../../Firebase'

import { formatRecord } from '../../../../RecordsHandler'

import './Summary.css'

function AthleteSummary({athlete}) {
    return (
        <div className='athlete-summary'>
            <div className='athlete-summary-item'>
                <h3>Athlète</h3>
                <div className='athlete-summary-content'>
                    {athlete.firstName} {athlete.lastName} ({athlete.club})
                </div>
            </div>
            <div className='athlete-summary-item'>
                <h3>Catégorie</h3>
                <div className='athlete-summary-content'>
                    {athlete.category}
                </div>
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
        record = records[event.pseudoName];
    }

    return (
        <div className='event-item'>
            <div className='event-item-time'>{event.time}</div>
            <div className='event-item-name'>{event.pseudoName}</div>
            <div className='event-item-record'>{formatRecord(event.type, record)}</div>
            {(event.cost && event.cost !== 0 && !free) ? <div className='event-item-cost'>{event.cost} €</div> : <div className='event-item-cost'></div>}
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

function ControlButtons({setStep, totalCost, athlete, events, records, competitionId, acceptData}) {
    return (
        <div className='control-buttons'>
            <button onClick={()=>{setStep(3)}}>Précédent</button>
            <button onClick={()=>{
                if (!acceptData) {
                    alert('Vous devez accepter l\'utilisation de vos données dans le cadre de la compétition pour vous inscrire.');
                    return;
                }
                // disable button 
                document.querySelector('.control-buttons button:last-child').disabled = true;
                postInscription(athlete, events, records, competitionId, setStep)

            }}>{totalCost === 0 ? 'Valider' : 'Payer'}</button>
        </div>
    )
}

function postInscription(athlete, events, records, competitionId, setStep) {
    // get isInscribed from url
    const urlSearchParams = new URLSearchParams(window.location.search);
    const isInscribed = urlSearchParams.get('isInscribed');

    if (isInscribed === 'true') {
        axios.put(`${INSCRIPTIONS_URL}/${competitionId}/${athlete.id}`, {
            userId: auth.currentUser.uid,
            events: events.map(event => event.pseudoName),
            records: records,
            email: auth.currentUser.email,
            success_url: window.location.protocol+'//'+window.location.host+window.location.pathname+'?subPage=inscription&athleteId='+athlete.id+'&step=5',
            cancel_url: window.location.protocol+'//'+window.location.host+window.location.pathname+'?subPage=inscription&athleteId='+athlete.id+'&step=4',
        })
        .then(res => {
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
            alert('Une erreur est survenue lors du traitement de votre inscription. Si le problème persiste, veuillez nous contacter.');
            // refresh page
            //window.location.reload();
        })
        return;
    }

    axios.post(`${INSCRIPTIONS_URL}/${competitionId}`, {
        userId: auth.currentUser.uid,
        athleteId: athlete.id.toString(),
        events: events.map(event => event.pseudoName),
        records: records,
        email: auth.currentUser.email,
        success_url: window.location.protocol+'//'+window.location.host+window.location.pathname+'?subPage=inscription&athleteId='+athlete.id+'&step=5',
        cancel_url: window.location.protocol+'//'+window.location.host+window.location.pathname+'?subPage=inscription&athleteId='+athlete.id+'&step=4',
    })
    .then(res => {
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

//J'accepte l'utilisation de mes données dans le cadre de la compétition.
function AcceptData({acceptData, setAcceptData}) {
    return (
        <div className='accept-data'>
            <input type='checkbox' id='accept-data' name='accept-data' value={acceptData} onChange={(e) => setAcceptData(e.target.value)} />
            <label htmlFor='accept-data'>J'accepte l'utilisation de mes données dans le cadre de la compétition uniquement.</label>
        </div>
    )
}


export const Summary = ({athlete, events, records, setStep, competitionId, free, freeEvents}) => {
    const [totalCost, setTotalCost] = useState(0);
    const [acceptData, setAcceptData] = useState(false);

    const [modifiedEvents, setModifiedEvents] = useState([]);

    useEffect(() => {
        const newEvents = events.map(event => {
            if ([...freeEvents].includes(event.pseudoName)) {
                return {...event, cost: 0};
            } else {
                return event;
            }
        })
        setModifiedEvents(newEvents);
    }, [events, freeEvents])

    useEffect(() => {
        if (free) {
            setTotalCost(0);
        } else {
            setTotalCost(modifiedEvents.reduce((acc, event) => acc + event.cost, 0));
        }
    }, [modifiedEvents, free])

    if (!athlete) {
        return <div>Chargement...</div>
    }

    let eventsList = [];
    for (let event of modifiedEvents) {
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

            <AcceptData acceptData={acceptData} setAcceptData={setAcceptData} />
            
            <ControlButtons setStep={setStep} totalCost={totalCost} athlete={athlete} events={events} records={records} competitionId={competitionId} acceptData={acceptData} />
        </div>

    )
}


