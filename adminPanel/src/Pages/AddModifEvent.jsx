import React, { useEffect,useState } from 'react'
import { useParams} from 'react-router-dom';


import { EVENTS_URL } from "../Gateway";
import axios from "axios";

import { getCompetition,addEvent, modifEvent } from '../CompetitionsAPI';
import './Competition.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import './AddModifEvent.css';

export const AddModifEvent = (props) => {
    const { id } = useParams();
    const [events, setEvents] = useState([]);
    const [competition, setCompetition] = useState(null);
    const [groupings, setGrouping] = useState([]);
    const [selectedGrouping, setSelectedGrouping] = useState("0");
    const [filteredEvent, setFilteredEvent] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("0");
    const [categories, setCategories] = useState({});
    const [maxParticipants, setMaxParticipants] = useState(100);
    const [time, setTime] = useState("10:00");
    const [cost, setCost] = useState(0);
    const [subEvents, setSubEvents] = useState([]);
    const [pseudoName, setPseudoName] = useState("");
    useEffect(() => {
        getCompetition(id, setCompetition);
    }, [id]);

    //if the competition is paid, set the cost to 3 by default
    useEffect(() => {
        if (!competition) {
            return;
        }
        if (competition.paid) {
            setCost(3);
        }
    }, [competition]);

    //get all events and the groupings
    useEffect(() => {
        axios.get(EVENTS_URL)
            .then((response) => {
                setEvents(response.data.data);
                let groupings = [];
                response.data.data.forEach((element) => {
                    if (!groupings.includes(element.grouping)) {
                        groupings.push(element.grouping);
                    }
                });
                setGrouping(groupings);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    //when the selectedGrouping change, filter the events
    useEffect(() => {
        if (selectedGrouping === "0") {
            setFilteredEvent([]);
        }else{
            //if the selectedGrouping is "Epreuves multiples", add a subEvent
            if (selectedGrouping === "Epreuves multiples") {
                setSubEvents([
                    {
                        name:"0",
                        time:"10:00",
                        grouping:"0"
                    }
                ]);
            }else{
                setSubEvents([]);
            }
            let filteredEvent = events.filter((element) => {
                return element.grouping === selectedGrouping;
            });
            setFilteredEvent(filteredEvent);
        }
        //reset the selected event
        setSelectedEvent("0");
    }, [selectedGrouping]);

    //get the valid categories for the selected event
    useEffect(() => {
        if (selectedEvent === "0") {
            return;
        }
        axios.get(EVENTS_URL + '/' + selectedEvent)
            .then((response) => {
                const validCat = response.data.data.validCat.sort();
                const obj = {};
                validCat.forEach((element) => {
                    obj[element] = false;
                });
                setCategories(obj);

            })
            .catch((error) => {
                console.log(error);
            });
        setPseudoName(selectedEvent);
    }, [selectedEvent]);

    if (!competition) {
        return <h1>Loading...</h1>;
    }

    //change a time in format hh:mm to the number of minutes
    function getMinTime(time) {
        let minTime = time.split(":");
        return parseInt(minTime[0])*60 + parseInt(minTime[1]);
    }


    function handleSubmit(event) {
        event.preventDefault();
        if (selectedEvent === "0") {
            alert("Veuillez sélectionner une épreuves");
            return;
        }
        if (categories.length === 0) {
            alert("Veuillez sélectionner au moins une catégorie");
            return;
        }

        const formData = {
            name: selectedEvent,
            pseudoName: pseudoName,
            time: time,
            categories: categories,
            maxParticipants: parseInt(maxParticipants),
            cost: parseInt(cost),
            subEvents: subEvents
        };

        if (formData.subEvents.length !== 0) {
            let firstTime = {time:formData.subEvents[0].time, value:getMinTime(formData.subEvents[0].time)};
            for (let i = 1; i < formData.subEvents.length; i++) {
                if (getMinTime(formData.subEvents[i].time) < firstTime.value) {
                    firstTime = {time:formData.subEvents[i].time, value:getMinTime(formData.subEvents[i].time)};
                }
            }
            formData.time = firstTime.time;
        }

        console.log(formData);
        if (props.event) {
            formData.id = props.event.id;
            modifEvent(props.competition.id, formData, props.setCompetition);
        }else{
            addEvent(props.competition.id, formData, props.setCompetition);
        }
        props.setShowModal(false);
    }

    return (
        <div className='multiStepEvent'>
            <h1>{competition.name}</h1>
            <h2 className='center'>Nouvelle épreuve</h2>
            <GroupingSelect groupings={groupings} setSelectedGrouping={setSelectedGrouping} selectedGrouping={selectedGrouping}/>
            <EventSelect events={filteredEvent} setSelectedEvent={setSelectedEvent} selectedEvent={selectedEvent}/>
            <GlobalInfo pseudoName={pseudoName} setPseudoName={setPseudoName} maxParticipants={maxParticipants} setMaxParticipants={setMaxParticipants} time={time} setTime={setTime} cost={cost} setCost={setCost} competition={competition}/>
            <CategorySelect categories={categories} setCategories={setCategories}/>
        </div>  
    );
}

function GroupingSelect (props) {
    const [show, setShow] = useState(true);
    return (
        <div className={show ? 'displayStep eventStep' : 'hideStep eventStep'} onClick={(event) => {
            if (event.target.type !== 'select-one') {
                setShow(!show)
            }
        }}>
            <FontAwesomeIcon icon={faChevronDown} className='displayArrow'/>
            <label htmlFor="grouping" className={show ? "margin-bot":""}>
                {show || props.selectedGrouping === "0" ? "Type de l'épreuve" : "Type de l'épreuve : "+props.selectedGrouping}
            </label>
            <div className='toHideInfo'>
                <select name="grouping" id="grouping" onChange={
                    (e) => {
                        if (e.target.value !== "0") {
                            setShow(false);
                        }
                        props.setSelectedGrouping(e.target.value);
                    }
                } value={props.selectedGrouping}>
                    <option value="0">Selectionner le type de l'épreuve</option>
                    {
                        props.groupings.map((grouping, index) => {
                            return <option key={index} value={grouping}>{grouping}</option>;
                        })
                    }
                </select>
            </div>
        </div>
    );
}

function EventSelect (props) {
    const [show, setShow] = useState(true);
    return (
        <div className={show ? 'displayStep eventStep' : 'hideStep eventStep'} onClick={(event) => {
            if (event.target.type !== 'select-one') {
                setShow(!show)
            }
        }}>
            <FontAwesomeIcon icon={faChevronDown} className='displayArrow'/>
            <label htmlFor="event" className={show ? "margin-bot":""}>
                {show || props.selectedEvent === "0" ? "Epreuve" : "Epreuve : "+props.selectedEvent}
            </label>
            <div className='toHideInfo'>
                <select name="event" id="event" onChange={
                    (e) => {
                        if (e.target.value !== "0") {
                            setShow(false);
                        }
                        props.setSelectedEvent(e.target.value);
                    }
                } value={props.selectedEvent}>
                    <option value="0">Selectionner une épreuve</option>
                    {
                        props.events.map((event, index) => {
                            return <option key={index} value={event.name}>{event.name}</option>;
                        })
                    }
                </select>
            </div>
        </div>
    );
}

function GlobalInfo (props) {
    const [show, setShow] = useState(true);
    return (
        <div className={show ? 'displayStep eventStep' : 'hideStep eventStep'} onClick={(event) => {
            if (!['text', 'number', 'time'].includes(event.target.type)) {
                setShow(!show)
            }
        }}>
            <FontAwesomeIcon icon={faChevronDown} className='displayArrow'/>
            <label htmlFor="pseudoName" className={show ? "margin-bot":""}>
                {show || props.pseudoName === "" || props.maxParticipants === "" || props.cost === "" ? "Info" : "Info : "+props.pseudoName+" / "+props.time+" / "+props.maxParticipants+"places" + (props.competition.paid ? " / "+props.cost+"€" : "")}
            </label>
            <div className='toHideInfo globalInfo'>
                <label htmlFor="pseudoName">Nom : </label>
                <input type="text" id="pseudoName" name="pseudoName" value={props.pseudoName} onChange={(e) => props.setPseudoName(e.target.value)}/>

                <label htmlFor="maxParticipants">Nb de place : </label>
                <input type="number" id="maxParticipants" name="maxParticipants" value={props.maxParticipants} onChange={(e) => props.setMaxParticipants(e.target.value)}/>

                <label htmlFor="time">Heure de début : </label>
                <input type="time" id="time" name="time" value={props.time} onChange={(e) => props.setTime(e.target.value)}/>
                { props.competition.paid && (
                    <>
                        <label htmlFor="cost">Prix : </label>
                        <input type="number" id="cost" name="cost" value={props.cost} onChange={(e) => props.setCost(e.target.value)}/>
                    </>
                )}
            </div>
        </div>
    );
}

function CategorySelect (props) {
    const [show, setShow] = useState(true);
    const [height, setHeight] = useState('height50');
    const [lenghtCat, setLenghtCat] = useState(0);

    useEffect(() => {
        setLenghtCat(Object.keys(props.categories).length);
    }, [props.categories]);


    useEffect(() => {
        if (lenghtCat === 0) {
            setHeight('height50');
        } else if (lenghtCat < 7) {
            setHeight('height100');
        } else if (lenghtCat < 13) {
            setHeight('height150');
        } else if (lenghtCat < 19) {
            setHeight('height200');
        } else if (lenghtCat < 25) {
            setHeight('height250');
        }
    }, [lenghtCat]);


    return (
        <div className={show ? 'displayStep eventStep' : 'hideStep eventStep'} onClick={(event) => {
            if (event.target.type !== 'checkbox') {
                setShow(!show)
            }
        }}>
            <FontAwesomeIcon icon={faChevronDown} className='displayArrow'/>
            <label htmlFor="categories" className={show ? "margin-bot":""}>
                {show ? "Catégories" :null}
                {!show && lenghtCat !== 0 ? "Catégories : " + Object.keys(props.categories).filter((cat) => props.categories[cat]).join(", ") : null}
            </label>
            <div className={'toHideInfo catSelect neeHeight '+height} >
                {lenghtCat === 0 ? <p>Selectionner d'abord une épreuve</p> : null}
                {Object.keys(props.categories).map((categorie, index) => (
                    <div key={index} className='category'> 
                        <label htmlFor={categorie}>{categorie}</label>
                        <input 
                            type="checkbox" 
                            id={categorie} 
                            name={categorie} 
                            value={categorie} 
                            onChange={(e) => {

                                const newCategories = {...props.categories};
                                newCategories[e.target.value] = e.target.checked;
                                props.setCategories(newCategories);
                            }} 
                            checked={props.categories[categorie].selected}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}