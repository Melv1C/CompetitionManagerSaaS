import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


function SubEvent(props){
    const [selectedGrouping, setSelectedGrouping] = useState("0");
    const [filteredEvent, setFilteredEvent] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("0");
    const [time, setTime] = useState(props.subEvents[props.index].time);

    useEffect(() => {
        setTime(props.subEvents[props.index].time);
        setSelectedEvent(props.subEvents[props.index].name);
        setSelectedGrouping(props.subEvents[props.index].grouping);
    }, [props.subEvents]);

    useEffect(() => {
        if (selectedGrouping === "0") {
            setFilteredEvent([]);
        }else{
            let filteredEvent = props.events.filter((element) => {
                return element.grouping === selectedGrouping;
            });
            setFilteredEvent(filteredEvent);
        }
    }, [selectedGrouping]);

    return (
        <div>
            <label>Heure</label>
            <input type="time" value={time} onChange={(e) => {
                setTime(e.target.value);
                props.setSubEvents(subEvents => {
                    let newSubEvents = [...subEvents];
                    newSubEvents[props.index].time = e.target.value;
                    return newSubEvents;
                });
            }} />
            <select name="grouping" id="grouping" onChange={
                (e) => {
                    setSelectedGrouping(e.target.value);
                    props.setSubEvents(subEvents => {
                        let newSubEvents = [...subEvents];
                        newSubEvents[props.index].grouping = e.target.value;
                        return newSubEvents;
                    });
                }
            } value={selectedGrouping}>
                <option value="0">Type d'épreuve</option>
                {
                    props.groupings.map((grouping, index) => {
                        return <option key={index} value={grouping}>{grouping}</option>;
                    })
                }
            </select>
            <select name="event" id="event" onChange={
                (e) => {
                    setSelectedEvent(e.target.value);
                    props.setSubEvents(subEvents => {
                        let newSubEvents = [...subEvents];
                        newSubEvents[props.index].name = e.target.value;
                        return newSubEvents;
                    });
                }
            } value={selectedEvent}>
                <option value="0">Epreuve</option>
                {
                    filteredEvent.map((event, index) => {
                        return <option key={index} value={event.name}>{event.name}</option>;
                    })
                }
            </select>
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





export const SubEventInfo = (props) => {
    return (
        <div>
            <h2>Sous-épreuves</h2>
            {props.subEvents.map((element, index) => {
                return (
                    <SubEvent key={index} info={element} index={index} subEvents={props.subEvents} setSubEvents={props.setSubEvents} groupings={props.groupings} events={props.events}/>
                );
            })}
            <button type='button' onClick={
                () => {
                    props.setSubEvents([...props.subEvents, {
                        name:"0",
                        time:"10:00",
                        grouping:"0"
                    }]);
                }
            }>Ajouter une sous-épreuve</button>
        </div>
    );
};









