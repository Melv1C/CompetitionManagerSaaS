import React, { useEffect } from 'react'

import './Overview.css'

import axios from 'axios'
import { INSCRIPTIONS_URL } from '../../../Gateway'

export const Overview = ({competition}) => {

    const [nbrParticipants, setNbrParticipants] = React.useState(0);

    useEffect(() => {
        axios.get(`${INSCRIPTIONS_URL}/${competition.id}/info`)
        .then(response => {
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
