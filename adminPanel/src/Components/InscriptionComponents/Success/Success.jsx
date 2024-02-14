import React from 'react'

import './Success.css'

function NewInscriptionButton({competitionId}) {
    return (
        <div className='control-buttons newInscription-button'>
            <button onClick={() => newInscription(competitionId)}>Inscrire un autre athlète</button>
        </div>
    )
}

function newInscription(competitionId) {
    // redirect to the inscription page : /competitions/:id?subPage=inscription
    window.location.href = `/competitions/${competitionId}?subPage=inscription`;
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
