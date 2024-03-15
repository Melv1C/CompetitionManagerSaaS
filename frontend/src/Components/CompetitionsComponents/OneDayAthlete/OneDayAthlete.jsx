import React, { useEffect, useState } from 'react'

import axios from 'axios';

import { ATLHETES_URL } from '../../../Gateway'

export const OneDayAthlete = ({competitionId}) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');

    const postAthlete = () => {

        if (firstName === '' || lastName === '' || birthDate === '' || gender === '') {
            alert('Veuillez remplir tous les champs');
            return;
        }

        axios.post(`${ATLHETES_URL}?competitionId=${competitionId}`, {
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            gender: gender
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className='one-day-athlete'>
            <h2></h2>
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
                <div className='form-group'>
                    <label htmlFor="male">Homme</label>
                    <input type="radio" id="male" name='gender' value="Male" onChange={(e)=>{setGender(e.target.value)} } />
                    <label htmlFor="female">Femme</label>
                    <input type="radio" id='female' name='gender' value="Female" onChange={(e)=>{setGender(e.target.value)}} />
                </div>
            </div>
            <button className='submit' onClick={()=>{postAthlete()} }>Enregistrer</button>
        </div>

    )
}
