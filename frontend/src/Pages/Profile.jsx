import React from 'react'

import {auth} from '../Firebase'

export const Profile = () => {

    if (!auth.currentUser) {
        window.location.replace("/");
    }

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

    return (
        <div className="page">
            <h1>Profile</h1>
            <button onClick={handleLogout}>Se déconnecter</button>
        </div>
    )
}
