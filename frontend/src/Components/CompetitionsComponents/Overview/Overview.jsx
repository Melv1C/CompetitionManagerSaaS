import React, { useEffect } from 'react'

import './Overview.css'

import axios from 'axios'
import { INSCRIPTIONS_URL } from '../../../Gateway'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faCalendarAlt, faClock, faUsers, faEnvelope } from '@fortawesome/free-solid-svg-icons'

import { PieChart } from '../../PieChart/PieChart'
import { EventsByCat } from './EventsByCat/EventsByCat'

export const Overview = ({competition}) => {

    const [nbrParticipants, setNbrParticipants] = React.useState(0);
    const [competitionInfo, setCompetitionInfo] = React.useState({});

    useEffect(() => {
        axios.get(`${INSCRIPTIONS_URL}/${competition.id}/info`)
        .then(response => {
            console.log(response.data.data);
            setCompetitionInfo(response.data.data);
            setNbrParticipants(response.data.data.NumberOfParticipants);
        })
        .catch(error => {
            console.log(error);
        });
    }, [competition]);


    const email = competition.email || 'inscription.rusta@gmail.com';


    return (
        <div className="competition-page">
            <div className="overview">
                <div className="card info">
                    <div className="date">
                        <div className='label'>
                            <FontAwesomeIcon icon={faCalendarAlt} className='icon' /> 
                            Date:
                        </div>
                        <div className='value'>{new Date(competition.date).toLocaleDateString("fr-FR")}</div>
                    </div>
                    <div className="closeDate">
                        <div className='label'>
                            <FontAwesomeIcon icon={faCalendarAlt} className='icon' /> 
                            Fin des inscriptions:
                        </div>
                        <div className='value'>{new Date(competition.closeDate).toLocaleDateString("fr-FR")}</div>
                    </div>
                    <div className="location">
                        <div className='label'>
                            <FontAwesomeIcon icon={faMapMarkerAlt} className='icon' /> 
                            Lieu:
                        </div>
                        <div className='value'>{competition.location} ({competition.club})</div>
                    </div>
                        {competition.schedule ? 
                            <div className="schedule">
                                <div className='label'>
                                    <FontAwesomeIcon icon={faClock} className='icon' /> 
                                    Horaire:
                                </div>
                                <div className='value'><a href={competition.schedule} target="_blank" rel="noreferrer" className='overview-link'>
                                    Voir l'horaire
                                </a></div>
                            </div>  
                        : null}

                    <div className="contact">
                        <div className='label'>
                            <FontAwesomeIcon icon={faEnvelope} className='icon' /> 
                            Contact:
                        </div>
                        <div className='value'><a href={`mailto:${email}`} className='overview-link'>
                            {email}
                        </a></div>
                    </div>

                    <div className="nbrParticipants">
                        <div className='label'>
                            <FontAwesomeIcon icon={faUsers} className='icon' /> 
                            Participants:
                        </div>
                        <div className='value'>{nbrParticipants}</div>
                    </div>
                </div>
                {competition.description ?
                    <div className="description card">
                        <div className='title'>Description:</div>
                        {competition.description}
                    </div>
                : null}
                {nbrParticipants != 0 ?
                <div className="card pie-chart">
                    <div className='center title'>Athlètes par club:</div>
                    <PieChart data={competitionInfo.NumberOfAthletesByClub}/>
                </div>
                : null}

                {/*<div className="pie-chart card">
                    <div className='center title'>Athlètes par catégorie:</div>
                    <PieChart data={competitionInfo.NumberOfAthletesByCategory}/>
                </div>*/}

                <div className="card width-100">
                    <div className='center title'>Epreuves:</div>
                    <EventsByCat events={competition.events}/>
                </div>
                
            </div>
        </div>
    )
}
