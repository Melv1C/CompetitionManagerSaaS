import React, { useEffect, useState } from "react";

import axios from "axios";
import "./AddEvent.css";



export const AddEvent = () => {
    const [event, setEvent] = useState([]);
    const [groupings, setGrouping] = useState([]);
    const [selectedGrouping, setSelectedGrouping] = useState("0");
    const [filteredEvent, setFilteredEvent] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("0");
    //todo category
    useEffect(() => {
        axios.get("http://localhost:3002/api/events")
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


    return (
        <>
            <div>
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
            </div>
        </>
    )
};



