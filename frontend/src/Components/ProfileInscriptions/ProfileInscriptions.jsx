import React, { useState, useEffect } from 'react'

import { COMPETITIONS_URL } from '../../Gateway'

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

    const [competition, setCompetition] = useState(null);

    const [inscriptionsWithHours, setInscriptionsWithHours] = useState(inscriptions);

    useEffect(() => {
        fetch(`${COMPETITIONS_URL}/${competitionId}`)
            .then(response => response.json())
            .then(data => {
                const competitionData = data.data;
                setCompetition(competitionData);

                const events = competitionData.events;

                for (let athleteId in inscriptions) {
                    for (let inscription of inscriptions[athleteId]) {
                        const event = events.find(event => event.pseudoName === inscription.event);
                        if (event) {
                            inscription.time = event.time;
                        }
                    }
                }
            })
    }, [competitionId])

    console.log(competition)

    

    return (
        <div className="competition">
            <div className="competitionTitle">
                {competition?.name}
            </div>
            <Athletes inscriptions={inscriptionsWithHours} />
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
                <Link to={`/competitions/${firstInscription.competitionId}/inscription?athleteId=${athleteId}&step=2`}>
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
            <div className="time">
                {inscription?.time}
            </div>
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
