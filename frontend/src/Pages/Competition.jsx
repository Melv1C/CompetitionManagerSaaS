import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';

import { useParams, useSearchParams } from 'react-router-dom';

import { SubNavBar } from '../Components/CompetitionsComponents/SubNavBar/SubNavBar';
import { Overview } from '../Components/CompetitionsComponents/Overview/Overview';
import { Inscription } from '../Components/CompetitionsComponents/Inscription/Inscription';

export const Competition = () => {

    const { id } = useParams();

    const [competition, setCompetition] = useState(null);

    //const [subPage, setSubPage] = useState("overview");

    const [searchParams, setSearchParams] = useSearchParams();
    const subPage = searchParams.get('subPage') || "overview";
    const setSubPage = (subPage) => {
        setSearchParams({ subPage: subPage });
    }

    if (searchParams.get('subPage') === null) {
        setSearchParams({ subPage: "overview" });
    }


    useEffect(() => {
            axios.get(`http://localhost/api/competitions/${id}`)
                .then((response) => {
                    setCompetition(response.data.data);
                })
                .catch((error) => {
                    console.log(error);
                });
    
        }, [id]);



    return (
        <div className="page">
            {competition ?
            <div>
                <h1>{competition.name}</h1>
                <SubNavBar subPage={subPage} setSubPage={setSubPage} />
                {subPage === "overview" ? <Overview competition={competition} /> : null}
                {subPage === "inscription" ? <Inscription id={id} /> : null}
                {subPage === "schedule" ? <p>Horaire</p> : null}
            </div>
            : null}
        </div>
    )

}
