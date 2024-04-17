import React, { useEffect, useState } from 'react'
import './SubNavBarCompet.css'
import { Link,useParams } from 'react-router-dom';

export const SubNavBarCompet = ({subPage, setSubPage}) => {
    const {id} = useParams()
    return (
        <>
            <div className='subnavbar'>
                <ul className='subnavbar-menu'>
                    <Link to={`/competition/${id}/infos`}><li onClick={()=>{setSubPage("infos")}}>Infos {subPage==="infos" ? <hr/> : null}</li></Link>
                    <Link to={`/competition/${id}/events`}><li onClick={()=>{setSubPage("events")}}>Épreuves {subPage==="events" ? <hr/> : null}</li></Link>
                    <Link to={`/competition/${id}/inscriptions`}><li onClick={()=>{setSubPage("inscriptions")}}>Inscriptions {subPage==="inscriptions" ? <hr/> : null}</li></Link>
                    <Link to={`/competition/${id}/confirmations`}><li onClick={()=>{setSubPage("confirmations")}}>Confirmations {subPage==="confirmations" ? <hr/> : null}</li></Link>
                    <Link to={`/competition/${id}/schedule`}><li onClick={()=>{setSubPage("schedule")}}>Horaire {subPage==="schedule" ? <hr/> : null}</li></Link>
                </ul>
            </div>
        </>
    )
}
