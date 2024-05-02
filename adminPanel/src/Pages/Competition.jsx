import React, { useEffect,useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { SubNavBarCompet } from '../Components/SubNavbarCompet/SubNavBarCompet';

import { InfoCompet } from '../Components/CompetitionSubpage/InfoCompet';
import { Inscriptions } from '../Components/CompetitionSubpage/Inscriptions';
import { Events } from '../Components/CompetitionSubpage/Events';
import { Confirmations } from '../Components/CompetitionSubpage/Confirmations';
import { Schedule } from '../Components/CompetitionSubpage/Schedule';
import { Stats } from '../Components/CompetitionSubpage/Stats';

import { getCompetition } from '../CompetitionsAPI';
import './styles/Competition.css';

export const Competition = (props) => {
    console.log("competition");
    const { id, subpage } = useParams();
    const navigate = useNavigate();
    const [competition, setCompetition] = useState(null);
    const [subPage, setSubPage] = useState(null);
    useEffect(() => {
        getCompetition(id, setCompetition);
    }, []);
    
    useEffect(() => {
        if (!subpage){
            navigate(`/competitions/${id}/infos`);
        }
        setSubPage(subpage);
    }, [subpage]);

    if (!competition) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <h1>{competition.name}</h1>
            <SubNavBarCompet subPage={subPage} setSubPage={setSubPage} />
            {subPage === "infos" ? <InfoCompet competition={competition} user={props.user} setCompetition={setCompetition}/> : null}
            {subPage === "inscriptions" ? <Inscriptions user={props.user} setUser={props.setUser}/> : null}
            {subPage === "events" ? <Events competition={competition}/> : null}
            {subPage === "confirmations" ? <Confirmations competition={competition} user={props.user}/> : null}
            {subPage === "schedule" ? <Schedule competition={competition} user={props.user}/> : null}
            {subPage === "stats" ? <Stats competition={competition} user={props.user}/> : null}
        </>    
    );
};