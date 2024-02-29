import { useState,React } from 'react';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Firebase';

export const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();
        if (password === password2) {
            createUserWithEmailAndPassword(auth, email, password).catch((error) => {
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

    return(
        <div className="register">
            <h2>S'inscrire</h2>
            <form onSubmit={handleRegister}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}} required/>
                <label htmlFor="password">Mot de passe</label>
                <input type="password" name="password" placeholder="Mot de passe" value={password} onChange={(e)=>{setPassword(e.target.value)}} required/>
                <input type="password" name="password2" placeholder="Confirmer le mot de passe" value={password2} onChange={(e)=>{setPassword2(e.target.value)}} required/>
                <button type="submit">S'inscrire</button>
            </form>
            <p className="error">{error}</p>
        </div>
    )
}