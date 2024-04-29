import React , { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import axios from 'axios';
import { INSCRIPTIONS_URL } from '../../../Gateway';

import { Participants } from './Participants/Participants';

import { Link } from 'react-router-dom';

import './Event.css';
import './EventNavBar.css';

export const Event = ({competition}) => {

    const { eventName } = useParams();

    const [event, setEvent] = useState(null);

    const [subEvents, setSubEvents] = useState([]);

    useEffect(() => {
        let event = competition.events.find((event) => {
            return event.pseudoName === eventName;
        });

        if (!event) { // subevent
            const parentEventName = eventName.split(' - ')[0];
            const subEventName = eventName.split(' - ')[1];
            const parentEvent = competition.events.find((event) => {
                return event.pseudoName === parentEventName;
            });
            const subEvent = parentEvent.subEvents.find((subEvent) => {
                return subEvent.name === subEventName;
            });
            event = {
                parentEventName: parentEventName,
                pseudoName: eventName,
                time: subEvent.time,
                maxParticipants: parentEvent.maxParticipants,
                type: subEvent.type,
                isMultiEvent: true
            }

            const subEvents = [{
                pseudoName: parentEvent.pseudoName,
                name: "Total",
                time: parentEvent.time
            }, ...parentEvent.subEvents.map((subEvent) => {
                return {
                    pseudoName: `${parentEvent.pseudoName} - ${subEvent.name}`,
                    name: subEvent.name,
                    time: subEvent.time
                }
            })];
            setSubEvents(subEvents);


        } else if (event.subEvents.length > 0) {
            event.isMultiEvent = true;
            const subEvents = [{
                pseudoName: event.pseudoName,
                name: "Total",
                time: event.time
            }, ...event.subEvents.map((subEvent) => {
                return {
                    pseudoName: `${event.pseudoName} - ${subEvent.name}`,
                    name: subEvent.name,
                    time: subEvent.time
                }
            })];
            setSubEvents(subEvents);
        }
        setEvent(event);
        
    }, [competition, eventName]);


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
            {event?.isMultiEvent ?
                <div className='event-nav-bar'>
                    {subEvents.map((subEvent, index) => {
                        return (
                            <Link to={`/competitions/${competition.id}/${subEvent.pseudoName}`} key={index}>
                                <div className={`event-nav-item ${subEvent.pseudoName === eventName ? 'selected' : ''}`}>
                                    {subEvent.name}
                                </div>
                            </Link>
                        )
                    })}
                </div>
                : null
            }

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
