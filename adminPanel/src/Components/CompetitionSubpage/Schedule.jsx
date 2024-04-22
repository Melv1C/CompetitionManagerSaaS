import {React, useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { INSCRIPTIONS_URL, COMPETITIONS_URL } from '../../Gateway';
import { formatRecord } from '../../RecordsHandler';
import { getSingleStatus,getColorClass } from '../../Status';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

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
                    <div key={inscription._id} className={"participants-item "+getColorClass(getSingleStatus(inscription))}>
                        <div className="participants-item-bib">{inscription.bib}</div>
                        <div className="participants-item-athlete">{inscription.athleteName}</div>
                        <div className="participants-item-club">{inscription.club}</div>
                        <div className="participants-item-record">{formatRecord(event, inscription.record)}</div>
                    </div>
                )
            })}
        </div>
    )
}


function EventItem({event, id, user}) {
    const [inscriptions, setInscriptions] = useState([]);

    useEffect(() => {
        axios.get(`${INSCRIPTIONS_URL}/${id}?event=${event.pseudoName}`)
            .then((response) => {
                let inscriptions = response.data.data;
                inscriptions = inscriptions.filter((inscription) => {
                    return inscription.event === event.pseudoName;
                });
                setInscriptions(inscriptions);
                console.log(event, inscriptions);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [event]);


    
    return (
        <div className="event-div">
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
            <div className='center'>
                {!event.closedList ? 
                    <button className="pl-close-btn" onClick={
                        () => {
                            axios.post(`${COMPETITIONS_URL}/${id}/list/${event.id}`,{closedList: true ,adminId : user.uid})
                                .then((response) => {
                                    console.log(response);
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        }
                    }>Cloturer la liste participants</button> 
                : 
                    <button className="pl-open-btn" onClick={
                        () => {
                            axios.post(`${COMPETITIONS_URL}/${id}/list/${event.id}`,{closedList: false ,adminId : user.uid})
                                .then((response) => {
                                    console.log(response);
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        }
                    }>Réouvrir la liste participants</button>
                }
            </div>
        </div>
    )
}




export const Schedule = ({competition, user}) => {
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
    },[]);


    return (
        <div className="schedule">
            <div className='fieldFilterEvent'>
                <input 
                    type='text' 
                    placeholder='Rechercher'
                    onChange={
                        (e) => {
                            const value = e.target.value.toLowerCase().split(' ');
                            const filteredEvents = competition.events.filter((event) => {
                                for (const v of value) {
                                    if (!event.pseudoName.toLowerCase().includes(v)) {
                                        return false;
                                    }
                                }
                                return true;
                            });
                            setEvents(filteredEvents);
                        }
                    }
                />
                <div className='search-icon'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
            </div>
            {events.map(event => {
                return (
                    <EventItem key={event.id} event={event} id={id} user={user}/>
                )
            })}
        </div>
    );
};