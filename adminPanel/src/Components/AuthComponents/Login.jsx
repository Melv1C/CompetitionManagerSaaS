import { useState,React } from 'react';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Firebase';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password).catch((error) => {
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

    return(
        <div className='login'>
            <h2>Se connecter</h2>
            <form onSubmit={handleLogin}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}} required/>
                <label htmlFor="password">Mot de passe</label>
                <input type="password" iname="password" placeholder="Mot de passe" value={password} onChange={(e)=>{setPassword(e.target.value)}} required/>
                <button type="submit">Se connecter</button>
            </form>
            <p className="error">{error}</p>
        </div>
    )
}



