import React from 'react'

import { Link } from 'react-router-dom'

import './Success.css'

function NewInscriptionButton({competitionId}) {
    return (
        <div className='control-buttons-success'>
            <Link to={`/competition/1d04e98753/inscriptions?step=1`}><button>Inscrire un autre athlète</button></Link>
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
