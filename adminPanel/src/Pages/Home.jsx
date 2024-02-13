import React, { useEffect,useState } from 'react';
import { CompetitionsList } from '../Components/CompetitionsList/CompetitionsList';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'


export const Home = (props) => {
    const [compets, setCompets] = useState([]);
    useEffect(() => {
        if (!props.user) {
            return;
        }
        const url = process.env.NODE_ENV === 'development' ? 'http://localhost/api/competitions' : process.env.GATEWAY_URL + '/api/competitions';
        axios.get(url).then((response) => {
            setCompets(response.data.data.filter((compet) => compet.club === props.user.club));
        }).catch((error) => {
            console.log(error);
        });
    }, [props.user]);
    if (!props.user) {
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
            <FontAwesomeIcon icon={faPlus}/>
            Ajouter une compétition
        </div>
        <div className='compet-link'>
            <CompetitionsList compets={compets}/>
        </div>
    </div>
  )
}
