import React from 'react'

import './Footer.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

export const Footer = () => {
  return (
    <div className='footer'>
        <div className='footer-content'>
            <div className='left'>

                <div className='title'>
                    Contactez-nous
                </div>
                <div className='email'>
                    <FontAwesomeIcon icon={faEnvelope} /> {" "}
                    <a href='mailto:claeswebcreations@gmail.com'>claeswebcreations@gmail.com</a>
                </div>
                <div className='certification'>
                    <span>©  </span> 2024 ClaesWeb - Tous droits réservés
                </div>
            </div>
            <div className='right'>

                <div className='title'>
                    Equipe
                </div>
                <div className='name'>
                    <ul>
                        <li>
                            <p>Claes Melvyn</p>
                            <div className='social'>
                                <a href='https://www.linkedin.com/in/melvyn-claes-187820225/?originalSubdomain=be'><FontAwesomeIcon icon={faLinkedin} /></a>
                            </div>
                        </li>
                        <li>
                            <p>Claes Riwan</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}
