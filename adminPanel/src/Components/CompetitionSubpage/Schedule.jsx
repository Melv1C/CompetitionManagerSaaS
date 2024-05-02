import {React, useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { INSCRIPTIONS_URL, COMPETITIONS_URL, INSCRIPTIONS_ADMIN_URL } from '../../Gateway';
import { formatRecord } from '../../RecordsHandler';
import { getSingleStatus,getColorClass } from '../../Status';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTrash, faPen, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Popup } from '../Popup/Popup';
import { DeleteInscrAlert } from '../AlertComponent/DeleteInscrAlert';

import './styles/Schedule.css';

function sortInscriptions(inscriptions) {
    return inscriptions.sort((a, b) => {
        const AName = a.athleteName.toLowerCase();
        const BName = b.athleteName.toLowerCase();
        if (AName < BName) {
            return -1;
        }
        if (AName > BName) {
            return 1;
        }
        return 0;
    });
}

function Participants({event, inscriptions, id, user, setInscriptions}){
    const navigate = useNavigate();
    const [showModalDelete, setShowModalDelete] = useState(false);
    return (
        <div className="participants">
            {inscriptions.map(inscription => {
                return (
                    <div key={inscription._id} className={"participants-item "+getColorClass(getSingleStatus(inscription))}>
                        <div className="participants-item-bib">{inscription.bib}</div>
                        <div className="participants-item-athlete">{inscription.athleteName}</div>
                        <div className="participants-item-club">{inscription.club}</div>
                        <div className="participants-item-record">{formatRecord(event, inscription.record)}</div>
                        <div className="participants-item-edit">
                            <FontAwesomeIcon icon={faPenToSquare} onClick={
                                () => {
                                    //competition/fc94a29047/inscriptions?step=2&athleteId=11572237845&isInscribed=true
                                    navigate(`/competition/${id}/inscriptions?step=2&athleteId=${inscription.athleteId}&isInscribed=true`);
                                }
                            } />
                        </div>
                        <div className="participants-item-del red">
                            <FontAwesomeIcon icon={faTrash} onClick={
                                () => {
                                    setShowModalDelete(true);
                                }
                            }/>
                        </div>
                    </div>
                )
            })}
            {showModalDelete ? <Popup onClose={()=>{setShowModalDelete(false)}}><DeleteInscrAlert id={id} setShowModalDelete={setShowModalDelete} user={user} inscription={inscriptions[0]} inscriptions={inscriptions} setInscriptions={setInscriptions}/></Popup> : null}
        </div>
    )
}


function EventItem({event, id, user, setEvents}) {
    const [inscriptions, setInscriptions] = useState([]);

    useEffect(() => {
        axios.get(`${INSCRIPTIONS_URL}/${id}?event=${event.pseudoName}`)
            .then(async (response) => {
                let inscriptions = response.data.data;
                inscriptions = inscriptions.filter((inscription) => {
                    return inscription.event === event.pseudoName;
                });
                setInscriptions(sortInscriptions(inscriptions));
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
            <Participants event={event} inscriptions={inscriptions} id={id} user={user} setInscriptions={setInscriptions}/>
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
                            setEvents((events) => {
                                return events.map((e) => {
                                    if (e.id === event.id) {
                                        e.closedList = true;
                                    }
                                    return e;
                                });
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
                            setEvents((events) => {
                                return events.map((e) => {
                                    if (e.id === event.id) {
                                        e.closedList = false;
                                    }
                                    return e;
                                });
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
                    <EventItem key={event.id} event={event} id={id} user={user} setEvents={setEvents}/>
                )
            })}
        </div>
    );
};