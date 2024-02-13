import React, { useEffect,useState } from 'react'
import { INSCRIPTIONS_URL } from '../../Gateway'
import axios from 'axios'

import "./EventsList.css"


export const EventsList = (props) => {
    const [inscriptions, setInscriptions] = useState([]);
    const competitionId = props.competition.id;
    useEffect(() => {
        axios.get(`${INSCRIPTIONS_URL}/${competitionId}`)
        .then(res => {
            setInscriptions(res.data.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [competitionId]);
    return (
        <div>
            {props.competition.events.map((event) => {
                const participants = inscriptions.filter(i => i.event === event.name);
                return (
                    <div key={event.id} className="event">
                        <div className='eventName'>{event.pseudoName}</div>
                        <div className='eventTime'>{event.time}</div>
                        <div className='eventCost'>{event.cost}€</div>
                        <div className='eventMax'>{participants.length}/{event.maxParticipants}</div>
                        <button onClick={
                            () => {
                                console.log("click");
                                props.setEvent(event);
                                props.setShowModal(true);
                            }
                        
                        }>Modifier</button>
                    </div>
                );
            })}
        </div>
    );
}




