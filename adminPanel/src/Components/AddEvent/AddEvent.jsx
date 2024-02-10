import React, { useEffect, useState } from "react";

import axios from "axios";
import "./AddEvent.css";

import { addEvent } from "../../CompetitionsAPI";

export const AddEvent = (props) => {
    const [event, setEvent] = useState([]);
    const [groupings, setGrouping] = useState([]);
    const [selectedGrouping, setSelectedGrouping] = useState("0");
    const [filteredEvent, setFilteredEvent] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("0");
    const [time, setTime] = useState("10:00");
    const [cost, setCost] = useState(0);
    const [maxParticipants, setMaxParticipants] = useState(100);
    //todo category
    useEffect(() => {
        const url = process.env.NODE_ENV === 'development' ? 'http://localhost/api/events' : process.env.GATEWAY_URL + '/api/events';
        axios.get(url)
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


    function handleSubmit(event) {
        event.preventDefault();
        const formData = {
            name: selectedEvent,
            time: time,
            categories: ["SEN M", "SEN F"],
            maxParticipants: parseInt(maxParticipants),
            cost: parseInt(cost),
        };
        addEvent(props.competition.id, formData, props.setCompetition);
        props.setShowModal(false);
    }


    return (
        <>
            <form onSubmit={handleSubmit} className="addEventForm">
                <h1>Ajouter un événement</h1>
                <select name="grouping" id="grouping" onChange={
                    (e) => {
                        setSelectedGrouping(e.target.value);
                    }
                }>
                    <option value="0">Type d'événement</option>
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
                
                }>
                    <option value="0">Événement</option>
                    {
                        filteredEvent.map((event, index) => {
                            return <option key={index} value={event.name}>{event.name}</option>;
                        })
                    }
                </select>
                <input type="time" name="time" id="time" defaultValue={time} onChange={
                    (e) => {
                        setTime(e.target.value);
                    }
                }/>
                <div>
                    <label htmlFor="cost">Coût : </label>
                    <Cost competition={props.competition} setCost={setCost} cost={cost}/>
                    <label htmlFor="cost">€</label>
                </div>
                <div>
                    <label htmlFor="maxParticipants">Nombre max de participants : </label>
                    <input type="number" name="maxParticipants" id="maxParticipants" defaultValue={100} min={1} max={1000} onChange={
                        (e) => {
                            setMaxParticipants(e.target.value);
                        }
                    }/>
                </div>
                <input type="submit" value="Ajouter" />
            </form>
        </>
    )
};

function Cost (props) {
    if (props.competition.paid) {
        return <input type="number" name="cost" id="cost" value={props.cost} min={0} max={500} onChange={
            (e) => {
                props.setCost(e.target.value);
            }
        }/>;
    }else{
        return <input type="number" name="cost" id="cost" value="0" disabled/>;
    }
}

