import React, {useState, useEffect} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import './Input.css';

export const Email = ({email, setEmail}) => {
    return (
        <div className="email-container">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required/>
        </div>
    )
}

export const Password = ({password, setPassword}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="password-container">
            <label htmlFor="password">Mot de passe</label>
            <div className="password-input">
                <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required/>
                {showPassword ? 
                    <FontAwesomeIcon icon={faEyeSlash} onClick={() => setShowPassword(false)} />
                    :
                    <FontAwesomeIcon icon={faEye} onClick={() => setShowPassword(true)} />
                }
            </div>
        </div>
    )

}

export const PasswordConfirm = ({password2, setPassword2}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="password-container">
            <div className="password-input">
                <input type={showPassword ? "text" : "password"} id="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Confirmer mot de passe" required/>
                {showPassword ? 
                    <FontAwesomeIcon icon={faEyeSlash} onClick={() => setShowPassword(false)} />
                    :
                    <FontAwesomeIcon icon={faEye} onClick={() => setShowPassword(true)} />
                }
            </div>
        </div>
    )

}
