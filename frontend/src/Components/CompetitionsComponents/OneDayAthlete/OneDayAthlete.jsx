import React, { useEffect, useState } from 'react'

import axios from 'axios';

import { ATLHETES_URL } from '../../../Gateway'

import './OneDayAthlete.css'

export const OneDayAthlete = ({competitionId, isForeignAthlete, setStep, setAthleteId}) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');
    const [club, setClub] = useState('NA');
    const [optionals, setOptionals] = useState({});

    const postAthlete = () => {

        if (firstName === '' || lastName === '' || birthDate === '' || gender === '') {
            alert('Veuillez remplir tous les champs');
            return;
        }

        if (isForeignAthlete && (club === 'NA' || optionals.license === '')) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        axios.post(`${ATLHETES_URL}?competitionId=${competitionId}`, {
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            gender: gender,
            club: club,
            optionals: optionals,
        })
        .then((response) => {
            console.log(response);
            setAthleteId(response.data.data);
            setStep(1);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className='one-day-athlete step-page'>
            <h2>Athlète</h2>
            <div className='form'>
                <div className='form-group'>
                    <label htmlFor="firstName">Prénom</label>
                    <input type="text" id='firstName' value={firstName} onChange={(e)=>{setFirstName(e.target.value)}} />
                </div>
                <div className='form-group'>
                    <label htmlFor="lastName">Nom</label>
                    <input type="text" id='lastName' value={lastName} onChange={(e)=>{setLastName(e.target.value)}} />
                </div>
                <div className='form-group'>
                    <label htmlFor="birthDate">Date de naissance</label>
                    <input type="date" id='birthDate' value={birthDate} onChange={(e)=>{setBirthDate(e.target.value)}} />
                </div>
                <div className='form-group radio'>
                    <label htmlFor="male">Homme</label>
                    <input type="radio" id="male" name='gender' value="Male" onChange={(e)=>{setGender(e.target.value)} } />
                    <label htmlFor="female">Femme</label>
                    <input type="radio" id='female' name='gender' value="Female" onChange={(e)=>{setGender(e.target.value)}} />
                </div>
                {isForeignAthlete ?
                    <div className='form-group'>
                        <label htmlFor="nationality">Nationalité</label>
                        <select id='nationality' onChange={(e)=>{setClub(e.target.value)}} value={club}>
                            <option value="NA">Sélectionner</option>
                            <option value="FRA">France</option>
                            <option value="NED">Pays-Bas</option>
                            <option value="LUX">Luxembourg</option>
                            <option value="GER">Allemagne</option>
                            <option value="SUI">Suisse</option>
                            <option value="ESP">Espagne</option>
                            <option value="ITA">Italie</option>
                            <option value="BEL">Belgique</option>
                            <option value="POR">Portugal</option>
                            <option value="GBR">Royaume-Uni</option>
                            <option value="POL">Pologne</option>
                        </select>
                    </div>
                : null}

                {isForeignAthlete ?
                    <div className='form-group'>
                        <label htmlFor="license">Numéro de licence</label>
                        <input type="text" id='license' value={optionals.license} onChange={(e)=>{setOptionals({...optionals, license: e.target.value})}} />
                    </div>
                : null}

            </div>
            <button className='submit' onClick={()=>{postAthlete()} }>Enregistrer</button>
        </div>

    )
}
