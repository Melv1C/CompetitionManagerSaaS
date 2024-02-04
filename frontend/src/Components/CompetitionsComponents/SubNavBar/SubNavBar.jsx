import React, { useEffect, useState } from 'react'
import './SubNavBar.css'
import { Link } from 'react-router-dom';

export const SubNavBar = ({subPage, setSubPage}) => {
    return (
        <>
            <div className='subnavbar'>
                <ul className='subnavbar-menu'>
                    <li onClick={()=>{setSubPage("overview")}}>Apercu {subPage==="overview" ? <hr/> : null}</li>
                    <li onClick={()=>{setSubPage("inscription")}}>S'inscrire {subPage==="inscription" ? <hr/> : null}</li>
                    <li onClick={()=>{setSubPage("schedule")}}>Horaire {subPage==="schedule" ? <hr/> : null}</li>
                </ul>
            </div>
        </>
    )
}
