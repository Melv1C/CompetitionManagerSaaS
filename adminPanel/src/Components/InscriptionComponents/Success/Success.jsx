import React from 'react'
import { useNavigate } from 'react-router-dom';

import './Success.css'

function NewInscriptionButton({competitionId,navigate}) {
    return (
        <div className='control-buttons newInscription-button'>
            <button onClick={() => newInscription(competitionId,navigate)}>Inscrire un autre athlète</button>
        </div>
    )
}

function newInscription(competitionId,navigate) {
    navigate(`/competition/${competitionId}/inscriptions`);
}

export const Success = ({competitionId}) => {
    const navigate = useNavigate();
    return (
        <div className='step-page'>
            <h2>Inscription terminée</h2>
            <div className='success-message'>Votre inscription a bien été prise en compte</div>
            <NewInscriptionButton competitionId={competitionId} navigate={navigate} />
        </div>
    )
}
