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

function ListAthletes({athletes, setAthlete, loading, setAthletes, overAthlete, setOverAthlete}) {
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
                    return <AthleteItem key={index} index={index} athlete={athlete} setAthlete={setAthlete} setAthletes={setAthletes} overAthlete={overAthlete} setOverAthlete={setOverAthlete}/>
                })}
            </div>
        )
    }
}

function AthleteItem({index, athlete, setAthlete, setAthletes, overAthlete, setOverAthlete}) {
    return (
        <div className={index === overAthlete ? 'athlete-item athlete-over' : 'athlete-item'} onClick={()=>{
            setAthletes([]);
            document.querySelector('.field input').value = '';
            setAthlete(athlete)
            setOverAthlete(null);
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


function InscriptionList({inscriptions, id, confirmationTime, userId, setErrors, errors}) {
    return (
        <div className='inscriptionList'>
            {inscriptions.map((inscription, index) => {
                return <InscriptionItem key={index} inscription={inscription} id={id} confirmationTime={confirmationTime} userId={userId} setErrors={setErrors} errors={errors}/>
            })}
        </div>
    )
}

function InscriptionItem({inscription, id, confirmationTime, userId, setErrors, errors}) {
    const [time, setTime] = useState(null);
    const [event, setEvent] = useState(null);
    useEffect(() => {
        axios.get(`${COMPETITIONS_URL}/${id}/events/${inscription.event}`).then((response) => {
            setTime(minToTime(timeToMin(response.data.data.time) - confirmationTime));
            console.log(response.data.data);
            const event = response.data.data;
            if (event.closedList){
                setErrors([...errors, {message: `La liste de l'épreuve ${event.name} est cloturée` }]);
            }
            setEvent(event);
        }).catch((error) => {
            console.log(error);
        });
    },[]);
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

function ConfBtn({id, athleteId, setAthlete, setInscriptions,userId, errors}) {
    return (
        <button className='greenBtn' onClick={()=>{
            if (errors.length != 0) {
                alert(errors[0].message)
            }else{
                axios.post(`${CONFIRMATIONS_URL}/${id}/${athleteId}`,{userId:userId}).then((response) => {
                    setAthlete(null);
                    setInscriptions([]);
                }).catch((error) => {
                    console.log(error);
                });
            }
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
    const [filteredInscriptions, setFilteredInscriptions] = useState([]);
    const [athletes, setAthletes] = useState([]);
    const [athlete, setAthlete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [errors, setErrors] = useState([]);
    const [overAthlete, setOverAthlete] = useState(null);
    const confirmationTime = props.competition.confirmationTime;
    console.log(errors);

    useEffect(() => {
        setFilteredInscriptions(inscriptions.filter(inscription => inscription.athleteId === athlete?.athleteId));
    }, [athlete]);


    function getMatchingAthletes(keyword) {
        if (keyword === '') {
            setLoading(false);
            return;
        }
        axios.get(`${CONFIRMATIONS_URL}/${id}?key=${keyword}`).then((response) => {
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
        setStatus(getGlobalStatus(filteredInscriptions));
    }, [filteredInscriptions]);
    
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
                        onKeyDown={
                            (e)=>{
                                if(e.key === 'Enter'){
                                    if (overAthlete !== null) {
                                        if (document.querySelector('.field input').value !== ''){
                                            setAthlete(athletes[overAthlete]);
                                            setAthletes([]);
                                            document.querySelector('.field input').value = '';
                                            setOverAthlete(null);
                                        }
                                    }else{
                                        setLoading(true);
                                        getMatchingAthletes(e.target.value)
                                        setOverAthlete(0);
                                    }
                                }else if (e.key === 'ArrowDown') {
                                    if (overAthlete < athletes.length - 1) {
                                        e.preventDefault();
                                        setOverAthlete(overAthlete + 1);
                                    }
                                } else if (e.key === 'ArrowUp') {
                                    if (overAthlete > 0) {
                                        e.preventDefault();
                                        setOverAthlete(overAthlete - 1);
                                    }
                                }else{
                                    setOverAthlete(null);
                                }
                            }
                        } 
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
                <ListAthletes athletes={athletes} setAthlete={setAthlete} loading={loading} setAthletes={setAthletes} overAthlete={overAthlete} setOverAthlete={setOverAthlete}/>
            </div>
            <div className='selectedAthleteDiv'>
                {athlete ? <SelectedAthlete athlete={athlete} status={status}/> : null}
            </div>
            <div className='inscriptionsDiv'>
                <InscriptionList inscriptions={filteredInscriptions} id={id} confirmationTime={confirmationTime} userId={props.user.uid} setErrors={setErrors} errors={errors}/>
            </div>
            <div className='btnDiv'>
                {athlete && status !== "Confirmé" ? <ConfBtn id={id} athleteId={athlete.athleteId} setAthlete={setAthlete} setInscriptions={setInscriptions} userId={props.user.uid} errors={errors}/> : null}
                {athlete && status === "Confirmé" ? <UnConfBtn id={id} athleteId={athlete.athleteId} setAthlete={setAthlete} setInscriptions={setInscriptions} userId={props.user.uid}/> : null}
                {athlete && status === "Absent" ? <PresentBtn id={id} athleteId={athlete.athleteId} setAthlete={setAthlete} setInscriptions={setInscriptions} userId={props.user.uid}/> : null}
                {athlete && status !== "Absent" ? <AbsentBtn id={id} athleteId={athlete.athleteId} setAthlete={setAthlete} setInscriptions={setInscriptions} userId={props.user.uid}/> : null}
            </div>
        </div>
    )
}



