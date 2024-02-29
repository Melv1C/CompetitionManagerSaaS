import React, {useEffect} from "react";
import './CompetitionInfo.css';

import { createCompetition, updateCompetition } from "../../CompetitionsAPI";


export const CompetitionInfo = (props) => {

    let compet = props.competition || null;

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!compet) {
            console.log(props.user.uid);
            const formData = {
                name: event.target.name.value,
                date: event.target.date.value,
                club: event.target.club.value.toUpperCase(),
                location: event.target.location.value,
                paid: event.target.paid.checked,
                freeClub: event.target.freeClub.checked,
                schedule: event.target.schedule.value,
                description: event.target.description.value,
                adminId: props.user.uid
            };
            createCompetition(formData);
        }else{
            const formData = {
                name: event.target.name.value,
                date: event.target.date.value,
                club: event.target.club.value.toUpperCase(),
                location: event.target.location.value,
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
                <input type="text" name="name" id="name" required defaultValue={compet?.name} />
                <label htmlFor="date">Date de la compétition</label>
                <input type="date" name="date" id="date" required defaultValue={compet?.date.substring(0,10)} />
                <label htmlFor="club">Club organisateur</label>
                <input type="text" name="club" id="club" required defaultValue={compet?.club}/>
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