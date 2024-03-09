import React, { useEffect,useState } from 'react'
import axios from 'axios';
import { COMPETITIONS_URL } from '../../Gateway';


export const DeleteAlert = ({id, navigate, setShowModalDelete, user}) => {

    return (
        <div className='padding margin'>
            <h2 className='marginBottom40'>Etes vous sur de vouloir supprimer cette compétition ?</h2>
            <div className='displayRow'>
                <div className='width50'>
                    <button className="deleteBtn" onClick={() => {
                        console.log("delete");
                        axios.delete(`${COMPETITIONS_URL}/${id}/${user.uid}`).then(navigate('/')).catch((error) => {
                            console.log(error);
                        });
                    }}>Supprimer</button>
                </div>
                <div className='width50'>
                    <button className='greyBtn right' onClick={() => {
                        setShowModalDelete(false);
                    }}>Annuler</button>
                </div>
            </div>
        </div>
    );
};