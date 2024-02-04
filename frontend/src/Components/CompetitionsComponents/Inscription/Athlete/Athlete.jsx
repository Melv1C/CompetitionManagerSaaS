import React from 'react'
import { useState } from 'react'
import axios from 'axios'

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

function ControlButtons({setStep, setAthlete}) {
    return (
        <div className='control-buttons'>
            <button onClick={()=>{setAthlete(null)}}>Changer d'athlète</button>
            <button onClick={()=>{setStep(2)}}>Suivant</button>
        </div>
    )
}


export const Athlete = ({athlete, setAthlete, setStep}) => {
    const [athletes, setAthletes] = useState([]);

    const [loading, setLoading] = useState(false);

    function getAthletes(keyword) {
        
        setLoading(true);

        axios.get(`http://localhost/api/athletes?key=${keyword}`)
        .then(res => {
            const athletes = res.data.data;
            setLoading(false);
            setAthletes(athletes);
        })
        .catch(err => {
            setLoading(false);
            console.log(err);
        })

        
    }


    return (
        <div className='step-page'>
            <h2>Athlète</h2>

            {athlete === null ? 
            <>
                <div className='field'>
                    <input 
                        type='text' 
                        placeholder='Nom, Prénom ou dossard'
                        onKeyDown={(e)=>{if(e.key === 'Enter'){getAthletes(e.target.value)}}} 
                    />
                    <div className='search-icon' 
                        onClick={()=>{getAthletes(document.querySelector('.field input').value)}}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
                </div>
                <ListAthletes athletes={athletes} setAthlete={setAthlete} loading={loading} />
            </>
            : 
            <>
                <ChooseAthlete athlete={athlete} />
                <ControlButtons setStep={setStep} setAthlete={setAthlete} />
            </>
            }

        </div>
    )
}
