import React, { useEffect } from 'react'
import './Competitions.css'

import { CompetitionsItem } from './CompetitionsItem'

export const CompetitionsList = () => {

    const [competitions, setCompetitions] = React.useState([]);

    useEffect(() => {
        // TODO: Get competitions

        const data = [
            {
                id: 1,
                name: "Compétition 1",
                date: "2021-10-01",
                inscriptionDeadline: "2021-09-30",
            },
            {
                id: 2,
                name: "Compétition 2",
                date: "2021-10-02",
                inscriptionDeadline: "2021-10-01",
            },
            {
                id: 3,
                name: "Compétition 3",
                date: "2021-10-03",
                inscriptionDeadline: "2021-10-02",
            }
        ];

        setCompetitions(data);
    }, [])

  return (
    <div className="competitions-list">
        {competitions.map((competition) => {
            return <CompetitionsItem key={competition.id} competition={competition}/>
        })}
    </div>    
  )
}
