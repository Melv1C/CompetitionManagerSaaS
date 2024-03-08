import React from 'react'
import logo from '../Assets/logo.PNG'
import './NavBar.css'

import { signOut } from 'firebase/auth'

import { auth } from '../../Firebase'


export const NavBar = (props) => {
    return (
        <>
            <div className='navbar'>
                <div className='navbar-logo'>
                    <img src={logo} alt="logo" />
                    <label>Admin panel</label>
                </div>
                <div className='navbar-login-user'>
                    {props.user !== null && props.user?.uid !== undefined ? <button onClick={()=>{signOut(auth)}}>Se déconnecter</button>: null}
                </div>
            </div>
        </>
    )
}
