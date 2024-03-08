import React, { useEffect, useState } from 'react'

import axios from 'axios'
import { INSCRIPTIONS_URL } from '../Gateway'

import { formatRecord } from '../RecordsHandler'

import {auth} from '../Firebase'
import { redirect } from 'react-router-dom'

export const Profile = () => {

    const [user, setUser] = useState(null);

    const [inscriptions, setInscriptions] = useState([]);

    const handleLogout = () => {
        auth.signOut()
        .then(() => {
            // Sign-out successful.
            console.log("Sign-out successful.");
            window.location.replace("/");
        }).catch((error) => {
            // An error happened.
            console.log(error);
        });
    }

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
            } else {
                window.location.replace("/");
            }
        })
    }, [])

    useEffect(() => {
        // fetch inscriptions
        if (!user) return;
        axios.get(`${INSCRIPTIONS_URL}?userId=${user.uid}`)
        .then((response) => {
            console.log(response.data);
            setInscriptions(response.data.data);
        })
        .catch((error) => {
            console.log(error);
        })
    }, [user])

    return (
        <div className="page">
            <h1>Mon compte</h1>

            <h2>Informations personnelles</h2>
            <p>Email: {user?.email}</p>
            {user?.emailVerified ? null
                : <p>
                    Votre email n'est pas vérifié. 
                    <button onClick={() => {user?.sendEmailVerification()}}>Renvoyer l'email de vérification</button>
                </p>
            }

            <button onClick={handleLogout}>Se déconnecter</button>
            <button>Modifier mon mot de passe</button>

            <h2>Mes inscriptions</h2>
            <ul>
                {inscriptions.map((inscription) => {
                    return (
                        <li key={inscription._id}>
                            <p>{inscription.competitionDate}</p>
                            <p>{inscription.competitionName}</p>
                            <p>{inscription.event}</p>
                            <p>{inscription.record}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
