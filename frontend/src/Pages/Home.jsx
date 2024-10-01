import React, { useState } from 'react'

import { Link } from 'react-router-dom'

import './Landing.css'


export const Home = () => {

    const [showPopup, setShowPopup] = useState(true)

    return (
        <div className="landing-page" onClick={() => setShowPopup(false)}>
            {/* <PopUpInfo showPopup={showPopup} setShowPopup={setShowPopup} /> */}
            <h1>Bienvenue sur Competition Management !</h1>
            <Link to="/competitions" className="btn">Voir les compétitions</Link>
        </div>
    )
}

function PopUpInfo({ showPopup, setShowPopup }) {
    return (
        <div className={`popup-info ${showPopup ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="close" onClick={() => setShowPopup(false)}>X</div>
            <p>Bienvenue sur le tout nouveau site de "Competition Management" !</p>
            <p>Grâce à ce site, vous pourrez vous inscrire à des compétitions d'athlétisme, consulter l'horaire des compétitions, les participants, ...</p>
            <p>Pour vous inscrire à une compétition, il vous sera demandé de vous connecter ou de créer un compte.</p>
            {/*<p>!!! Attention, tous les comptes créés sur notre ancien site ont été supprimés. Vous devrez donc créer un nouveau compte.</p>*/}
            <p>!!! Attention, tous les comptes crées sur notre ancien site sont toujours valables. Si vous ne vous souvenez plus de votre mot de passe, vous pouvez le réinitialiser en cliquant sur "Se connecter" puis "Mot de passe oublié".</p>
            <p>N'hésitez pas à nous contacter si vous avez des questions, des suggestions, ou si vous rencontrez des problèmes.</p>
            <p>Bonne visite !</p>
        </div>
    )
}
