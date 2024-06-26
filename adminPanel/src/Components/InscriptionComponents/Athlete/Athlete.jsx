import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { ATLHETES_URL, INSCRIPTIONS_URL } from '../../../Gateway'

import './Athlete.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

function ListAthletes({athletes, setAthlete, loading}) {

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
                {filteredAthletes.map((athlete, index) => {
                    return <AthleteItem key={index} athlete={athlete} setAthlete={setAthlete} />
                })}
            </div>
        )
    }
}

function AthleteItem({athlete, setAthlete}) {
    return (
        <div className='athlete-item' onClick={()=>{setAthlete(athlete)}}>
            <div className='athlete-item-bib'>{athlete.bib}</div>
            <div className='athlete-item-name'>{athlete.firstName} {athlete.lastName}</div>
            <div className='athlete-item-club'>{athlete.club}</div>
        </div>
    )
}

function ChooseAthlete({athlete}) {
    return (
        <div className='athlete-card'>
            <div className='athlete-card-field'>
                <div className='athlete-card-label'>Dossard</div>
                <div className='athlete-card-value'>{athlete.bib}</div>
            </div>
            <div className='athlete-card-field'>
                <div className='athlete-card-label'>Nom</div>
                <div className='athlete-card-value'>{athlete.lastName} {athlete.firstName}</div>
            </div>
            <div className='athlete-card-field'>
                <div className='athlete-card-label'>Club</div>
                <div className='athlete-card-value'>{athlete.club}</div>
            </div>
            <div className='athlete-card-field'>
                <div className='athlete-card-label'>Catégorie</div>
                <div className='athlete-card-value'>{athlete.category}</div>
            </div>

        </div>
    )
}

function ControlButtons({setStep, setAthlete, enableNext}) {
    return (
        <>
            {!enableNext ? <div className='error-message'>Cet athlète est déjà inscrit à cette compétition avec un autre compte. En cas de problème, veuillez contacter l'organisateur.</div> : null}
            <div className='control-buttons'>
                <button onClick={()=>{setAthlete(null)}}>Changer d'athlète</button>
                {enableNext ? <button onClick={()=>{setStep(2)}}>Suivant</button> : null}
            </div>
        </>
        
    )
}


export const Athlete = ({athlete, setAthlete, setStep, competitionId, oneDay, setIsForeignAthlete, user}) => {
    const [athletes, setAthletes] = useState([]);

    const [loading, setLoading] = useState(false);

    const [enableNext, setEnableNext] = useState(false);

    let lastChange = new Date();

    function onChange(e) {
        if (e.target.value.length < 4) {
            setAthletes([]);
            setLoading(false);
            return;
        }
        lastChange = new Date();
        setTimeout(() => {
            if (new Date() - lastChange >= 599) {
                getAthletes(e.target.value);
            }
        }, 600);
    }

    function getAthletes(keyword) {

        if (keyword === '') {
            setAthletes([]);
            setLoading(false);
            return;
        }
        
        setLoading(true);

        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                setLoading(false);
                resolve('timeout');
            }, 10000);
        });
        
        const requestPromise = axios.get(`${ATLHETES_URL}?key=${keyword}`)
        
        Promise.race([timeoutPromise, requestPromise])
        .then(res => {
            if (res === 'timeout') {
                console.log('request timeout');
                alert('La recherche a pris trop de temps. Veuillez réessayer. En cas de problème persistant, veuillez nous contacter.');
                window.location.reload();
                return;
            }
            const athletes = res.data.data;
            setLoading(false);
            setAthletes(athletes);
        })
        .catch(err => {
            setLoading(false);
            console.log(err);
        })
    }

    useEffect(() => {
        if (athlete === null) {
            setEnableNext(false);
            return;
        }
    }, [athlete, competitionId])

    return (
        <div className='step-page'>
            <h2>Athlète</h2>

            {athlete === null ? 
            <>
                <div className='field'>
                    <input 
                        type='text' 
                        placeholder='Nom, Prénom ou dossard'
                        onKeyDown={(e)=>{
                            if(e.key === 'Enter'){
                                lastChange = new Date();
                                getAthletes(e.target.value)
                            }
                        }} 
                        onChange={onChange}
                    />
                    <div className='search-icon' 
                        onClick={()=>{getAthletes(document.querySelector('.field input').value)}}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
                </div>
                <ListAthletes athletes={athletes} setAthlete={setAthlete} loading={loading} />

                {oneDay ? 
                <div className='new-athletes-link'>
                    <button onClick={()=>{
                            setIsForeignAthlete(false)
                            setStep(-1)
                        }}>
                        Je n'ai pas de dossard
                    </button>         
                </div> 
                : null}

                <div className='new-athletes-link'>
                    <button onClick={()=>{
                            setIsForeignAthlete(true)
                            setStep(-1)
                        }}>
                        Athlète étranger
                    </button>         
                </div> 

            </>
            : 
            <>
                <ChooseAthlete athlete={athlete} />
                <ControlButtons setStep={setStep} setAthlete={setAthlete} enableNext={true} />
            </>
            }

        </div>
    )
}
