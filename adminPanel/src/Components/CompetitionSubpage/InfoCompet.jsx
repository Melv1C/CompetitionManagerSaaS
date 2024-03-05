import React, { useEffect,useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Popup } from '../Popup/Popup';
import { CompetitionInfo } from '../CompetitionInfo/CompetitionInfo';
import { EventsList } from '../EventsList/EventsList';


export const InfoCompet = ({competition, user, setCompetition}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showModalModif, setShowModalModif] = useState(false);

    return (
        <>
            <div className='upperPageCompetInfo'>
                <div className='competDivInfo'>
                    <h2>Infos</h2>
                    <ul className="overview">
                        <li><strong>Date:</strong> {new Date(competition.date).toLocaleDateString("fr-FR")}</li>
                        <li><strong>Cloture des inscriptions:</strong> {new Date(competition.date).toLocaleDateString("fr-FR")}</li>
                        <li><strong>Lieu:</strong> {competition.location} ({competition.club})</li>
                        {competition.schedule ? <li><strong>Horaire:</strong> <a href={competition.schedule} target="_blank" rel="noreferrer">Voir l'horaire</a></li> : <li><strong>Horaire:</strong> Aucun</li>}
                        {competition.paid ? <li><strong>Payant:</strong> Oui</li> : <li><strong>Payant:</strong> Non</li>}
                        {competition.freeClub ? <li><strong>Gratuit pour les clubs:</strong> {competition.freeClub?"Oui":"Non"}</li> : null}
                        {competition.description ? <li><strong>Description:</strong> {competition.description}</li> : <li><strong>Description:</strong> Aucune</li>}
                    </ul>
                    <button className='greenBtn infoModif' onClick={() => {setShowModalModif(true);}}>Modifier</button>
                </div>
                <div className='upperPageCompetBtn'>
                    <button className='greenBtn' onClick={
                        () => {
                            navigate(`/competitions/${id}/inscriptions`);
                        }
                    }>Inscrire des athlètes</button>
                </div>
            </div>
            <div className='eventDiv'>
                <h2>Épreuves</h2>
                <EventsList competition={competition}/>
                <button onClick={() => {
                    navigate(`/competitions/${id}/addEvent`)
                }}>Ajouter une épreuves</button>
            </div>
            {showModalModif ? <Popup onClose={()=>{setShowModalModif(false)}}><CompetitionInfo user={user} competition={competition} setCompetition={setCompetition} setShowModal={setShowModalModif}/></Popup> : null}
        </>
    );
};