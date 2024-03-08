import React, { useEffect,useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SubNavBarCompet } from '../Components/SubNavbarCompet/SubNavBarCompet';

import { InfoCompet } from '../Components/CompetitionSubpage/InfoCompet';
import { Inscriptions } from '../Components/CompetitionSubpage/Inscriptions';
import { Events } from '../Components/CompetitionSubpage/Events';

import { getCompetition } from '../CompetitionsAPI';
import './styles/Competition.css';

export const Competition = (props) => {
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
        </>    
    );
};