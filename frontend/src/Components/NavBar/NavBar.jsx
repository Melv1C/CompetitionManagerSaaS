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

    const [menuOpen, setMenuOpen] = useState(false);

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

                <div className={menuOpen ? 'navbar-burger open' : 'navbar-burger'} onClick={() => { setMenuOpen(!menuOpen) }}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div className={menuOpen ? 'navbar-menu open' : 'navbar-menu'}>
                    <ul>
                        <li><Link to='/'>Accueil</Link> {menu==="home" ? <hr/> : null}</li>
                        <li><Link to='/competitions'>Competitions</Link> {menu==="competitions" ? <hr/> : null}</li>
                        {user ? <li><Link to='/profile'>Mon compte</Link> {menu==="profile" ? <hr/> : null}</li> : null}
                    </ul>
                    <div className='navbar-login-user'>
                        {!user ? 
                        <button onClick={()=>{setShowModal(true)}}>Se connecter</button>
                        : null
                        }
                    </div>
                </div>

            </div>
            <AuthModal show={showModal} setShow={setShowModal} />
        </>
    )
}
