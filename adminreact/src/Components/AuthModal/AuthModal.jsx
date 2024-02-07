import React from "react";
import './AuthModal.css';
import axios from "axios";
axios.defaults.withCredentials = true;


export const AuthModal = (props) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    
    const [error, setError] = React.useState("");
    
    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/adminAuth/login', {
            email: email,
            password: password
        }).then((response) => {
            props.setShow(false);
            props.setLoading(false);
        }).catch((error) => {
            console.log(error);
            if (error.response.status === 401) {
                setError("Mot de passe ou email incorrect");
            } else if (error.response.status === 500) {
                setError("Erreur serveur");
            }
        });  
    }
    if (!props.show) {
        return null;
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
            </div>
        </div>
    )
};