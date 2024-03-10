import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { INSCRIPTIONS_URL } from '../../Gateway';
import axios from 'axios';


export const Confirmations = (props) => {
    const { id } = useParams();
    const [inscriptions, setInscriptions] = useState([]);
    useEffect(() => {
        axios.get(`${INSCRIPTIONS_URL}/${id}`).then((response) => {
            console.log(response.data);
            setInscriptions(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <div>
            <label htmlFor="athlete">N° dossard ou nom :</label>
            <input type="text" id="athlete" name="athlete" />
        </div>
    )
}



