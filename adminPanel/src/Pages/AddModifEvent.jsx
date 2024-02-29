import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';


import { EVENTS_URL, COMPETITIONS_URL } from "../Gateway";
import axios from "axios";

import { getCompetition, addEvent, modifEvent } from '../CompetitionsAPI';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faTrash } from '@fortawesome/free-solid-svg-icons'

import './styles/AddModifEvent.css';

export const AddModifEvent = (props) => {
    const { id, eventId } = useParams();
    const navigate = useNavigate();
    const [exisingEvent, setExistingEvent] = useState(false);
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
    const [showStep, setShowStep] = useState({
        "grouping":true,
        "event":false,
        "globalInfo":false,
        "genre":false,
        "category":false,
        "subEvent":false
    });
    const listStep = ["grouping", "event", "globalInfo", "genre", "category", "subEvent"];

    function changeStep(step) {
        const next = listStep[listStep.indexOf(step)+1];
        setShowStep({...showStep, [step]:!showStep[step], [next]:showStep[step]});
    }

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

    useEffect(() => {
        if (eventId && events.length !== 0) {
            axios.get(COMPETITIONS_URL + '/' + id + '/events/' + eventId).then((response) => {
                const data = response.data.data;
                setExistingEvent(response.data.data);
                const eventInfo = events.find((element) => {
                    return element.name === data.name;
                });
                setSubEvents(data.subEvents);
                setSelectedGrouping(eventInfo.grouping);
                setMaxParticipants(data.maxParticipants);
                setTime(data.time);
                setCost(data.cost);
                setSelectedEvent(data.name);
                setPseudoName(data.pseudoName);
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [eventId, events]);

    //when the selectedGrouping change, filter the events
    useEffect(() => {
        if (selectedGrouping === "0") {
            setFilteredEvent([]);
        }else{
            //if the selectedGrouping is "Epreuves multiples", add a subEvent
            if (selectedGrouping === "Epreuves multiples" && subEvents.length === 0) {
                setSubEvents([
                    {
                        name:"0",
                        time:"10:00",
                        grouping:"0"
                    }
                ]);
            }else if (selectedGrouping !== "Epreuves multiples") {
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
        if (!eventId || !exisingEvent || exisingEvent.name !== selectedEvent) {
            setPseudoName(selectedEvent);
        }
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
                    if (eventId && exisingEvent && exisingEvent.name === selectedEvent) {
                        newCategories[element] = exisingEvent.categories.includes(element);
                    }else{

                        newCategories[element] = filteredCategories[element] || false;
                    }  
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


    async function handleSubmit(event) {
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
            subEvents: subEvents,
            adminId: props.user.uid
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

        if (eventId) {
            formData.id = eventId;
            const succes = await modifEvent(competition.id, formData);
            if (succes){
                navigate(`/competitions/${competition.id}`);
            }else{
                alert("Une erreur est survenue");
            
            };
        }else{
            const succes = await addEvent(competition.id, formData);
            if (succes){
                navigate(`/competitions/${competition.id}`);
            }else{
                alert("Une erreur est survenue");
            }
        }
    }

    return (
        <div className='multiStepEvent'>
            <h1>{competition.name}</h1>
            <h2 className='center'>Nouvelle épreuve</h2>
            <GroupingSelect groupings={groupings} setSelectedGrouping={setSelectedGrouping} selectedGrouping={selectedGrouping} showStep={showStep} setShowStep={setShowStep} changeStep={changeStep}/>
            <EventSelect events={filteredEvent} setSelectedEvent={setSelectedEvent} selectedEvent={selectedEvent} showStep={showStep} setShowStep={setShowStep} changeStep={changeStep}/>
            <GlobalInfo pseudoName={pseudoName} setPseudoName={setPseudoName} maxParticipants={maxParticipants} setMaxParticipants={setMaxParticipants} time={time} setTime={setTime} cost={cost} setCost={setCost} competition={competition} showStep={showStep} changeStep={changeStep}/>
            <GenreSelect genre={genre} setGenre={setGenre} showStep={showStep} setShowStep={setShowStep} changeStep={changeStep}/>
            <CategorySelect categories={filteredCategories} setCategories={setFilteredCategories} showStep={showStep} setShowStep={setShowStep} changeStep={changeStep}/>
            {selectedGrouping === "Epreuves multiples" ? <SubEventsInfo events={events} subEvents={subEvents} setSubEvents={setSubEvents} groupings={groupings} showStep={showStep} setShowStep={setShowStep}/> : null}
            <div className='eventStep'>
                <button onClick={handleSubmit} className={eventId?"modifBtn":"greenBtn"}>{eventId?"Modifier":"Créé"}</button>
            </div>
        </div>  
    );
}

function GroupingSelect (props) {
    let valid = props.selectedGrouping !== "0";
    let className = "eventStep ";
    className += props.showStep.grouping ? 'displayStep ' : 'hideStep ';
    if (!props.showStep.grouping){
        className += valid ? "validStep" : "invalidStep";
    }
    return (
        <div className={className} onClick={(event) => {
            if (event.target.type !== 'select-one') {
                props.setShowStep({...props.showStep, "grouping":!props.showStep.grouping});
            }
        }}>
            <FontAwesomeIcon icon={faChevronDown} className='displayArrow'/>
            <label htmlFor="grouping" className={props.showStep.grouping ? "margin-bot":""}>
                {props.showStep.grouping || props.selectedGrouping === "0" ? "Type de l'épreuve" : "Type de l'épreuve : "+props.selectedGrouping}
            </label>
            <div className='toHideInfo'>
                <select name="grouping" id="grouping" onChange={
                    (e) => {
                        if (e.target.value !== "0") {
                            props.changeStep("grouping");
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
    let valid = props.selectedEvent !== "0";
    let className = "eventStep ";
    className += props.showStep.event ? 'displayStep ' : 'hideStep ';
    if (!props.showStep.event){
        className += valid ? "validStep" : "invalidStep";
    }
    return (
        <div className={className} onClick={(event) => {
            if (event.target.type !== 'select-one') {
                props.setShowStep({...props.showStep, "event":!props.showStep.event});
            }
        }}>
            <FontAwesomeIcon icon={faChevronDown} className='displayArrow'/>
            <label htmlFor="event" className={props.showStep.event ? "margin-bot":""}>
                {props.showStep.event || props.selectedEvent === "0" ? "Epreuve" : "Epreuve : "+props.selectedEvent}
            </label>
            <div className='toHideInfo'>
                <select name="event" id="event" onChange={
                    (e) => {
                        if (e.target.value !== "0") {
                            props.changeStep("event");
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
    let valid = props.pseudoName !== "" && props.maxParticipants !== "" && props.cost !== "" && props.time !== "";
    let className = "eventStep ";
    className += props.showStep.globalInfo ? 'displayStep ' : 'hideStep ';
    if (!props.showStep.globalInfo){
        className += valid ? "validStep" : "invalidStep";
    }
    return (
        <div className={className} onClick={(event) => {
            if (!['text', 'number', 'time'].includes(event.target.type)) {
                props.changeStep("globalInfo");
            }
        }}>
            <FontAwesomeIcon icon={faChevronDown} className='displayArrow'/>
            <label htmlFor="pseudoName" className={props.showStep.globalInfo ? "margin-bot":""}>
                {props.showStep.globalInfo || props.pseudoName === "" || props.maxParticipants === "" || props.cost === "" ? "Info" : "Info : "+props.pseudoName+" / "+props.time+" / "+props.maxParticipants+"places" + (props.competition.paid ? " / "+props.cost+"€" : "")}
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
    return (
        <div className={props.showStep.genre ? 'displayStep eventStep' : 'hideStep eventStep validStep'} onClick={(event) => {
            if (event.target.type !== 'checkbox') {
                if (event.target.type !== 'select-one') {
                    props.changeStep("genre");
                }
            }
        }}>
            <FontAwesomeIcon icon={faChevronDown} className='displayArrow'/>
            <label htmlFor="genre" className={props.showStep.genre ? "margin-bot":""}>
                {props.showStep.genre ? "Genre" : "Genre : " + props.genre}
            </label>
            <div className='toHideInfo'>
                <select name="genre" id="genre" value={props.genre} onInput={
                    (e) => {
                        console.log("change")
                    }
                } onChange={
                    (e) => {
                        console.log(e.target.value);
                        props.changeStep("genre");
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

    let valid = false;
    Object.keys(props.categories).forEach((cat) => {
        if (props.categories[cat]) {
            valid = true;
        }
    });
    let className = "eventStep ";
    className += props.showStep.category ? 'displayStep ' : 'hideStep ';
    if (!props.showStep.category){
        className += valid ? "validStep" : "invalidStep";
    }

    return (
        <div className={className} onClick={(event) => {
            if (event.target.type !== 'checkbox' && event.target.type !== 'submit') {
                props.changeStep("category");
            }
        }}>
            <FontAwesomeIcon icon={faChevronDown} className='displayArrow'/>
            <label htmlFor="categories" className={props.showStep.category ? "margin-bot":""}>
                {props.showStep.category || lenghtCat === 0 ? "Catégories" :null}
                {!props.showStep.category && lenghtCat !== 0 ? "Catégories : " + Object.keys(props.categories).filter((cat) => props.categories[cat]).join(", ") : null}
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

function SubEventsInfo (props) {
    const height = props.subEvents.length*35+45;
    let valid = true;
    for (let subEvent of props.subEvents) {
        if (subEvent.grouping === "0" || subEvent.name === "0") {
            valid = false;
            break;
        }
    }
    let className = "eventStep "
    className += props.showStep.subEvent ? 'displayStep ' : 'hideStep ';
    if (!props.showStep.subEvent){
        className += valid ? "validStep" : "invalidStep";
    }
    return (
        <div className={className} onClick={(event) => {
            if (event.target.type !== 'select-one' && event.target.type !== 'time' && event.target.type !== 'submit' && typeof(event.target.className) !== 'object') {
                props.setShowStep({...props.showStep, "subEvent":!props.showStep.subEvent});
            }
        }}>
            <FontAwesomeIcon icon={faChevronDown} className='displayArrow'/>
            <label htmlFor="subEvent" className={props.showStep.subEvent ? "margin-bot":""}>
                {props.showStep.subEvent ? "Sous-épreuve" : "Sous-épreuve : "+ props.subEvents.length+" sous-épreuves"}
            </label>
            <div className='toHideInfo' style={
                !props.showStep.subEvent ? {} : {height:height+"px"}
            }>
                {props.subEvents.map((subEvent, index) => (
                    <SubEvent 
                        key={index} 
                        index={index}
                        groupings={props.groupings} 
                        events={props.events} 
                        subEvent={subEvent} 
                        setSubEvents={props.setSubEvents}
                        subEvents={props.subEvents}
                    />
                ))}
                <button className='addSubEventBtn' onClick={
                    (e) => {
                        props.setSubEvents([...props.subEvents, {name:"0",time:"10:00",grouping:"0"}]);
                    }
                }>Ajouter une sous-épreuve</button>
            </div>
        </div>
    );
}

function SubEvent (props) {
    const [selectedGrouping, setSelectedGrouping] = useState(props.subEvent.grouping);
    const [filteredEvent, setFilteredEvent] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(props.subEvent.name);
    const [time, setTime] = useState("10:00");
    useEffect(() => {
        setSelectedGrouping(props.subEvent.grouping);
        setTime(props.subEvent.time);
        setSelectedEvent(props.subEvent.name);
    }, [props.subEvent]);

    useEffect(() => {
        if (selectedGrouping === "0") {
            setFilteredEvent([]);
        }else{
            let filteredEvent = props.events.filter((element) => {
                return element.grouping === selectedGrouping;
            });
            setFilteredEvent(filteredEvent);
        }
        setSelectedEvent(props.subEvent.name);
    }, [selectedGrouping]);

    useEffect(() => {
        props.setSubEvents(subEvents => {
            let newSubEvents = [...subEvents];
            newSubEvents[props.index].name = selectedEvent;
            newSubEvents[props.index].grouping = selectedGrouping;
            newSubEvents[props.index].time = time;
            return newSubEvents;
        });
    }, [selectedEvent, selectedGrouping, time]);

    return (
        <div className='subEvent'>
            <select className='subEventSelect' name="grouping" id="grouping" onChange={
                (e) => {
                    setSelectedGrouping(e.target.value);
                }
            } value={selectedGrouping}>
                <option value="0">Selectionner le type de l'épreuve</option>
                {
                    props.groupings.map((grouping, index) => {
                        return <option key={index} value={grouping}>{grouping}</option>;
                    })
                }
            </select>
            <select className='subEventSelect' name="event" id="event" onChange={
                (e) => {
                    setSelectedEvent(e.target.value);
                }
            } value={selectedEvent}>
                <option value="0">Selectionner une épreuve</option>
                {
                    filteredEvent.map((event, index) => {
                        return <option key={index} value={event.name}>{event.name}</option>;
                    })
                }
            </select>
            <input type="time" id="time" name="time" value={time} onChange={(e) => setTime(e.target.value)}/>
            <FontAwesomeIcon icon={faTrash} className="delTrash" onClick={
                (e) => {
                    props.setSubEvents(subEvents => {
                        let newSubEvents = [...subEvents];
                        newSubEvents.splice(props.index, 1);
                        return newSubEvents;
                    });
                }
            }/>
        </div>
    );
}


