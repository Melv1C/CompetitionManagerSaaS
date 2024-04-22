import React from 'react'
import './AuthModal.css'

import { Email, Password, PasswordConfirm } from './Input';

import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
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
                // send verification email
                sendEmailVerification(user)

                props.setShow(false);

                // alert user to verify email
                alert("Afin de finaliser la création de votre compte, veuillez vérifier votre compte en cliquant sur le lien envoyé à votre adresse email");

                // redirect to profile page
                window.location.href = "/profile";
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
                    <Email email={email} setEmail={setEmail} />
                    <Password password={password} setPassword={setPassword} />
                    <PasswordConfirm password2={password2} setPassword2={setPassword2} />
                    <button type="submit">S'inscrire</button>
                </form>

                <p className="error">{error}</p>

                <p>Vous avez déjà un compte ? <a href='#' onClick={()=>{props.setLogin(true)}}>Se connecter</a></p>
            </div>
        </div>
    )
}
