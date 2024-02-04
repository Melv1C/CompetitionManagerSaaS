import React, { useEffect } from 'react'
import './Competitions.css'

import { CompetitionsItem } from './CompetitionsItem'
import axios from 'axios'

export const CompetitionsList = () => {

    const [competitions, setCompetitions] = React.useState([]);

    useEffect(() => {

        const url = process.env.NODE_ENV === 'development' ? 'http://localhost/api/competitions' : '/api/competitions';

        axios.get(url)
            .then((response) => {
                setCompetitions(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });

        //const data = [
        //    {
        //        id: 1,
        //        name: "Compétition 1",
        //        date: "2021-10-01",
        //        inscriptionDeadline: "2021-09-30",
        //    },
        //    {
        //        id: 2,
        //        name: "Compétition 2",
        //        date: "2021-10-02",
        //        inscriptionDeadline: "2021-10-01",
        //    },
        //    {
        //        id: 3,
        //        name: "Compétition 3",
        //        date: "2021-10-03",
        //        inscriptionDeadline: "2021-10-02",
        //    }
        //];
        //setCompetitions(data);
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
