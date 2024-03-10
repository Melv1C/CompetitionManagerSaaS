import React from 'react'

import { formatRecord } from '../../RecordsHandler'

import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import './ProfileInscriptions.css'

export const ProfileInscriptions = ({inscriptions}) => {
    return (
        <div className="profileInscriptions">
            <div className="competitions">
                {Object.keys(inscriptions).map((competitionId) => {
                    return <Competition key={competitionId} competitionId={competitionId} inscriptions={inscriptions[competitionId]} />
                })}
            </div>
        </div>
    )
}

const Competition = ({competitionId, inscriptions}) => {
    const firstInscription = Object.values(inscriptions)[0][0];
    return (
        <div className="competition">
            <div className="competitionTitle">
                {firstInscription.competitionName}
            </div>
            <Athletes inscriptions={inscriptions} />
        </div>
    )
}

const Athletes = ({inscriptions}) => {
    return (
        <div className="athletes">
            {Object.keys(inscriptions).map((athleteId) => {
                return <Athlete key={athleteId} athleteId={athleteId} inscriptions={inscriptions[athleteId]} />
            })}
        </div>
    )
}

const Athlete = ({athleteId, inscriptions}) => {
    const firstInscription = inscriptions[0];
    return (
        <div className="athlete">
            <div className="athleteName">
                {firstInscription.athleteName}
            </div>
            <Inscriptions inscriptions={inscriptions} />
            <div className="controls">
                <Link to={`/competitions/${firstInscription.competitionId}/inscription?athleteId=${athleteId}`}>
                    <div className="modify">
                        <FontAwesomeIcon icon={faEdit} /> Modifier
                    </div>
                </Link>
                <div className="delete" onClick={() => console.log('todo delete')}>
                    <FontAwesomeIcon icon={faTrash} /> Supprimer
                </div>
            </div>
        </div>
    )
}

const Inscriptions = ({inscriptions}) => {
    return (
        <div className="inscriptions">
            {inscriptions.map((inscription) => {
                return <Inscription key={inscription.id} inscription={inscription} />
            })}
        </div>
    )
}

const Inscription = ({inscription}) => {
    return (
        <div className="inscription">
            <Link to={`/competitions/${inscription.competitionId}/${inscription.event}`}>
                <div className="event">
                    {inscription.event}
                </div>
            </Link>
            <div className="record">
                {formatRecord(inscription.recordType, inscription.record)}
            </div>
        </div>
    )
}
