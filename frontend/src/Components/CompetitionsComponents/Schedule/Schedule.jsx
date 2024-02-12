import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { url } from '../../../Gateway'
import './Schedule.css'

import { formatRecord } from '../../../RecordsHandler'

function ScheduleItem({event, inscriptions}) {

    const [showInscriptions, setShowInscriptions] = useState(false);

    const [placesLeft, setPlacesLeft] = useState(event.maxParticipants - inscriptions.length);

    useEffect(() => {
        setPlacesLeft(event.maxParticipants - inscriptions.length);
    }, [inscriptions, event.maxParticipants]);

    return (
        <div className="schedule-item" onClick={() => setShowInscriptions(!showInscriptions)}>
            <div className="schedule-item-info">
                <div className="schedule-item-time">{event.time}</div>
                <div className="schedule-item-name">{event.name}</div>
                <PlacesLeft placesLeft={placesLeft} key={event.name + placesLeft} />
            </div>
            <div className={`schedule-item-inscriptions ${showInscriptions ? 'show' : 'hide'}`}>
                {inscriptions.map(inscription => {
                    return (
                        <div key={inscription.id} className="inscription-item">
                            <div className="inscription-item-athlete">{inscription.athleteName}</div>
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
        axios.get(`${url}/inscriptions/${competition.id}`)
            .then((response) => {
                setInscriptions(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [competition.id]);

    return (
        <div className="competition-page">
            <div className="schedule">
                
                {competition.events.map(event => {
                    return (
                        <ScheduleItem key={event.id} event={event} inscriptions={inscriptions.filter(inscription => inscription.event===event.name)} />
                    )
                })}
            </div>
            
        </div>
    )
}
