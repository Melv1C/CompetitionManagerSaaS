import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './CompetitionInfo.css';
import Switch from '@mui/material/Switch';

import { createCompetition, updateCompetition } from "../../CompetitionsAPI";

function changeTimeToMinutes(time) {
    const [hours, minutes] = time.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
}

function changeMinutesToTime(minutes) {
    let hours = Math.floor(minutes / 60).toString();
    let min = (minutes % 60).toString();
    if (hours.length === 1) {
        hours = "0" + hours;
    }
    if (min.length === 1) {
        min = "0" + min;
    }
    return `${hours}:${min}`;
}


export const CompetitionInfo = (props) => {
    const navigate = useNavigate();
    let compet = props.competition || null;
    const [date, setDate] = useState(compet ? compet.date : null);
    const [oneDay, setOneDay] = useState(compet ? compet.oneDay : false);


    const handleSubmit = async (event) => {
        event.preventDefault();
        const confirmationTime = changeTimeToMinutes(event.target.confirmation.value);
        if (!compet) {
            console.log(props.user.uid);
            const formData = {
                name: event.target.name.value,
                date: event.target.date.value,
                closeDate: event.target.closeDate.value,
                club: event.target.club.value.toUpperCase(),
                location: event.target.location.value,
                email: event.target.email.value,
                paid: event.target.paid.checked,
                freeClub: event.target.freeClub.checked,
                schedule: event.target.schedule.value,
                description: event.target.description.value,
                confirmationTime: confirmationTime,
                adminId: props.user.uid,
                oneDay: oneDay,
                oneDayBIB: event.target.oneDayBIB.value
            };
            console.log(formData);
            console.log(oneDay);
            console.log(event.target.oneDayBIB.value);
            createCompetition(formData, navigate);
        }else{
            const formData = {
                name: event.target.name.value,
                date: event.target.date.value,
                closeDate: event.target.closeDate.value,
                club: event.target.club.value.toUpperCase(),
                location: event.target.location.value,
                email: event.target.email.value,
                paid: event.target.paid.checked,
                freeClub: event.target.freeClub.checked,
                schedule: event.target.schedule.value,
                description: event.target.description.value,
                adminId: props.user.uid,
                confirmationTime: confirmationTime,
                id: compet.id,
                oneDay: oneDay,
                oneDayBIB: event.target.oneDayBIB.value
            };
            updateCompetition(formData, props.setCompetition);
            props.setShowModal(false);
        }
    };
    return (
        <div className='competInfo scrollable'>
            {compet ? <h1>Modifier la compétition</h1> : <h1>Créé une nouvelle compétition</h1>}
            <form className="createForm" onSubmit={handleSubmit}>
                <label htmlFor="name">Nom de la compétition</label>
                <input type="text" name="name" id="name" required defaultValue={compet?.name} maxLength={80}/>
                <label htmlFor="date">Date de la compétition</label>
                <input type="date" name="date" id="date" required defaultValue={compet?.date.substring(0,10)} min={new Date().toISOString().substring(0,10)} onChange={
                    (e) => {
                        setDate(e.target.value);
                    }
                }/>
                <label htmlFor="closeDate">Date de fin d'inscription</label>
                <input type="date" name="closeDate" id="closeDate" required defaultValue={compet?.closeDate.substring(0,10)} min={new Date().toISOString().substring(0,10)} max={date}/>
                <label htmlFor="club">Club organisateur</label>
                <input type="text" name="club" id="club" required defaultValue={compet?.club} maxLength={4}/>
                <label htmlFor="location">Lieu de la compétition</label>
                <input type="text" name="location" id="location" required defaultValue={compet?.location} maxLength={80}/>
                <label htmlFor="email">Email de contact</label>
                <input type="email" name="email" id="email" required defaultValue={compet?.email} maxLength={80}/>
                <label htmlFor="paid">Payant</label>
                <Switch defaultChecked={compet?.paid} name="paid" id="paid"/>
                <label htmlFor="freeClub">Gratuit pour les athlètes de votre club </label>
                <Switch defaultChecked={compet?.freeClub} name="freeClub" id="freeClub"/>
                <label htmlFor="confirmation">Confirmation</label>
                <input type="time" name="confirmation" id="confirmation" required defaultValue={compet ? changeMinutesToTime(compet?.confirmationTime) : "00:30"}/> avant l'épreuve
                <label htmlFor="oneDay">Autoriser les dossards d'un jour</label>
                <Switch defaultChecked={compet?.oneDay} onChange={
                    (e) => {
                        setOneDay(e.target.checked);
                    }
                } name="oneDay" id="oneDay"/>
                {oneDay && <div>
                    <label htmlFor="oneDayBIB">N° de départ des dossards d'un jour</label>
                    <input type="number" name="oneDayBIB" id="oneDayBIB" defaultValue={compet?.oneDayBIB || 9000} min={9000} max={9999}/>
                </div>}
                <label htmlFor="schedule">Lien vers un horaire(optionel)</label>
                <input type="text" name="schedule" id="schedule" defaultValue={compet?.schedule} maxLength={80}/>
                <label htmlFor="description">Description de la compétition</label>
                <textarea name="description" id="description" cols="30" rows="10" defaultValue={compet?.description} maxLength={400}/>
                <input type="submit" value={compet?"Modifier":"Crée"} id="createBtn" />
            </form>
        </div>
    )
};