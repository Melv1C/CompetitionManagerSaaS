import React, {useEffect} from "react";
import './CompetitionInfo.css';
import axios from "axios";

import { createCompetition, updateCompetition } from "../../CompetitionsAPI";


export const CompetitionInfo = (props) => {

    let club = props.user?.club || '';
    let compet = props.competition || null;

    useEffect(() => {
        club = props.user?.club || '';
    }, [props.user?.club]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!compet) {
            const formData = {
                name: event.target.name.value,
                date: event.target.date.value,
                club: event.target.club.value,
                location: event.target.location.value,
                paid: event.target.paid.checked,
                freeClub: event.target.freeClub.checked,
                schedule: event.target.schedule.value,
                description: event.target.description.value,
                adminId: props.user.id
            };
            createCompetition(formData, props.setCompetition);
        }else{
            const formData = {
                name: event.target.name.value,
                date: event.target.date.value,
                club: event.target.club.value,
                location: event.target.location.value,
                paid: event.target.paid.checked,
                freeClub: event.target.freeClub.checked,
                schedule: event.target.schedule.value,
                description: event.target.description.value,
                adminId: props.user.id,
                id: compet.id
            };
            updateCompetition(formData, props.setCompetition);
            props.setShowModal(false);
        }
    };

    return (
        <div className='competInfo'>
            {compet ? <h1>Modifier la compétition</h1> : <h1>Créé une nouvelle compétition</h1>}
            <form className="createForm" onSubmit={handleSubmit}>
                <label htmlFor="name">Nom de la compétition</label>
                <input type="text" name="name" id="name" required defaultValue={compet?.name} />
                <label htmlFor="date">Date de la compétition</label>
                <input type="date" name="date" id="date" required defaultValue={compet?.date.substring(0,10)} />
                <label htmlFor="club">Club organisateur</label>
                <input type="text" name="club" id="club" required value={club} readOnly/>
                <label htmlFor="location">Lieu de la compétition</label>
                <input type="text" name="location" id="location" required defaultValue={compet?.location}/>
                <label htmlFor="paid">Payant</label>
                <input type="checkbox" name="paid" id="paid" defaultChecked={compet?.paid}/>
                <label htmlFor="freeClub">Gratuit pour les athlètes de votre club </label>
                <input type="checkbox" name="freeClub" id="freeClub" defaultChecked={compet?.freeClub}/>
                <label htmlFor="schedule">Lien vers un horaire(optionel)</label>
                <input type="text" name="schedule" id="schedule" defaultValue={compet?.schedule}/>
                <label htmlFor="description">Description de la compétition</label>
                <textarea name="description" id="description" cols="30" rows="10" defaultValue={compet?.description}/>
                <input type="submit" value={compet?"Modifier":"Crée"} id="createBtn" />
            </form>
        </div>
    )
};