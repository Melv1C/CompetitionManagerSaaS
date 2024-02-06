import React, { useEffect, useState } from 'react'
import axios from 'axios';
import logo from '../Assets/logo.PNG'
import './NavBar.css'
import { AuthModal } from '../AuthModal/AuthModal';
axios.defaults.withCredentials = true;


export const NavBar = () => {
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {
        axios.get('http://localhost:3000/adminAuth')
            .then((response) => {
                setUser(response.data.email);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [showModal])
    console.log(showModal)

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
                    {user === null ? <button onClick={()=>{setShowModal(true)}}>Se connecter</button>: null}
                </div>
            </div>
            {user === null ? <AuthModal show={showModal} setShow={setShowModal} /> : null}
        </>
    )
}
