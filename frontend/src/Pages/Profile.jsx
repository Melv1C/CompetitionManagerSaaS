import React, { useEffect, useState } from 'react'

import axios from 'axios'
import { INSCRIPTIONS_URL } from '../Gateway'

import {auth} from '../Firebase'

import { ProfileInscriptions } from '../Components/ProfileInscriptions/ProfileInscriptions'

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

    function addToDict(dict, competitionId, athleteId, value) {
        if (dict[competitionId]) {
            if (dict[competitionId][athleteId]) {
                dict[competitionId][athleteId].push(value);
            } else {
                dict[competitionId][athleteId] = [value];
            }
        } else {
            dict[competitionId] = {};
            dict[competitionId][athleteId] = [value];
        }
    }

    useEffect(() => {
        // fetch inscriptions
        if (!user) return;
        axios.get(`${INSCRIPTIONS_URL}?userId=${user.uid}`)
        .then((response) => {

            let modifiedInscriptions = {};

            for (let inscription of response.data.data) {
                if (inscription.eventType !== "subEvent") {
                    addToDict(modifiedInscriptions, inscription.competitionId, inscription.athleteId, inscription);
                }
            }

            setInscriptions(modifiedInscriptions);
        })
        .catch((error) => {
            console.log(error);
        })
    }, [user])
    
    console.log(inscriptions);

    return (
        <div className="page">
            <div className="account-info">
                <h1>Mon compte</h1>

                <h2>Informations personnelles</h2>
                <p>Email: {user?.email}</p>
                {user?.emailVerified ? null
                    : <p>
                        Votre email n'est pas vérifié. 
                        <button onClick={() => {user?.sendEmailVerification()}}>Renvoyer l'email de vérification</button>
                    </p>
                }

                <button onClick={handleLogout} className="logout-btn">Se déconnecter</button>
                {/*<button>Modifier mon mot de passe</button>*/}
            </div>
            <div className="inscriptions">
                <h2>Mes inscriptions</h2>
                <ProfileInscriptions inscriptions={inscriptions} />
            </div>
            
        </div>
    )
}



