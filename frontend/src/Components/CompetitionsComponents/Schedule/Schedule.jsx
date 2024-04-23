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

import { useSearchParams } from 'react-router-dom';

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
                    <PlacesLeft placesLeft={placesLeft} key={event.name + placesLeft} />
                    <ParticipantsButton nbParticipants={nbParticipants} />
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
        return <div className="schedule-item-places"></div>
    }
}

function CategoryFilter({categories, catFilterValue, setSearchParams}) {

    // save the filter value in the url
    const setCatInUrl = (value) => {
        if (value === "all") {
            // remove the category parameter from the url
            setSearchParams((searchParams) => {
                searchParams.delete("category");
                return searchParams;
            });
        } else {
            setSearchParams((searchParams) => {
                searchParams.set("category", value);
                return searchParams;
            });
        }
    }

    return (
        <div className="schedule-filter">
            <div className="schedule-filter-icon">
                <FontAwesomeIcon icon={faFilter} />
            </div>
            <div className="schedule-filter-select">
                <select value={catFilterValue} onChange={(e) => {setCatInUrl(e.target.value)}}>
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

    const [catFilterValue, setCatFilterValue] = useState("all");

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get("category")) {
            setCatFilterValue(searchParams.get("category"));
        } else {
            setCatFilterValue("all");
        }
    }, [searchParams]);

    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        if (catFilterValue === "all") {
            setFilteredEvents(events);
        } else if (catFilterValue === "MAS M") {
            setFilteredEvents(events.filter(event => {
                return event.categories.some(category => category.includes("M") && category.length === 3);
            }));
        } else if (catFilterValue === "MAS F") {
            setFilteredEvents(events.filter(event => {
                return event.categories.some(category => category.includes("W") && category.length === 3);
            }));
        } else {
            setFilteredEvents(events.filter(event => event.categories.includes(catFilterValue)));
        }
    }, [events, catFilterValue]);

    return (
        <div className="competition-page">
            
            <CategoryFilter categories={categories} catFilterValue={catFilterValue} setSearchParams={setSearchParams} />
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
