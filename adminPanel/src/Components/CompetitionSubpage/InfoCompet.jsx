import React, { useEffect,useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Popup } from '../Popup/Popup';
import { CompetitionInfo } from '../CompetitionInfo/CompetitionInfo';
import { openCompetition } from '../../CompetitionsAPI';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import { INSCRIPTIONS_URL } from '../../Gateway';


export const InfoCompet = ({competition, user, setCompetition}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showModalModif, setShowModalModif] = useState(false);

    const downloadFile = (data, fileName) => {
        const blob = new Blob([data], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className='upperPageCompetInfo'>
                <div className='competDivInfo'>
                    <h2>Infos</h2>
                    <ul className="overview">
                        <li><strong>Date:</strong> {new Date(competition.date).toLocaleDateString("fr-FR")}</li>
                        <li><strong>Cloture des inscriptions:</strong> {new Date(competition.closeDate).toLocaleDateString("fr-FR")}</li>
                        <li><strong>Lieu:</strong> {competition.location} ({competition.club})</li>
                        {competition.schedule ? <li><strong>Horaire:</strong> <a href={competition.schedule} target="_blank" rel="noreferrer">Voir l'horaire</a></li> : <li><strong>Horaire:</strong> Aucun</li>}
                        {competition.paid ? <li><strong>Payant:</strong> Oui</li> : <li><strong>Payant:</strong> Non</li>}
                        {competition.freeClub ? <li><strong>Gratuit pour les clubs:</strong> {competition.freeClub?"Oui":"Non"}</li> : null}
                        {competition.description ? <li><strong>Description:</strong> {competition.description}</li> : <li><strong>Description:</strong> Aucune</li>}
                    </ul>
                    <button className='orangeBtn infoModif' onClick={() => {setShowModalModif(true);}}>Modifier</button>
                </div>
                <div className='competDivInfo center'>
                    <div className='margin center'>
                        <label>Ouvrir les inscriptions</label>
                        <Switch checked={competition.open} onChange={
                            () => {
                                const body = {
                                    adminId: user.uid,
                                }
                                openCompetition(competition, setCompetition, body);
                            }
                        }/>
                    </div>
                    <div className='margin center'>
                        <label>Copier les mails des participants</label>
                        <button className='' onClick={(e) => {
                            //change the innnerHTML of the button to "copié"
                            e.target.innerHTML = "Copié !!!";
                            setTimeout(() => {
                                e.target.innerHTML = "Copier";
                            }, 1000);
                            navigator.clipboard.writeText("todo");
                        }}>Copier</button>
                    </div>
                    <div className='margin center'>
                        <label>Télécharger le ficher des inscritpions</label>
                        <button className='' onClick={(e) => {
                            axios.get(`${INSCRIPTIONS_URL}/${id}/`).then((response) => {
                                const inscriptions = response.data.data;
                                let fileData = "";
                                inscriptions.forEach((inscription) => {
                                    fileData += `${inscription.athleteId};${inscription.bib};${inscription.athleteName};${inscription.club};${inscription.event};${inscription.record}\n`;
                                });
                                downloadFile(fileData, `inscriptions_${competition.name}.csv`);
                            }).catch((error) => {
                                console.log(error);
                            });
                        }}>Télécharger</button>
                    </div>
                </div>
            </div>
            {showModalModif ? <Popup onClose={()=>{setShowModalModif(false)}}><CompetitionInfo user={user} competition={competition} setCompetition={setCompetition} setShowModal={setShowModalModif}/></Popup> : null}
        </>
    );
};