import React, { useEffect, useState } from 'react'
import './NavBar.css'
import { Link } from 'react-router-dom';
import { auth } from '../../Firebase';

// import logo from '../Assets/logo.png'
import logo from '../Assets/logo.PNG'

import { AuthModal } from '../AuthModal/AuthModal';

import { useLocation } from 'react-router-dom';

export const NavBar = () => {

    const location = useLocation();
    const path = location.pathname;

    const [menu, setMenu] = useState(path.split("/")[1] === "" ? "home" : path.split("/")[1]);

    const [user, setUser] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(true);
            } else {
                setUser(false);
            }
        })
    }, [])

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className='navbar'>
                <div className='navbar-logo'>
                    <img src={logo} alt="logo" />
                </div>
                <ul className='navbar-menu'>
                    <li onClick={()=>{setMenu("home")}}><Link to='/'>Accueil</Link> {menu==="home" ? <hr/> : null}</li>
                    <li onClick={()=>{setMenu("competitions")}}><Link to='/competitions'>Competitions</Link> {menu==="competitions" ? <hr/> : null}</li>
                    {user ? <li onClick={()=>{setMenu("profile")}}><Link to='/profile'>Mon compte</Link> {menu==="profile" ? <hr/> : null}</li> : null}
                </ul>
                <div className='navbar-login-user'>
                    {!user ? 
                    <button onClick={()=>{setShowModal(true)}}>Se connecter</button>
                    : null
                    }
                </div>
            </div>
            <AuthModal show={showModal} setShow={setShowModal} />
        </>
    )
}
