import React from 'react'
import axios from 'axios';
import { INSCRIPTIONS_ADMIN_URL } from '../../Gateway';

import './styles/desinscList.css';







function sortInscriptions(inscriptions) {
    return inscriptions.sort((a, b) => {
        const DateA = new Date(a.timestamp);
        const DateB = new Date(b.timestamp);
        if (DateA < DateB) {
            return -1;
        }
        if (DateA > DateB) {
            return 1;
        }
        return 0;
    });
}

export const DesinscList = ({id, setShowModalDesinsc, user, inscriptions, setInscriptions}) => {
    if (inscriptions.length === 0) {
        return (
            <div className='padding margin scrollable with100'>
                <h2 className='marginBottom40 center'>Liste des désinscriptions</h2>
                <div className=''>
                    <div className='displayRow borderBottom padding'>
                        <div className='width50'>Aucune désinscription</div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className='padding margin scrollable with100'>
            <h2 className='marginBottom40 center'>Liste des désinscriptions</h2>
            <div className='listDesinsc'>
                {sortInscriptions(inscriptions).map((inscription) => {
                    return (
                        <div key={inscription._id} className='desinscription-item'>
                            <div className='desinscription-item-bib'>{inscription.bib}</div>
                            <div className='desinscription-item-name'>{inscription.athleteName}</div>
                            <div className='desinscription-item-club'>{inscription.club}</div>
                            <div className='desinscription-item-event'>{inscription.event}</div>
                            <div className='desinscription-item-cost'>{inscription.cost}€</div>
                            <div className='desinscription-item-restore'>
                                <button className="deleteBtn" onClick={
                                    () => {
                                        axios.put(`${INSCRIPTIONS_ADMIN_URL}/${id}/${inscription._id}/restore/${user.uid}`).then((response) => {
                                            setInscriptions(response.data.data);
                                        }).catch((error) => {
                                            console.log(error);
                                        });
                                    }
                                }>Restaurer</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};