import React, { useEffect, useState } from 'react'
import './SubNavBar.css'
import { Link } from 'react-router-dom';

export const SubNavBar = ({subPage, setSubPage}) => {
    return (
        <>
            <div className='subnavbar'>
                <ul className='subnavbar-menu'>
                    <li onClick={()=>{setSubPage("one")}}>Unique {subPage==="one" ? <hr/> : null}</li>
                    <li onClick={()=>{setSubPage("multi")}}>Multi {subPage==="multi" ? <hr/> : null}</li>
                </ul>
            </div>
        </>
    )
}
