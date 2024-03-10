import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './CompetitionInfo.css';
import Switch from '@mui/material/Switch';

import { createCompetition, updateCompetition } from "../../CompetitionsAPI";


export const CompetitionInfo = (props) => {
    const navigate = useNavigate();
    let compet = props.competition || null;
    const [date, setDate] = useState(compet ? compet.date : null);


    const handleSubmit = async (event) => {
        event.preventDefault();
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
                adminId: props.user.uid
            };
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
                id: compet.id
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
                <label htmlFor="schedule">Lien vers un horaire(optionel)</label>
                <input type="text" name="schedule" id="schedule" defaultValue={compet?.schedule} maxLength={80}/>
                <label htmlFor="description">Description de la compétition</label>
                <textarea name="description" id="description" cols="30" rows="10" defaultValue={compet?.description} maxLength={400}/>
                <input type="submit" value={compet?"Modifier":"Crée"} id="createBtn" />
            </form>
        </div>
    )
};