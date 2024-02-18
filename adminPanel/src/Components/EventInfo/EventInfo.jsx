import React, { useEffect, useState } from "react";

import axios from "axios";

import { EVENTS_URL } from "../../Gateway";

import "./EventInfo.css";
import { SubEventInfo } from "./SubEventInfo/SubEventInfo";

import { addEvent, modifEvent } from "../../CompetitionsAPI";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'



export const EventInfo = (props) => {
    const [load, setLoad] = useState(false);
    const [event, setEvent] = useState([]);
    const [groupings, setGrouping] = useState([]);
    const [selectedGrouping, setSelectedGrouping] = useState("0");
    const [filteredEvent, setFilteredEvent] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("0");
    const [time, setTime] = useState("10:00");
    const [cost, setCost] = useState(0);
    const [maxParticipants, setMaxParticipants] = useState(100);
    const [validCat, setValidCat] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pseudo, setPseudo] = useState(null);
    const [subEvents, setSubEvents] = useState([]);
    useEffect(() => {
        axios.get(EVENTS_URL)
            .then((response) => {
                setEvent(response.data.data);
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
        if (selectedGrouping === "0") {
            setFilteredEvent([]);
        }else{
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
            let filteredEvent = event.filter((element) => {
                return element.grouping === selectedGrouping;
            });
            setFilteredEvent(filteredEvent);
        }
    }, [selectedGrouping]);

    useEffect(() => {
        if (props.competition.paid) {
            setCost(3);
        }
    }, []);

    useEffect(() => {
        if (selectedEvent === "0") {
            return;
        }
        axios.get(EVENTS_URL + '/' + selectedEvent)
            .then((response) => {
                setValidCat(response.data.data.validCat.sort());

            })
            .catch((error) => {
                console.log(error);
            });
    }, [selectedEvent]);

    useEffect(() => {
        setSelectedEvent("0");
    }, [selectedGrouping]);

    useEffect(() => {
        setCategories([]);
    }, [selectedEvent]);

    useEffect(() => {
        if (props.event && groupings.length != [] && load == false) {
            setSelectedGrouping(event.find((element) => {
                return element.name === props.event.name;
            }).grouping);
            setPseudo(props.event.pseudoName);
            setTime(props.event.time);
            setCost(props.event.cost);
            setMaxParticipants(props.event.maxParticipants);
            setSelectedEvent(props.event.name);
            setLoad(true);
        }
    }, [groupings]);

    useEffect(() => {
        if (props.event) {
            setCategories(props.event.categories);
            setLoad(false);
        }
    }, [load]);

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
            pseudoName: pseudo,
            time: time,
            categories: categories,
            maxParticipants: parseInt(maxParticipants),
            cost: parseInt(cost),
            subEvents: subEvents
        };

        if (formData.subEvents.length != 0) {
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
        <>
            <div className="scrollable">
                <form onSubmit={handleSubmit} className="addEventForm">
                    {props.event ? <h1>Modifier une épreuve</h1> : <h1>Ajouter une épreuves</h1>}
                    <select name="grouping" id="grouping" onChange={
                        (e) => {
                            setSelectedGrouping(e.target.value);
                        }
                    } value={selectedGrouping}>
                        <option value="0">Type d'épreuve</option>
                        {
                            groupings.map((grouping, index) => {
                                return <option key={index} value={grouping}>{grouping}</option>;
                            })
                        }
                    </select>
                    <select name="event" id="event" onChange={
                        (e) => {
                            setSelectedEvent(e.target.value);
                        }
                    
                    } value={selectedEvent}>
                        <option value="0">Epreuve</option>
                        {
                            filteredEvent.map((event, index) => {
                                return <option key={index} value={event.name}>{event.name}</option>;
                            })
                        }
                    </select>
                    {selectedGrouping === "Epreuves multiples" ? null:<input type="time" name="time" id="time" value={time} onChange={
                        (e) => {
                            setTime(e.target.value);
                        }
                    }/>}
                    <div>
                        <label htmlFor="pseudo">Nom : </label>
                        <input type="text" name="pseudo" id="pseudo" onChange={
                            (e) => {
                                setPseudo(e.target.value);
                            }
                        } defaultValue={props.event?.pseudoName}/>
                    </div>
                    <div>
                        <label htmlFor="cost">Coût : </label>
                        <Cost competition={props.competition} setCost={setCost} cost={cost} event={props?.event}/>
                        <label htmlFor="cost">€</label>
                    </div>
                    <div>
                        <label htmlFor="maxParticipants">Nombre max de participants : </label>
                        <input type="number" name="maxParticipants" id="maxParticipants" defaultValue={props.event?.maxParticipants ? props.event.maxParticipants : 100} min={1} max={1000} onChange={
                            (e) => {
                                setMaxParticipants(e.target.value);
                            }
                        } />
                    </div>
                    <CategoriesSelect validCat={validCat} categories={categories} setCategories={setCategories}/>
                    {selectedGrouping === "Epreuves multiples" ?<SubEventInfo groupings={groupings} events={event} subEvents={subEvents} setSubEvents={setSubEvents} />:null}
                    {props.event ? <input type="submit" value="Modifier" /> : <input type="submit" value="Ajouter" />}
                </form>
            </div>
        </>
    )
};

function Cost (props) {
    if (props.competition.paid) {
        return <input type="number" name="cost" id="cost" value={props.event?.cost ? props.event.cost : props.cost} min={0} max={500} onChange={
            (e) => {
                props.setCost(e.target.value);
            }
        }/>;
    }else{
        return <input type="number" name="cost" id="cost" value="0" disabled/>;
    }
}

function CategoriesSelect ({validCat, categories, setCategories}) {
    return (
        <div>
            <label htmlFor="categories">Catégories : </label>
            <select name="categories" id="categories" onChange={
                (e) => {
                    if (e.target.value === "0") {
                        return;
                    }
                    if (!categories.includes(e.target.value)) {
                        setCategories([...categories, e.target.value]);
                    }
                    e.target.value = "0";
                }
            }>
                <option value="0">Ajouter une catégories</option>
                {
                    validCat?.map((category, index) => {
                        return <option key={index} value={category}>{category}</option>;
                    })
                }
            </select>
            <CategoriesList categories={categories} setCategories={setCategories} />
        </div>
    );
}

function CategoriesList ({categories, setCategories}) {
    return (
        <div className="categoriesList">
            {
                categories?.map((category, index) => {
                    return (
                        <Category key={index} category={category} categories={categories} setCategories={setCategories}/>
                    );
                })
            }
        </div>
    );
}

function Category ({category, categories, setCategories}) {
    
    return (
        <div className="category">
            {category}
            <FontAwesomeIcon icon={faTrash} className="delTrash" onClick={
                (e) => {
                    let newCategories = [...categories];
                    newCategories.splice(categories.indexOf(category), 1);
                    setCategories(newCategories);
                }
            }/>
        </div>
    );

}



