import React, { useEffect, useState } from 'react'
import axios from 'axios';
import logo from '../Assets/logo.PNG'
import './NavBar.css'
import { AuthModal } from '../AuthModal/AuthModal';
axios.defaults.withCredentials = true;


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
                    {props.user.email === null ? <button onClick={()=>{setShowModal(true)}}>Se connecter</button>: null}
                    {props.user.email !== null ? <button onClick={()=>{
                        axios.post('http://localhost:3000/adminAuth/logout').then((response) => {
                            props.setLoading(false);
                        }).catch((error) => {
                            console.log(error);
                        });
                    }}>Se déconnecter</button>: null}
                </div>
            </div>
            {props.user.email === null ? <AuthModal show={showModal} setShow={setShowModal} loading={props.loading} setLoading={props.setLoading}/> : null}
        </>
    )
}
