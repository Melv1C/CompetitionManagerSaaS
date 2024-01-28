import React from 'react'

import { Link } from 'react-router-dom';

export const CompetitionsItem = (props) => {

    

    return (
        <div className="competitions-item">
            <div className="competitions-item-date">{props.competition.date}</div>
            <div className="competitions-item-name">{props.competition.name}</div>
            <div className="competitions-item-inscription-deadline">Inscription avant le {props.competition.inscriptionDeadline}</div>
            <div className="competitions-item-button">
                <Link to={`/competitions/${props.competition.id}`}>
                    <div className="right-arrow"></div>
                </Link>
            </div>
        </div>
    )
}
