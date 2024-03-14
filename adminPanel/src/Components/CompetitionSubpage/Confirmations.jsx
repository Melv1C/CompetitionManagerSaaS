import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { INSCRIPTIONS_URL, CONFIRMATIONS_URL } from '../../Gateway';
import axios from 'axios';

import './styles/Confirmations.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faExpand } from '@fortawesome/free-solid-svg-icons'

function ListAthletes({athletes, setAthlete, loading, setAthletes}) {
    if (document.querySelector('.field input')?.value === '') {
        return (
            <div className='list-athletes'>
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

function InscriptionList({inscriptions}) {
    console.log(inscriptions);
    return (
        <div className='inscriptionList'>
            {inscriptions.map((inscription, index) => {
                return <InscriptionItem key={index} inscription={inscription} />
            })}
        </div>
    )
}

function InscriptionItem({inscription}) {
    console.log(inscription);
    return (
        <div className='inscriptionItem'>
            <div className='inscriptionEvent'>{inscription.event}</div>
            <div className='inscriptionRecord'>{inscription.record}</div>
        </div>
    )
}



export const Confirmations = (props) => {
    const { id } = useParams();
    const [inscriptions, setInscriptions] = useState([]);
    const [athletes, setAthletes] = useState([]);
    const [athlete, setAthlete] = useState(null);
    const [loading, setLoading] = useState(false);

    function getMatchingAthletes(keyword) {
        console.log(`${CONFIRMATIONS_URL}/${id}?key=${keyword}`);
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
            <div className='inscriptionsDiv'>
                <InscriptionList inscriptions={inscriptions.filter(inscription => inscription.athleteId === athlete?.athleteId)} />
            </div>
        </div>
    )
}



