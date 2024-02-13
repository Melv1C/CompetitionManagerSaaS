import React, { useEffect, useState } from "react";

import axios from "axios";
import "./AddEvent.css";

import { addEvent } from "../../CompetitionsAPI";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export const AddEvent = (props) => {
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

    useEffect(() => {
        if (selectedEvent === "0") {
            return;
        }
        const url = process.env.NODE_ENV === 'development' ? 'http://localhost/api/events' : process.env.GATEWAY_URL + '/api/events';
        console.log(url);
        axios.get(url + '/' + selectedEvent)
            .then((response) => {
                console.log(response.data.data.validCat);
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


    function handleSubmit(event) {
        event.preventDefault();
        if (selectedEvent === "0") {
            alert("Veuillez sélectionner un événement");
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
                    <label htmlFor="pseudo">Nom : </label>
                    <input type="text" name="pseudo" id="pseudo" onChange={
                        (e) => {
                            setPseudo(e.target.value);
                        }
                    }/>
                </div>
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
                <CategoriesSelect validCat={validCat} categories={categories} setCategories={setCategories}/>
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



