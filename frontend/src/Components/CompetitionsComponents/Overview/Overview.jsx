import React, { useEffect } from 'react'

import './Overview.css'

import axios from 'axios'

export const Overview = ({competition}) => {

    console.log(competition);

    const [nbrParticipants, setNbrParticipants] = React.useState(0);

    useEffect(() => {
        const url = process.env.NODE_ENV === 'development' ? 'http://localhost/api/inscriptions' : '/api/inscriptions';

        axios.get(`${url}/${competition.id}/info`)
        .then(response => {
            console.log(response.data);
            setNbrParticipants(response.data.data.numberOfParticipants);
        })
        .catch(error => {
            console.log(error);
        });
    }, [competition]);


  return (
    <div className="competition-page">
        <ul className="overview">
            <li><strong>Date:</strong> {new Date(competition.date).toLocaleDateString("fr-FR")}</li>
            <li><strong>Cloture des inscriptions:</strong> {new Date(competition.date).toLocaleDateString("fr-FR")}</li>
            <li><strong>Lieu:</strong> {competition.location} ({competition.club})</li>
            {competition.schedule ? <li><strong>Horaire:</strong> <a href={competition.schedule} target="_blank" rel="noreferrer">Voir l'horaire</a></li> : null}
            <li><strong>Nombre de participants:</strong> {nbrParticipants}</li>
        </ul>
        <p>{competition.description}</p>

    </div>
  )
}
