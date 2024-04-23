import React, { useState, useEffect } from 'react'

import { COMPETITIONS_URL, INSCRIPTIONS_URL } from '../../Gateway'

import { formatRecord } from '../../RecordsHandler'

import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import './ProfileInscriptions.css'

import axios from 'axios'

export const ProfileInscriptions = ({inscriptions, userId}) => {
    console.log(inscriptions);
    if (Object.keys(inscriptions).length === 0) {
        return (
            <div className="profileInscriptions">
                <div className="noInscriptions">
                    Vous n'avez pas d'inscriptions pour le moment
                </div>
            </div>
        )
    }
    return (
        <div className="profileInscriptions">
            <div className="competitions">
                {Object.keys(inscriptions).map((competitionId) => {
                    return <Competition key={competitionId} competitionId={competitionId} inscriptions={inscriptions[competitionId]} userId={userId} />
                })}
            </div>
        </div>
    )
}

const Competition = ({competitionId, inscriptions, userId}) => {

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
                        //console.log(inscription);
                        if (inscription.eventType === "subEvent") {
                            const event = events.find(event => event.pseudoName === inscription.parentEvent);
                            if (event) {
                                const subEvent = event.subEvents.find(subEvent => subEvent.name === inscription.event.split(" - ")[1]);
                                if (subEvent) {
                                    setInscriptionsWithHours((prev) => {
                                        const athleteInscriptions = prev[athleteId];
                                        const getInscription = athleteInscriptions.find(insc => insc._id === inscription._id);
                                        getInscription.time = subEvent.time;
                                        // sort athlete inscriptions by time
                                        athleteInscriptions.sort((a, b) => {
                                            if (a.time < b.time) return -1;
                                            if (a.time > b.time) return 1;
                                            return 0;
                                        });
                                        return prev;
                                    });
                                }
                            }
                        } else {
                            const event = events.find(event => event.pseudoName === inscription.event);
                            if (event) {
                                setInscriptionsWithHours((prev) => {
                                    const athleteInscriptions = prev[athleteId];
                                    const getInscription = athleteInscriptions.find(insc => insc._id === inscription._id);
                                    getInscription.time = event.time;
                                    // sort athlete inscriptions by time
                                    athleteInscriptions.sort((a, b) => {
                                        if (a.time < b.time) return -1;
                                        if (a.time > b.time) return 1;
                                        return 0;
                                    });
                                    return prev;
                                });
                            }
                        }
                    }
                }
            })
            .catch(error => {
                console.error(error);
            }
        )
    }, [competitionId])

    return (
        <div className="competition">
            <div className="competitionTitle">
                {competition?.name}
            </div>
            <Athletes inscriptions={inscriptionsWithHours} userId={userId} />
        </div>
    )
}

const Athletes = ({inscriptions, userId}) => {
    return (
        <div className="athletes">
            {Object.keys(inscriptions).map((athleteId) => {
                return <Athlete key={athleteId} athleteId={athleteId} inscriptions={inscriptions[athleteId]} userId={userId} />
            })}
        </div>
    )
}

const Athlete = ({athleteId, inscriptions, userId}) => {
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
                <div className="delete" onClick={() => handleDelete(firstInscription.competitionId, athleteId, userId)}>
                    <FontAwesomeIcon icon={faTrash} /> Supprimer
                </div>
            </div>
        </div>
    )
}

const handleDelete = (competitionId, athleteId, userId) => {
    // prompt user to confirm deletion
    const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette inscription ?");
    if (!confirmation) return;

    // delete inscription
    const body = {
        userId: userId
    };
    axios.delete(`${INSCRIPTIONS_URL}/${competitionId}/${athleteId}`, {data: body})
        .then((response) => {
            console.log(response);
            window.location.reload();
        })
        .catch((error) => {
            console.error(error);
        })
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
