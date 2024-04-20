import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { COMPETITIONS_URL, CONFIRMATIONS_URL, INSCRIPTIONS_ADMIN_URL } from '../../Gateway';
import axios from 'axios';
import { getGlobalStatus } from '../../Status';

import { formatRecord } from '../../RecordsHandler';

import './styles/Confirmations.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faExpand, faTrash } from '@fortawesome/free-solid-svg-icons'
import { BasicAlert } from '../AlertComponent/BasicAlert';


function timeToMin(time) {
    const [hours, minutes] = time.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
}

function minToTime(min) {
    const hours = Math.floor(min / 60);
    const minutes = min % 60;
    return `${hours}:${minutes}`;
}

function validTime(time) {
    if (time === null) {
        return false;
    }
    const now = new Date();
    const [hours, minutes] = time.split(':');
    const timeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    return timeDate > now;
}

function ListAthletes({athletes, setAthlete, loading, setAthletes}) {
    if (document.querySelector('.field input')?.value === '') {
        return (
            <div >
            </div>
        )
    }

    if (loading) {
        return (
            <div className='list-athletes'>
                <span class="loader"></span>
            </div>
        )
    }

    const filteredAthletes = athletes.filter(athlete => {
        return athlete.bib !== null;
    })

    if (filteredAthletes.length === 0) {
        return (
            <div className='list-athletes'>
                <div className='no-athletes'>Aucun athlète trouvé</div>
            </div>
        )
    } else {
        return (
            <div className='list-athletes'>
                {athletes.map((athlete, index) => {
                    return <AthleteItem key={index} athlete={athlete} setAthlete={setAthlete} setAthletes={setAthletes} />
                })}
            </div>
        )
    }
}

function AthleteItem({athlete, setAthlete, setAthletes}) {
    return (
        <div className='athlete-item' onClick={()=>{
            setAthletes([]);
            document.querySelector('.field input').value = '';
            setAthlete(athlete)

        }}>
            <div className='athlete-item-bib'>{athlete.bib}</div>
            <div className='athlete-item-name'>{athlete.athleteName}</div>
            <div className='athlete-item-club'>{athlete.club}</div>
        </div>
    )
}

function getColorStatus(status) {
    if (status === 'Confirmé') {
        return 'green';
    } else if (status === 'Non confirmé') {
        return '';
    } else {
        return 'red';
    }
}


function SelectedAthlete({athlete, status}) {
    return (
        <div className='selected-athlete'>
            <div className='selected-athlete-name'>Nom : {athlete.athleteName}</div>
            <div className='selected-athlete-bib'>Dossard : {athlete.bib}</div>
            <div className='selected-athlete-club'>Club : {athlete.club}</div>
            <div className='selected-athlete-category'>Catégorie : {athlete.category}</div>
            <div className={getColorStatus(status)}>Status : {status}</div>

        </div>
    )
}


function InscriptionList({inscriptions, id, confirmationTime, userId}) {
    return (
        <div className='inscriptionList'>
            {inscriptions.map((inscription, index) => {
                return <InscriptionItem key={index} inscription={inscription} id={id} confirmationTime={confirmationTime} userId={userId}/>
            })}
        </div>
    )
}

function InscriptionItem({inscription, id, confirmationTime, userId}) {
    const [time, setTime] = useState(null);
    const [event, setEvent] = useState(null);
    useEffect(() => {
        axios.get(`${COMPETITIONS_URL}/${id}/events/${inscription.event}`).then((response) => {
            setTime(minToTime(timeToMin(response.data.data.time) - confirmationTime));
            setEvent(response.data.data);
        }).catch((error) => {
            console.log(error);
        });
    });
    return (
        <div className='inscriptionItem'>
            <div className='inscriptionEvent'>{inscription.event}</div>
            <div className='inscriptionRecord'>PB : {inscription.record === 0 ? "Aucun" : (event ? formatRecord(event, inscription.record) : 'loading...')}</div>
            <div className={validTime(time) ? "green": "red"}>Avant : {time}</div>
            <div>
                <button className='deleteBtn' onClick={()=>{
                    axios.delete(`${CONFIRMATIONS_URL}/remove/${id}/${inscription.athleteId}/${inscription.event}/${userId}`).then((response) => {
                        console.log(response);
                    }).catch((error) => {
                        console.log(error);
                    });
                }
                }>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    )
}

function ConfBtn({id, athleteId, setAthlete, setInscriptions,userId}) {
    return (
        <button className='greenBtn' onClick={()=>{
            axios.post(`${CONFIRMATIONS_URL}/${id}/${athleteId}`,{userId:userId}).then((response) => {
                setAthlete(null);
                setInscriptions([]);
            }).catch((error) => {
                console.log(error);
            });
        }}>Confirmer</button>
    )
}

