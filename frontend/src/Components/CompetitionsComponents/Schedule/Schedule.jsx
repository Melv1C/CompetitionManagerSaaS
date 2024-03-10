import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import axios from 'axios'
import { INSCRIPTIONS_URL } from '../../../Gateway'
import './Schedule.css'

import { formatRecord } from '../../../RecordsHandler'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'

function ScheduleItem({event, inscriptions, competition}) {
    const [placesLeft, setPlacesLeft] = useState(event.maxParticipants - inscriptions.length);

    useEffect(() => {
        setPlacesLeft(event.maxParticipants - inscriptions.length);
    }, [inscriptions, event.maxParticipants]);

    return (
        <div className="schedule-item">
            <Link to={`/competitions/${competition.id}/${event.pseudoName}`} key={event.pseudoName}>
                <div className="schedule-item-info">
                    <div className="schedule-item-time">{event.time}</div>
                    <div className="schedule-item-name">{event.pseudoName}</div>
                    <PlacesLeft placesLeft={placesLeft} key={event.name + placesLeft} />
                    <div className="schedule-item-icon">
                        <FontAwesomeIcon icon={faUsers} /> Participants 
                    </div>
                </div>
            </Link>
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
    console.log(inscriptions);
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
                        <ScheduleItem key={event.id} event={event} inscriptions={inscriptions.filter(inscription => inscription.event===event.pseudoName)} competition={competition} />
                    )
                })}
            </div>
            
        </div>
    )
}
