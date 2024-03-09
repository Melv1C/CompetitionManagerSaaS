import React, { useEffect, useState } from 'react'
import './SubNavBar.css'
import { Link } from 'react-router-dom';

export const SubNavBar = ({subPage, competitionId}) => {
    return (
        <>
            <div className='subnavbar'>
                <ul className='subnavbar-menu'>
                    <li>
                        <Link to={`/competitions/${competitionId}`}>Apercu {subPage==="overview" ? <hr/> : null}</Link>
                    </li>
                    <li>
                        <Link to={`/competitions/${competitionId}/inscription`}>S'inscrire {subPage==="inscription" ? <hr/> : null}</Link>
                    </li>
                    <li>
                        <Link to={`/competitions/${competitionId}/schedule`}>Horaire {subPage==="schedule" ? <hr/> : null}</Link>
                    </li>
                </ul>
            </div>
        </>
    )
}
