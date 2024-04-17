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

    const [menu, setMenu] = useState("");

    const [user, setUser] = useState(false);

    const [burger, setBurger] = useState(false)

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(true);
            } else {
                setUser(false);
            }
        })
    }, [])

    useEffect(() => {
        const list_path = path.split("/");
        if (list_path.length == 2) {
            setMenu(list_path[1] === "" ? "home" : list_path[1]);
        } else {
            setMenu("");
        }
    }, [path])

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className='navbar'>
                <div className='navbar-logo'>
                    <img src={logo} alt="logo" />
                </div>

                <div className={`burger ${burger ? 'open' : 'close'}`} onClick={() => setBurger(!burger)}>
                    <div className='burger-bar'></div>           
                    <div className='burger-bar'></div>           
                    <div className='burger-bar'></div>           
                </div>

                <div className={`navbar-menu ${burger ? 'open' : 'close'}`}>
                    <ul>
                        <li onClick={() => setBurger(false)}><Link to='/'>Accueil</Link> {menu==="home" ? <hr/> : null}</li>
                        <li onClick={() => setBurger(false)}><Link to='/competitions'>Competitions</Link> {menu==="competitions" ? <hr/> : null}</li>
                        {user ? <li onClick={() => setBurger(false)}><Link to='/profile'>Mon compte</Link> {menu==="profile" ? <hr/> : null}</li> : null}
                    </ul>
                    <div className='navbar-login-user'>
                        {!user ? 
                        <button onClick={()=>{setBurger(false); setShowModal(true)}}>Se connecter</button>
                        : null
                        }
                    </div>
                </div>

            </div>
            <AuthModal show={showModal} setShow={setShowModal} />
        </>
    )
}
