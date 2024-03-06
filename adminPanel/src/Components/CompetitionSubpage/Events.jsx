import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { EventsList } from '../EventsList/EventsList';


export const Events = ({competition}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <>
            <div className='eventDiv'>
                <EventsList competition={competition}/>
                <button onClick={() => {
                    navigate(`/competition/${id}/addEvent`)
                }}>Ajouter une épreuves</button>
            </div>
        </>
    );
};