import React from 'react'
import axios from 'axios';
import { CONFIRMATIONS_URL } from '../../Gateway';

export const ConfirmationError = ({id, setShowPopupErrors, errors, user, athlete, setAthlete, setInscriptions}) => {
    console.log(athlete);
    return (
        <div className='padding margin'>
            <h2 className='marginBottom40'>Attention !!!</h2>
            <div className='listErrors'>
                {errors.map((error, key) => {
                    console.log(error, key);
                    return (
                        <div key={key} className='displayRow borderBottom padding errorConf'>
                            <div className='center width100'>{error.message}</div>
                        </div>
                    );
                })}
            </div>
            <div className='displayRow'>
                <div className='width50'>
                    <button className="greenBtn" onClick={() => {
                        axios.post(`${CONFIRMATIONS_URL}/${id}/${athlete.athleteId}`,{userId:user.uid}).then((response) => {
                            setAthlete(null);
                            setInscriptions([]);
                            console.log(response);
                        }).catch((error) => {
                            console.log(error);
                        });
                        setShowPopupErrors(false);
                    }}>Continuer</button>
                </div>
                <div className='width50'>
                    <button className='greyBtn right' onClick={() => {
                        setShowPopupErrors(false);
                    }}>Annuler</button>
                </div>
            </div>
        </div>
    );
};