import React , { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import axios from 'axios';
import { INSCRIPTIONS_URL, RESULTS_URL } from '../../../Gateway';
import socket from '../../../socket';

import { Participants } from './Participants/Participants';
import { Results } from './Results/Results';

import { Link } from 'react-router-dom';

import Switch from '@mui/material/Switch';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi } from '@fortawesome/free-solid-svg-icons';

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

    const [results, setResults] = useState([]);
    const [resultsSwitch, setResultsSwitch] = useState(false);

    useEffect(() => {
        axios.get(`${RESULTS_URL}/${competition.name}/${eventName}`)
            .then((response) => {
                console.log(response.data.data);
                setResults(prevResults => {
                    return response.data.data;
                });
            })
            .catch((error) => {
                console.log(error);
            });

    }, [competition.name, eventName]);

    
    useEffect(() => {
        setResultsSwitch(results.length > 0);
    }, [results]);

    useEffect(() => {
        
        socket.emit('joinEvent', eventName);

        socket.on('Result', (type, data) => {
            setResults(prevResults => {
                let newResults = [...prevResults];
                if (type === "POST") {
                    // if the result is already in the list, skip it
                    const index = newResults.findIndex((r) => r.id === data.id);
                    if (index === -1) {
                        newResults.push(data);
                    }
                } else if (type === "PUT") {
                    const index = newResults.findIndex((r) => r.id === data.id);
                    newResults[index] = data;
                } else if (type === "DELETE") {
                    newResults = newResults.filter((r) => r.id !== data.id);
                }
                return newResults;
            });
        });

        socket.on('AllResult', (event_name, data) => {
            setResults(prevResults => {
                let newResults = [...prevResults];
                newResults = newResults.filter((r) => r.event_name !== event_name);
                newResults.push(...data);
                return newResults;
            });
        });
    }, [eventName]);
    
    return (
        <>
            <LiveConnection />  
        
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
                    <div className='event-header-info'>
                        <div className='time'>
                            {event?.time}
                        </div>
                        <div className='name'>
                            {event?.pseudoName}
                        </div>
                        <div className='nb-participants'>
                            {event?.maxParticipants ? `${inscriptions.length} / ${event?.maxParticipants} athlètes` : null}
                        </div>
                    </div>
                    <div className='event-header-switch'>
                        <div className={`participants-switch ${!resultsSwitch ? 'selected' : ''}`} onClick={() => setResultsSwitch(false)}>
                            Participants
                        </div>
                        <div className={`results-switch ${resultsSwitch ? 'selected' : ''}`} onClick={() => setResultsSwitch(true)}>
                            Résultats
                        </div>
                    </div>
                </div>

                {resultsSwitch ?
                    <Results results={results.filter((result) => {
                        return result.event_name === eventName;
                    })} />
                    : <Participants event={event} inscriptions={inscriptions} />
                }    

            </div>
        </>
    )
}


function LiveConnection() {
    const [live, setLive] = useState(socket.connected);

    useEffect(() => {
        socket.on('connect', () => {
            setLive(true);
        }).on('disconnect', () => {
            setLive(false);
        });
    }, []);

    return (
        
        <div className={`live-connection ${live ? 'green' : 'red'}`}>
            <FontAwesomeIcon icon={faWifi} />
            <div>Live Results</div>
        </div>
    )
}
