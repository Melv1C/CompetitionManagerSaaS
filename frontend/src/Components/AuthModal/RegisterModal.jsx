import React from 'react'
import './AuthModal.css'

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Firebase';



export const RegisterModal = (props) => {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [password2, setPassword2] = React.useState("");

    const [error, setError] = React.useState("");

    const handleRegister = (e) => {
        e.preventDefault();

        if (password === password2) {
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                console.log(user);
                // ...
            })
            .catch((error) => {
                console.log(error);
                if (error.code === "auth/email-already-in-use") {
                    setError("Email déjà utilisé");
                } else if (error.code === "auth/invalid-email") {
                    setError("Email invalide");
                } else if (error.code === "auth/weak-password") {
                    setError("Mot de passe trop faible");
                } else {
                    setError("Une erreur s'est produite");
                }
            });
        } else {
            console.log("Passwords are not the same");
            setError("Les mots de passe ne sont pas identiques");
        }
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={()=>{props.setShow(false)}}>&times;</span>
                <h2>S'inscrire</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}} required/>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" id="password" name="password" placeholder="Mot de passe" value={password} onChange={(e)=>{setPassword(e.target.value)}} required/>
                    <input type="password" id="password2" name="password2" placeholder="Confirmer le mot de passe" value={password2} onChange={(e)=>{setPassword2(e.target.value)}} required/>
                    <button type="submit">S'inscrire</button>
                </form>

                <p className="error">{error}</p>

                <p>Vous avez déjà un compte ? <a href='#' onClick={()=>{props.setLogin(true)}}>Se connecter</a></p>
            </div>
        </div>
    )
}
