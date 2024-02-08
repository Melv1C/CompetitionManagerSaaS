import React, {useEffect} from "react";
import './CompetitionInfo.css';
import axios from "axios";
axios.defaults.withCredentials = true;


export const CompetitionInfo = (props) => {
    //const [email, setEmail] = React.useState("");
    let club = props.user?.club || '';

    useEffect(() => {
        club = props.user?.club || '';
    }, [props.user?.club]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = {
            name: event.target.name.value,
            date: event.target.date.value,
            club: event.target.club.value,
            location: event.target.location.value,
            paid: event.target.paid.checked,
            freeClub: event.target.freeClub.value,
            schedule: event.target.schedule.value,
            description: event.target.description.value
        };
        axios.post('http://localhost:3000/adminAuth/competitions', formData)
            .then(response => {
                window.location.href = `/competitions/${response.data.data.id}`;
            })
            .catch(error => {
                console.error('Error:', error); // Handle error
            });
    };

    return (
        <div className='competInfo'>
            <h1>Créé une nouvelle compétition</h1>
            <form className="createForm" onSubmit={handleSubmit}>
                <label htmlFor="name">Nom de la compétition</label>
                <input type="text" name="name" id="name" required/>
                <label htmlFor="date">Date de la compétition</label>
                <input type="date" name="date" id="date" required/>
                <label htmlFor="club">Club organisateur</label>
                <input type="text" name="club" id="club" required value={club} readOnly/>
                <label htmlFor="location">Lieu de la compétition</label>
                <input type="text" name="location" id="location" required/>
                <label htmlFor="paid">Payant</label>
                <input type="checkbox" name="paid" id="paid" required/>
                <label htmlFor="freeClub">Gratuit pour les club : </label>
                <input type="text" name="freeClub" id="freeClub"/>
                <label htmlFor="schedule">Lien vers un horaire(optionel)</label>
                <input type="text" name="schedule" id="schedule"/>
                <label htmlFor="description">Description de la compétition</label>
                <textarea name="description" id="description" cols="30" rows="10"/>
                <input type="submit" value="Crée" id="createBtn" />
            </form>
        </div>
    )
};