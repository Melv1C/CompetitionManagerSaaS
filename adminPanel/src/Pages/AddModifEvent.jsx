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
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState({});
    const [maxParticipants, setMaxParticipants] = useState(100);
    const [time, setTime] = useState("10:00");
    const [cost, setCost] = useState(0);
    const [subEvents, setSubEvents] = useState([]);
    const [pseudoName, setPseudoName] = useState("");
    const [genre, setGenre] = useState("Mixte");
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
            setCategories([]);
            return;
        }
        axios.get(EVENTS_URL + '/' + selectedEvent)
            .then((response) => {
                setCategories(response.data.data.validCat.sort());
            })
            .catch((error) => {
                console.log(error);
            });
        setPseudoName(selectedEvent);
    }, [selectedEvent]);

    useEffect(() => {
        if (categories.length === 0) {
            setFilteredCategories({});
            return;
        }
        let newCategories = {};
        categories.forEach((element) => {
            switch (genre) {
                case "Mixte":
                    newCategories[element] = filteredCategories[element] || false;
                    break;
                case "Femme":
                    if (element.startsWith("W") || element.split(" ")[1] === "F") {
                        newCategories[element] = filteredCategories[element] || false;
                    }
                    break;
                case "Homme":
                    if (element.startsWith("M") || element.split(" ")[1] === "M") {
                        newCategories[element] = filteredCategories[element] || false;
                    }
                    break;
            }
        });
        setFilteredCategories(newCategories);
    }, [genre,categories]);


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

        const selecetedCategories = [];
        Object.keys(filteredCategories).forEach((cat) => {
            if (filteredCategories[cat]) {
                selecetedCategories.push(cat);
            }
        });

        if (selectedEvent === "0") {
            alert("Veuillez sélectionner une épreuves");
            return;
        }
        if (selecetedCategories.length === 0) {
            alert("Veuillez sélectionner au moins une catégorie");
            return;
        }

        const formData = {
            name: selectedEvent,
            pseudoName: pseudoName,
            time: time,
            categories: selecetedCategories,
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
            modifEvent(competition.id, formData);
        }else{
            addEvent(competition.id, formData);
        }
    }

    return (
        <div className='multiStepEvent'>
            <h1>{competition.name}</h1>
            <h2 className='center'>Nouvelle épreuve</h2>
            <GroupingSelect groupings={groupings} setSelectedGrouping={setSelectedGrouping} selectedGrouping={selectedGrouping}/>
            <EventSelect events={filteredEvent} setSelectedEvent={setSelectedEvent} selectedEvent={selectedEvent}/>
            <GlobalInfo pseudoName={pseudoName} setPseudoName={setPseudoName} maxParticipants={maxParticipants} setMaxParticipants={setMaxParticipants} time={time} setTime={setTime} cost={cost} setCost={setCost} competition={competition}/>
            <GenreSelect genre={genre} setGenre={setGenre}/>
            <CategorySelect categories={filteredCategories} setCategories={setFilteredCategories}/>
            <div className='eventStep'>
                <button onClick={handleSubmit} className='greenBtn'>Créé</button>
            </div>
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

function GenreSelect (props) {
    const [show, setShow] = useState(true);
    return (
        <div className={show ? 'displayStep eventStep' : 'hideStep eventStep'} onClick={(event) => {
            if (event.target.type !== 'checkbox') {
                if (event.target.type !== 'select-one') {
                    setShow(!show)
                }
            }
        }}>
            <FontAwesomeIcon icon={faChevronDown} className='displayArrow'/>
            <label htmlFor="genre" className={show ? "margin-bot":""}>
                {show ? "Genre" : "Genre : " + props.genre}
            </label>
            <div className='toHideInfo'>
                <select name="genre" id="genre" value={props.genre} onChange={
                    (e) => {
                        setShow(false);
                        props.setGenre(e.target.value);
                    }
                }>
                    <option value="Mixte">Mixte</option>
                    <option value="Femme">Femme</option>
                    <option value="Homme">Homme</option>
                </select>
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
        if (lenghtCat < 4) {
            setHeight('height100');
        } else if (lenghtCat < 7) {
            setHeight('height150');
        } else {
            setHeight('height200');
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
                {show || lenghtCat === 0 ? "Catégories" :null}
                {!show && lenghtCat !== 0 ? "Catégories : " + Object.keys(props.categories).filter((cat) => props.categories[cat]).join(", ") : null}
            </label>
            <div className={'toHideInfo '+height} >
                {lenghtCat !== 0 && (
                    <div className='btnDiv'>
                        <button className='categoryBtn' onClick={
                            (e) => {
                                e.preventDefault();
                                let newCategories = {...props.categories};
                                Object.keys(newCategories).forEach((cat) => {
                                    newCategories[cat] = true;
                                });
                                props.setCategories(newCategories);
                            }
                        }>Tout</button>
                        <button className='categoryBtn resteBtn' onClick={
                            (e) => {
                                e.preventDefault();
                                let newCategories = {...props.categories};
                                Object.keys(newCategories).forEach((cat) => {
                                    newCategories[cat] = false;
                                });
                                props.setCategories(newCategories);
                            }
                        }>Reset</button>
                    </div>
                )}
                {lenghtCat === 0 ? <p>Selectionner d'abord une épreuve</p> : null}
                <div className='catSelect'>
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
                                checked={props.categories[categorie]}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

