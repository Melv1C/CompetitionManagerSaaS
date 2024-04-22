import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import axios from 'axios'
import { INSCRIPTIONS_URL } from '../../../Gateway'
import './Schedule.css'
import './Filter.css'

import { formatRecord } from '../../../RecordsHandler'
import { SortCategory } from '../../../SortCategory'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

function ScheduleItem({event, inscriptions, competition}) {
    const [placesLeft, setPlacesLeft] = useState(event.maxParticipants - inscriptions.length);
    const [nbParticipants, setNbParticipants] = useState(inscriptions.length);

    useEffect(() => {
        setPlacesLeft(event.maxParticipants - inscriptions.length);
    }, [inscriptions, event.maxParticipants]);

    useEffect(() => {
        setNbParticipants(inscriptions.length);
    }, [inscriptions]);

    return (
        <div className="schedule-item">
            <Link to={`/competitions/${competition.id}/${event.pseudoName}`} key={event.pseudoName}>
                <div className="schedule-item-info">
                    <div className="schedule-item-time">{event.time}</div>
                    <div className="schedule-item-name">{event.pseudoName}</div>
                    {/*<PlacesLeft placesLeft={placesLeft} key={event.name + placesLeft} />*/}
                    <ParticipantsButton nbParticipants={nbParticipants} />
                    {/*<div className="schedule-item-icon">
                        <FontAwesomeIcon icon={faUsers} /> Participants 
                    </div>*/}
                </div>
            </Link>
        </div>
    )
}

function ParticipantsButton({nbParticipants}) {
    if (nbParticipants === 0) {
        return  <div className="schedule-item-icon disabled">
                    Pas de participants
                </div>
    } else if (nbParticipants === 1) {
        return  <div className="schedule-item-icon">
                    <FontAwesomeIcon icon={faUsers} /> {nbParticipants} participant
                </div>
    } else {
        return  <div className="schedule-item-icon">
                    <FontAwesomeIcon icon={faUsers} /> {nbParticipants} participants
                </div>
    }
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

function CategoryFilter({categories, filterValue, setFilterValue}) {

    return (
        <div className="schedule-filter">
            <div className="schedule-filter-icon">
                <FontAwesomeIcon icon={faFilter} />
            </div>
            <div className="schedule-filter-select">
                <select value={filterValue} onChange={(e) => {setFilterValue(e.target.value)}} >
                    <option value="all">Toutes les catégories</option>
                    {categories.map(category => {
                        return <option key={category} value={category}>{category}</option>
                    })}
                </select>
            </div>
        </div>
    )
}


export const Schedule = ({competition}) => {

    const [inscriptions, setInscriptions] = useState([]);
    useEffect(() => {
        axios.get(`${INSCRIPTIONS_URL}/${competition.id}`)
            .then((response) => {
                setInscriptions(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [competition.id]);

    const [events, setEvents] = useState([]);
    
    useEffect(() => {
        console.log(competition.events);
        let events = [];
        for (let event of competition.events) {
            events.push(event);
            for (let subEvent of event.subEvents) {
                events.push({...subEvent, 
                    pseudoName: `${event.pseudoName} - ${subEvent.name}`, 
                    superEvent: event.name, 
                    maxParticipants: event.maxParticipants, 
                    categories: event.categories
                });
            }
        }
        setEvents(events);
    }, [competition.events]);

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        let categories = [];
        for (let event of events) {
            if (event.categories === undefined) {
                event.categories = [];
            }
            for (let category of event.categories) {
                let cat;
                if (category.length === 3) {
                    if (category.includes("M")) {
                        cat =  "MAS M";
                    } else if (category.includes("W")) {
                        cat =  "MAS F";
                    }
                } else {
                    cat =  category;
                }
                if (!categories.includes(cat)) {
                    categories.push(cat);
                }
            }
        }
        setCategories(SortCategory(categories));
    }, [events]);

    const [filterValue, setFilterValue] = useState("all");

    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        if (filterValue === "all") {
            setFilteredEvents(events);
        } else if (filterValue === "MAS M") {
            setFilteredEvents(events.filter(event => {
                return event.categories.some(category => category.includes("M") && category.length === 3);
            }));
        } else if (filterValue === "MAS F") {
            setFilteredEvents(events.filter(event => {
                return event.categories.some(category => category.includes("W") && category.length === 3);
            }));
        } else {
            setFilteredEvents(events.filter(event => event.categories.includes(filterValue)));
        }
    }, [events, filterValue]);

    return (
        <div className="competition-page">
            
            <CategoryFilter categories={categories} filterValue={filterValue} setFilterValue={setFilterValue} />
            <div className="schedule">
                
                {filteredEvents.sort((a, b) => {
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
