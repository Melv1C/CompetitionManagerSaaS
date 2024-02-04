import React, { useEffect, useState } from 'react'
import './SubNavBar.css'
import { Link } from 'react-router-dom';

export const SubNavBar = ({setSubPage}) => {

    const [subMenu, setSubMenu] = useState("overview");

    function setSubMenuFunction(subMenu) {
        setSubMenu(subMenu);
        setSubPage(subMenu);
    }

  return (
    <>
        <div className='subnavbar'>
            <ul className='subnavbar-menu'>
                <li onClick={()=>{setSubMenuFunction("overview")}}>Apercu {subMenu==="overview" ? <hr/> : null}</li>
                <li onClick={()=>{setSubMenuFunction("inscription")}}>S'inscrire {subMenu==="inscription" ? <hr/> : null}</li>
                <li onClick={()=>{setSubMenuFunction("schedule")}}>Horaire {subMenu==="schedule" ? <hr/> : null}</li>
            </ul>
        </div>
    </>
  )
}
