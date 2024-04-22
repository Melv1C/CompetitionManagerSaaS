import React from 'react'
import './AuthModal.css'

import { Email, Password } from './Input';

import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../Firebase';

export const LoginModal = (props) => {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [error, setError] = React.useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log(user);

            props.setShow(false);
            // ...
        })
        .catch((error) => {
            console.log(error);
            if (error.code === "auth/wrong-password") {
                setError("Mot de passe incorrect");
            } else if (error.code === "auth/user-not-found") {
                setError("Utilisateur non trouvé");
            } else {
                setError("Une erreur s'est produite");
            }
        });
    }

    const handleForgotPassword = () => {
        // get email from an alert
        const input = prompt("Veuillez entrer votre email");
        if (input === null) {
            alert("Email invalide");
            return;
        }
        sendPasswordResetEmail(auth, input)
        .then(() => {
            alert("Email de réinitialisation envoyé");
        })
        .catch((error) => {
            console.log(error);
            if (error.code === "auth/user-not-found") {
                setError("Utilisateur non trouvé");
            } else {
                setError("Une erreur s'est produite");
            }
        });
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={()=>{props.setShow(false)}}>&times;</span>
                <h2>Se connecter</h2>
                <form onSubmit={handleLogin}>
                    <Email email={email} setEmail={setEmail} />
                    <Password password={password} setPassword={setPassword} />
                    <button type="submit">Se connecter</button>
                </form>

                <p className="error">{error}</p>

                <p>Vous avez oublié votre mot de passe ? <a onClick={handleForgotPassword}>Mot de passe oublié</a></p>

                <p>Vous n'avez pas de compte ? <a onClick={()=>{props.setLogin(false)}}>S'inscrire</a></p>
            </div>
        </div>
    )
}
