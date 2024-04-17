import { React } from 'react';

import { Login } from '../Components/AuthComponents/Login';
import { Register } from '../Components/AuthComponents/Register';

import './styles/Auth.css';



export const Auth = () => {
    return(
        <div className="auth">
            <Login/>
            <Register/>
        </div>
    )
}







