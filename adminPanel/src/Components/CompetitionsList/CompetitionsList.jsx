import React from 'react';
import { Link } from 'react-router-dom';
import './CompetitionsList.css';

function CompetitionsList(props) {
    if (props.compets.length === 0) {
        return (
            <div className='competitions-list'>
                <div className='no-competitions'>Vous n'avez pas de compétitions pour le moment</div>
            </div>
        );
    }
    return (
        <div className='competitions-list'>
            {props.compets.map((compet) => <CompetitionsItem key={compet.id} competition={compet} />)}
        </div>
    );
}

function CompetitionsItem(props) {
    return (
        <Link to={`/competitions/${props.competition.id}`}>
            <div className="competitions-item">
                <div className="competitions-item-info">
                    <div className="competitions-item-date">{new Date(props.competition.date).toLocaleDateString("fr-FR")}</div>
                    <div className="competitions-item-name">{props.competition.name}</div>
                    <div className="competitions-item-inscription-deadline">Inscription avant le {new Date(props.competition.date).toLocaleDateString("fr-FR")}</div>
                </div>
                <div className="competitions-item-button">
                    <div className="right-arrow"></div>
                </div>
            </div>
        </Link>
    );
}

export { CompetitionsList };