import {React, useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { INSCRIPTIONS_URL, COMPETITIONS_URL } from '../../Gateway';
import { formatRecord } from '../../RecordsHandler';

import './styles/Schedule.css';

function Participants({event, inscriptions}){
    return (
        <div className="participants">
            {inscriptions.sort((a, b) => {
                if (event.type === 'time') {
                    return a.record - b.record;
                } else {
                    return b.record - a.record;
                }
            }).map(inscription => {
                return (
                    <div key={inscription._id} className="participants-item">
                        <div className="participants-item-bib">{inscription.bib}</div>
                        <div className="participants-item-athlete">{inscription.athleteName}</div>
                        <div className="participants-item-club">{inscription.club}</div>
                        <div className="participants-item-record">{formatRecord(event.type, inscription.record)}</div>
                    </div>
                )
            })}
        </div>
    )
}


function EventItem({event, id}) {
    const [inscriptions, setInscriptions] = useState([]);

    useEffect(() => {
        axios.get(`${INSCRIPTIONS_URL}/${id}?event=${event.pseudoName}`)
            .then((response) => {

                let inscriptions = response.data.data;

                inscriptions = inscriptions.filter((inscription) => {
                    return inscription.event === event.pseudoName;
                });//??????????

                setInscriptions(inscriptions);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [event]);


    
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




export const Schedule = ({competition}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    useEffect(() => {
        axios.get(`${COMPETITIONS_URL}/${id}/events`)
            .then((response) => {
                setEvents(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    return (
        <>
            <h1>Horaire</h1>
            {events.map(event => {
                console.log(event)
                return (
                    <EventItem key={event.id} event={event} id={id} />
                )
            })}
        </>
    );
};