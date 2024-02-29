import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { INSCRIPTIONS_URL } from '../../../Gateway'
import './Schedule.css'

import { formatRecord } from '../../../RecordsHandler'

function ScheduleItem({event, inscriptions}) {

    const [showInscriptions, setShowInscriptions] = useState(false);

    const [placesLeft, setPlacesLeft] = useState(event.maxParticipants - inscriptions.length);

    useEffect(() => {
        setPlacesLeft(event.maxParticipants - inscriptions.length);
    }, [inscriptions, event.maxParticipants]);

    console.log(inscriptions);

    return (
        <div className="schedule-item" onClick={() => setShowInscriptions(!showInscriptions)}>
            <div className="schedule-item-info">
                <div className="schedule-item-time">{event.time}</div>
                <div className="schedule-item-name">{event.pseudoName}</div>
                <PlacesLeft placesLeft={placesLeft} key={event.name + placesLeft} />
            </div>
            <div className={`schedule-item-inscriptions ${showInscriptions ? 'show' : 'hide'}`}>
                {inscriptions.sort((a, b) => {
                    if (event.type === 'time') {
                        return a.record - b.record;
                    } else {
                        return b.record - a.record;
                    }
                }).map(inscription => {
                    return (
                        <div key={inscription.id} className="inscription-item">
                            <div className="inscription-item-bib">{inscription.bib}</div>
                            <div className="inscription-item-athlete">{inscription.athleteName}</div>
                            <div className="inscription-item-club">{inscription.club}</div>
                            <div className="inscription-item-record">{formatRecord(event, inscription.record)}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function PlacesLeft({placesLeft}) {
    if (placesLeft <= 0) {
        return <div className="schedule-item-places red"><strong>Complet</strong></div>
    } else if (placesLeft <= 5) {
        return <div className="schedule-item-places red">{placesLeft} places restantes</div>
    } else if (placesLeft <= 10) {
        return <div className="schedule-item-places orange">{placesLeft} places restantes</div>
    } else {
        return <div className="schedule-item-places green">{placesLeft} places restantes</div>
    }
}


export const Schedule = ({competition}) => {

    const [inscriptions, setInscriptions] = useState([]);

    useEffect(() => {
        axios.get(`${INSCRIPTIONS_URL}/${competition.id}`)
            .then((response) => {
                setInscriptions(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [competition.id]);

    let events = [];
    for (let event of competition.events) {
        events.push(event);
        for (let subEvent of event.subEvents) {
            events.push({...subEvent, pseudoName: `${event.pseudoName} - ${subEvent.name}`, superEvent: event.name, maxParticipants: event.maxParticipants});
        }
    }

    console.log(events);

    return (
        <div className="competition-page">
            <div className="schedule">
                
                {events.sort((a, b) => {
                    if (a.time < b.time) {
                        return -1;
                    } else if (a.time > b.time) {
                        return 1;
                    } else {
                        return 0;
                    }
                }).map(event => {
                    return (
                        <ScheduleItem key={event.id} event={event} inscriptions={inscriptions.filter(inscription => inscription.event===event.pseudoName)} />
                    )
                })}
            </div>
            
        </div>
    )
}
