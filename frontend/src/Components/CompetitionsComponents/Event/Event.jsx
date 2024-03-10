import React , { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import axios from 'axios';
import { COMPETITIONS_URL, INSCRIPTIONS_URL } from '../../../Gateway';

import { Participants } from './Participants/Participants';

import './Event.css';

export const Event = ({competition}) => {

    const { eventName } = useParams();

    const [event, setEvent] = useState(null);

    useEffect(() => {
        axios.get(`${COMPETITIONS_URL}/${competition.id}`)
            .then((response) => {
                let event = response.data.data.events.filter((event) => {
                    return event.pseudoName === eventName || eventName.startsWith(`${event.pseudoName} - `);
                })[0];

                console.log(event);

                if (event.pseudoName !== eventName) {
                    for (let subEvent of event.subEvents) {
                        if (eventName === `${event.pseudoName} - ${subEvent.name}`) {
                            event.name = subEvent.name;
                            event.pseudoName = `${event.pseudoName} - ${subEvent.name}`;
                            event.time = subEvent.time;
                            event.type = subEvent.type;
                            delete event.id 
                            event.subEvents = [];
                            break;
                        }
                    }
                }
                setEvent(event);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [competition.id, eventName]);


    const [inscriptions, setInscriptions] = useState([]);

    useEffect(() => {
        axios.get(`${INSCRIPTIONS_URL}/${competition.id}?event=${eventName}`)
            .then((response) => {

                let inscriptions = response.data.data;

                // for the moment need to filter the inscriptions to only get the ones for the event
                // this will be done in the backend in the future

                inscriptions = inscriptions.filter((inscription) => {
                    return inscription.event === eventName;
                });

                setInscriptions(inscriptions);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [competition.id, eventName]);


    
    return (
        <div className="competition-page">
            <div className="event-header">
                <div className='time'>
                    {event?.time}
                </div>
                <div className='name'>
                    {event?.pseudoName}
                </div>
                <div className='nb-participants'>
                    {inscriptions.length} / {event?.maxParticipants} athlètes
                </div>
            </div>

            <Participants event={event} inscriptions={inscriptions} />                

        </div>
    )
}
