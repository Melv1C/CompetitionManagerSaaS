import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { EventsList } from '../EventsList/EventsList';


export const Events = ({competition}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <>
            <div className='eventDiv'>
                <EventsList competition={competition}/>
                <div className='center'>
                    <button className='greenBtn' onClick={() => {
                        navigate(`/competition/${id}/addEvent`)
                    }}>Ajouter une épreuves</button>
                </div>
            </div>
        </>
    );
};