function UnConfBtn({id, athleteId, setAthlete, setInscriptions,userId}) {
    return (
        <button className='deleteBtn' onClick={()=>{
            axios.delete(`${CONFIRMATIONS_URL}/${id}/${athleteId}/${userId}`).then((response) => {
                setAthlete(null);
                setInscriptions([]);
            }).catch((error) => {
                console.log(error);
            });
        }}>Déconfirmer</button>
    )
}

function AbsentBtn({id, athleteId, setAthlete, setInscriptions, userId}) {
    return (
        <button className='deleteBtn' onClick={()=>{
            axios.delete(`${CONFIRMATIONS_URL}/absent/${id}/${athleteId}/${userId}`).then((response) => {
                setAthlete(null);
                setInscriptions([]);
            }).catch((error) => {
                console.log(error);
            });
        }}>Absent</button>
    )
}

function PresentBtn({id, athleteId, setAthlete, setInscriptions, userId}) {
    return (
        <button className='orangeBtn' onClick={()=>{
            axios.post(`${CONFIRMATIONS_URL}/absent/${id}/${athleteId}/${userId}`).then((response) => {
                setAthlete(null);
                setInscriptions([]);
            }).catch((error) => {
                console.log(error);
            });
        }}>Present</button>
    )
}



export const Confirmations = (props) => {
    const { id } = useParams();
    const [inscriptions, setInscriptions] = useState([]);
    const [athletes, setAthletes] = useState([]);
    const [athlete, setAthlete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const confirmationTime = props.competition.confirmationTime;

    function getMatchingAthletes(keyword) {
        axios.get(`${CONFIRMATIONS_URL}/${id}?key=${keyword}`).then((response) => {
            console.log(response.data.data);
            setInscriptions(response.data.data);
            setLoading(false);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        let athletes = [];
        for (const inscription of inscriptions) {
            if (athletes.filter(athlete => athlete.athleteId === inscription.athleteId).length === 0) {
                athletes.push({
                    athleteId: inscription.athleteId,
                    athleteName: inscription.athleteName,
                    club: inscription.club,
                    bib: inscription.bib,
                    category: inscription.category
                });
            }
        };
        setAthletes(athletes);
    }, [inscriptions]);

    useEffect(() => {
        setStatus(getGlobalStatus(inscriptions));
    }, [inscriptions]);


    return (
        <div id='comfirmations'>
            <div className='fullScreenDiv'>
                <FontAwesomeIcon icon={faExpand} className='fullScreenIcon' onClick={
                    () => {
                        const elem = document.getElementById('comfirmations');
                        if (!document.fullscreenElement) {
                            elem.requestFullscreen().catch(err => {
                                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                            });
                        } else {
                            document.exitFullscreen();
                        }
                    }
                
                } />
            </div>
            <div className='searchDiv'>
                <div className='field'>
                    <input 
                        type='text' 
                        placeholder='Nom, Prénom ou dossard'
                        onKeyDown={(e)=>{if(e.key === 'Enter'){
                            setLoading(true);
                            getMatchingAthletes(e.target.value)
                        }}} 
                    />
                    <div className='search-icon' 
                        onClick={()=>{
                            setLoading(true);
                            getMatchingAthletes(document.querySelector('.field input').value)
                        }}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
                </div>
                <ListAthletes athletes={athletes} setAthlete={setAthlete} loading={loading} setAthletes={setAthletes} />
            </div>
            <div className='selectedAthleteDiv'>
                {athlete ? <SelectedAthlete athlete={athlete} status={status}/> : null}
            </div>
            <div className='inscriptionsDiv'>
                <InscriptionList inscriptions={inscriptions.filter(inscription => inscription.athleteId === athlete?.athleteId)} id={id} confirmationTime={confirmationTime} userId={props.user.uid}/>
            </div>
            <div className='btnDiv'>
                {athlete && status !== "Confirmé" ? <ConfBtn id={id} athleteId={athlete.athleteId} setAthlete={setAthlete} setInscriptions={setInscriptions} userId={props.user.uid}/> : null}
                {athlete && status === "Confirmé" ? <UnConfBtn id={id} athleteId={athlete.athleteId} setAthlete={setAthlete} setInscriptions={setInscriptions} userId={props.user.uid}/> : null}
                {athlete && status === "Absent" ? <PresentBtn id={id} athleteId={athlete.athleteId} setAthlete={setAthlete} setInscriptions={setInscriptions} userId={props.user.uid}/> : null}
                {athlete && status !== "Absent" ? <AbsentBtn id={id} athleteId={athlete.athleteId} setAthlete={setAthlete} setInscriptions={setInscriptions} userId={props.user.uid}/> : null}
            </div>
        </div>
    )
}



