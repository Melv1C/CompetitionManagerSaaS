import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';
import { COMPETITIONS_URL } from '../Gateway';

import { useParams, useSearchParams } from 'react-router-dom';

import { SubNavBar } from '../Components/CompetitionsComponents/SubNavBar/SubNavBar';
import { Overview } from '../Components/CompetitionsComponents/Overview/Overview';
import { Inscription } from '../Components/CompetitionsComponents/Inscription/Inscription';
import { Schedule } from '../Components/CompetitionsComponents/Schedule/Schedule';
import { Event } from '../Components/CompetitionsComponents/Event/Event';

export const Competition = ({subPage}) => {

    const { competitionId } = useParams();

    const [competition, setCompetition] = useState(null);

    useEffect(() => {
        axios.get(`${COMPETITIONS_URL}/${competitionId}`)
            .then((response) => {
                setCompetition(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, [competitionId]);

    return (
        <div className="page">
            {competition ?
            <div>
                <h1>{competition.name}</h1>
                <SubNavBar subPage={subPage} competitionId={competitionId} />
                {subPage === "overview" ? <Overview competition={competition} /> : null}
                {subPage === "inscription" ? <Inscription competition={competition} /> : null}
                {subPage === "schedule" ? <Schedule competition={competition} /> : null}
                {subPage === "event" ? <Event competition={competition} /> : null}
            </div>
            : null}
        </div>
    )

}
