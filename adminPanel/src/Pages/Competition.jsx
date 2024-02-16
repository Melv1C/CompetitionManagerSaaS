import React, { useEffect,useState } from 'react'
import { useParams} from 'react-router-dom';
import { Popup } from '../Components/Popup/Popup';
import { CompetitionInfo } from '../Components/CompetitionInfo/CompetitionInfo';
import { EventInfo } from '../Components/EventInfo/EventInfo';
import { EventsList } from '../Components/EventsList/EventsList';

import { getCompetition } from '../CompetitionsAPI';
import './Competition.css';

export const Competition = (props) => {
    const { id } = useParams();
    const [competition, setCompetition] = useState(null);
    const [showModalModif, setShowModalModif] = useState(false);
    const [showModalAddEvent, setShowModalAddEvent] = useState(false);
    const [showModalModifEvent, setShowModalModifEvent] = useState(false);
    const [event, setEvent] = useState(null);
    useEffect(() => {
        getCompetition(id, setCompetition);
    }, [id]);

    if (!competition) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <h1>{competition.name}</h1>
            <div className='upperPageCompetInfo'>
                <div className='competDivInfo'>
                    <h2>Info</h2>
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
                            window.location.href = `/competitions/${id}/inscriptions`;
                        }
                    }>Inscrire des athlètes</button>
                </div>
            </div>
            <div className='eventDiv'>
                <h2>Épreuves</h2>
                <EventsList competition={competition} setCompetition={setCompetition} setShowModal={setShowModalModifEvent} setEvent={setEvent}/>
                <button onClick={() => {setShowModalAddEvent(true);}}>Ajouter une épreuves</button>
            </div>
            {showModalModif ? <Popup onClose={()=>{setShowModalModif(false)}}><CompetitionInfo user={props.user} setUser={props.setUser} competition={competition} setCompetition={setCompetition} setShowModal={setShowModalModif}/></Popup> : null}
            {showModalAddEvent ? <Popup onClose={()=>{setShowModalAddEvent(false)}}><EventInfo competition={competition} setCompetition={setCompetition} setShowModal={setShowModalAddEvent}/></Popup> : null}
            {showModalModifEvent ? <Popup onClose={()=>{setShowModalModifEvent(false)}}><EventInfo competition={competition} setCompetition={setCompetition} setShowModal={setShowModalModifEvent} event={event}/></Popup> : null}
        </>
    );
};