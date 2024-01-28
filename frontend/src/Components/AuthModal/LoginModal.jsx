import React from 'react'
import './AuthModal.css'

import { signInWithEmailAndPassword } from 'firebase/auth';
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

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={()=>{props.setShow(false)}}>&times;</span>
                <h2>Se connecter</h2>
                <form onSubmit={handleLogin}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}} required/>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" id="password" name="password" placeholder="Mot de passe" value={password} onChange={(e)=>{setPassword(e.target.value)}} required/>
                    <button type="submit">Se connecter</button>
                </form>

                <p className="error">{error}</p>

                <p>Vous n'avez pas de compte ? <a onClick={()=>{props.setLogin(false)}}>S'inscrire</a></p>
            </div>
        </div>
    )
}
