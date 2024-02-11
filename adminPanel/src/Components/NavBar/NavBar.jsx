import React, { useEffect, useState } from 'react'
import logo from '../Assets/logo.PNG'
import './NavBar.css'
import { AuthModal } from '../AuthModal/AuthModal';

import { logout } from '../../Auth';


export const NavBar = (props) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <div className='navbar'>
                <div className='navbar-logo'>
                    <img src={logo} alt="logo" />
                    <label htmlFor="logo">Admin panel</label>
                </div>
                <ul className='navbar-menu'>
                </ul>
                <div className='navbar-login-user'>
                </div>
                <div className='navbar-login-user'>
                    {props.user === null ? <button onClick={()=>{setShowModal(true)}}>Se connecter</button>: null}
                    {props.user !== null ? <button onClick={()=>{logout(props)}}>Se déconnecter</button>: null}
                </div>
            </div>
            {props.user === null ? <AuthModal show={showModal} setShow={setShowModal} setUser={props.setUser}/> : null}
        </>
    )
}
