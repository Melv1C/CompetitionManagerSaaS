import React from 'react'
import axios from 'axios';
import { COMPETITIONS_URL } from '../../Gateway';


export const BasicAlert = ({error, setReturn}) => {

    return (
        <div className='padding margin'>
            <h2 className='marginBottom40'>{error}</h2>
            <div className='displayRow'>
                <div className='width50'>
                    <button className="greenBtn" onClick={() => {
                        setReturn(true);
                    }}>Continuer</button>
                </div>
                <div className='width50'>
                    <button className='greyBtn right' onClick={() => {
                        setReturn(false);
                    }}>Annuler</button>
                </div>
            </div>
        </div>
    );
};