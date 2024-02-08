import React, { useEffect,useState } from 'react'
import { useParams} from 'react-router-dom';
import axios from 'axios';

export const Competition = () => {
    const { id } = useParams();
    const [competition, setCompetition] = useState(0);
    useEffect(() => {
        axios.get(`http://localhost:3001/api/competitions/${id}`)
            .then((response) => {
                setCompetition(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, [id]);



    return (
        <>
            <div>
                <h1>{competition.name}</h1>
                <ul className="overview">
                    <li><strong>Date:</strong> {new Date(competition.date).toLocaleDateString("fr-FR")}</li>
                    <li><strong>Cloture des inscriptions:</strong> {new Date(competition.date).toLocaleDateString("fr-FR")}</li>
                    <li><strong>Lieu:</strong> {competition.location} ({competition.club})</li>
                    {competition.schedule ? <li><strong>Horaire:</strong> <a href={competition.schedule} target="_blank" rel="noreferrer">Voir l'horaire</a></li> : <li><strong>Horaire:</strong> Aucun</li>}
                    {competition.paid ? <li><strong>Payant:</strong> Oui</li> : <li><strong>Payant:</strong> Non</li>}
                    {competition.freeClub ? <li><strong>Gratuit pour les clubs:</strong> {competition.freeClub}</li> : null}
                    {competition.description ? <li><strong>Description:</strong> {competition.description}</li> : <li><strong>Description:</strong> Aucune</li>}
                </ul>
                <button onClick={
                    function(){
                        //display popup
                    }
                }>Modifier</button>
            </div>
        </>
    );
};