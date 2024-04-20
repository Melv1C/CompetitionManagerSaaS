import React from 'react'

import { Link } from 'react-router-dom'

import './Success.css'

function NewInscriptionButton({competitionId}) {
    return (
        <div className='control-buttons-success'>
            <Link to={`/competitions/${competitionId}/inscription`}><button>Inscrire un autre athlète</button></Link>
            <Link to={`/competitions/${competitionId}/schedule`}><button>Consulter l'horaire</button></Link>
            <Link to={`/profile`}><button>Voir mes inscriptions</button></Link>
        </div>
    )
}



export const Success = ({competitionId}) => {
  return (
    <div className='step-page'>
        <h2>Inscription terminée</h2>
        <div className='success-message'>Votre inscription a bien été prise en compte</div>
        <NewInscriptionButton competitionId={competitionId} />
    </div>
  )
}
