import React, { useEffect } from 'react'
import './Competitions.css'

import { CompetitionsItem } from './CompetitionsItem'
import axios from 'axios'

export const CompetitionsList = () => {

    const [competitions, setCompetitions] = React.useState([]);

    useEffect(() => {

        const url = process.env.NODE_ENV === 'development' ? 'http://localhost/api/competitions' : '/api/competitions';
        console.log("CompetitionsList url: " + url);
        axios.get(url)
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
