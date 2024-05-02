import React from 'react'
import axios from 'axios';
import { INSCRIPTIONS_ADMIN_URL } from '../../Gateway';

function sortInscriptions(inscriptions) {
    return inscriptions.sort((a, b) => {
        const AName = a.athleteName.toLowerCase();
        const BName = b.athleteName.toLowerCase();
        if (AName < BName) {
            return -1;
        }
        if (AName > BName) {
            return 1;
        }
        return 0;
    });
}

export const DeleteInscrAlert = ({id, setShowModalDelete, user, inscription, inscriptions, setInscriptions}) => {
    return (
        <div className='padding margin'>
            <h2 className='marginBottom40'>Etes vous sur de vouloir supprimer cette inscription ?</h2>
            <div className='displayRow'>
                <div className='width50'>
                    <button className="deleteBtn" onClick={() => {
                        axios.delete(`${INSCRIPTIONS_ADMIN_URL}/${id}/${inscription._id}/${user.uid}`)
                            .then((response) => {
                                inscriptions = inscriptions.filter((i) => i._id !== inscription._id);
                                setInscriptions(sortInscriptions(inscriptions));
                                setShowModalDelete(false);
                            })
                            .catch((error) => {
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