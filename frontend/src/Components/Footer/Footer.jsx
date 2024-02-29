import React from 'react'

import './Footer.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'

export const Footer = () => {
  return (
    <div className='footer'>
        <div className='footer-content'>
            <div className='left'>
                <div className='text'>
                    Ce site a été réalisé par 2 étudiants universitaires. Il a évolué depuis sa première version en 2020 et nous continuons à l'améliorer pour vous offrir une expérience de qualité ainsi que pour apprendre de nouvelles technologies.
                </div>
                <div className='certification'>
                    <span>©  </span> 2023 ClaesWeb - Tous droits réservés
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

                <div className='title'>
                    Contactez-nous
                </div>
                <div className='email'>
                    <a href='mailto:claesweb@gmail.com'>claesweb@gmail.com</a>
                </div>
            </div>
        </div>
    </div>
  )
}
