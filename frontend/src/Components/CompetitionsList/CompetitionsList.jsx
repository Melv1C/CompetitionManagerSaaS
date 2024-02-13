import React, { useEffect } from 'react'
import './Competitions.css'

import { CompetitionsItem } from './CompetitionsItem'
import axios from 'axios'
import { url } from '../../Gateway'

export const CompetitionsList = () => {

    const [competitions, setCompetitions] = React.useState([]);

    useEffect(() => {
        axios.get(`${url}/competitions`)
            .then((response) => {
                setCompetitions(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

  return (
    <div className="competitions-list">

        {competitions.length === 0 && <div className="competitions-list-no-competitions">Aucune compétition</div>}
        
        {competitions.map((competition) => {
            return <CompetitionsItem key={competition.id} competition={competition}/>
        })}

    </div>    
  )
}
