import React from 'react'

import { Link } from 'react-router-dom';

export const CompetitionsItem = (props) => {

    

    return (
        <Link to={`/competitions/${props.competition.id}`}>
            <div className="competitions-item">
                <div className="competitions-item-date">{new Date(props.competition.date).toLocaleDateString("fr-FR")}</div>
                <div className="competitions-item-name">{props.competition.name}</div>
                <div className="competitions-item-inscription-deadline">Inscription avant le {new Date(props.competition.date).toLocaleDateString("fr-FR")}</div>
                <div className="competitions-item-button">
                    <div className="right-arrow"></div>
                </div>
            </div>
        </Link>
    )
}
