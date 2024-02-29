import React, { useEffect,useState } from 'react';
import { CompetitionsList } from '../Components/CompetitionsList/CompetitionsList';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { COMPETITIONS_URL } from '../Gateway';


export const Home = ({user}) => {
    const [compets, setCompets] = useState([]);
    useEffect(() => {
        console.log(user)
        if (!user.uid) {
            return;
        }
        axios.get(COMPETITIONS_URL+"/admin/"+user.uid).then((response) => {
            console.log(response)
            setCompets(response.data.data);
        }).catch((error) => {
            console.log(error);
        });
    }, [user]);
    if (!user.uid) {
        return (
            <div className='page'>
                <div className='no-competitions'>Vous n'êtes pas connecté</div>
            </div>
        );
    }
    return (
    <div className='page'>
        <h1>Vos compétitions</h1>
        <div onClick={
            () => {
                window.location.href = '/create';
            }
        } className='addCompetBtn'>
            <FontAwesomeIcon icon={faPlus} className='plusIcon'/>
            Ajouter une compétition
        </div>
        <div className='compet-link'>
            <CompetitionsList compets={compets}/>
        </div>
    </div>
  )
}
