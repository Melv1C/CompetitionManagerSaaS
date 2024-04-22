import React, { useEffect } from 'react'
import './Competitions.css'

import { CompetitionsItem } from './CompetitionsItem'
import axios from 'axios'
import { COMPETITIONS_URL } from '../../Gateway'

export const CompetitionsList = () => {

    const [competitions, setCompetitions] = React.useState(null);

    useEffect(() => {
        axios.get(`${COMPETITIONS_URL}`)
            .then((response) => {
                const data = response.data.data;
                setCompetitions(data.filter(competition => competition.open === true).sort((a, b) => a.date > b.date ? 1 : -1));
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    if (competitions === null) {
        return <div className="competitions-list">Chargement...</div>
    }

    return (
        <div className="competitions-list">

            {competitions.length === 0 && <div className="competitions-list-no-competitions">Aucune compétition</div>}
            
            {competitions.map((competition) => {
                return <CompetitionsItem key={competition.id} competition={competition}/>
            })}

        </div>    
    )
}
