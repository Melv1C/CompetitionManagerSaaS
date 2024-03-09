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
                    return event.pseudoName === eventName;
                });

                setEvent(event[0]);
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

    console.log(event);
    console.log(inscriptions);
    
    return (
        <div className="competition-page">
            <h2 className="event-title">{event?.pseudoName}</h2>

            <Participants event={event} inscriptions={inscriptions} />                

        </div>
    )
}
