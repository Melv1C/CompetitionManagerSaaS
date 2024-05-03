import {React, useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { INSCRIPTIONS_ADMIN_URL } from '../../Gateway';


import { PieChart } from '../PieChart/PieChart'
import { LinearGraph } from '../LinearGraph/LinearGraph'
import { Popup } from '../Popup/Popup'
import { DesinscList } from '../AlertComponent/DesinscList'

import './styles/Stats.css'

function removeDesinscription(inscriptions) {
    return inscriptions.filter((inscription) => inscription.inscribed);
}

function removeInscription(inscriptions) {
    return inscriptions.filter((inscription) => !inscription.inscribed);
}

function sortInscriptions(inscriptions, dataName) {
    if (dataName === 'Inscription par jour' || dataName === 'Athlètes par jour') {
        inscriptions = inscriptions.filter((inscription) => inscription.inscribed);
    }
    if (dataName === 'Athlètes par jour') {
        let OneInsc = [];
        let alreadyCountAth = []
        for (let inscription of inscriptions) {
            if (alreadyCountAth.includes(inscription.athleteId)) {
                continue;
            }else{
                OneInsc.push(inscription);
                alreadyCountAth.push(inscription.athleteId);
            }
        }
        return OneInsc;
    }
    return inscriptions;
}

export const Stats = ({competition, user}) => {
    const { id } = useParams();
    const [inscriptions, setInscriptions] = useState([]);
    const [categories, setCategories] = useState({});
    const [clubs, setClubs] = useState({});
    const optionsDataName = ['Inscription', 'Revenue', 'Athlète'];
    const dataNameOptions = ['Inscription par jour', '€ par jour', 'Athlètes par jour'];
    const randomIndexName = Math.floor(Math.random() * dataNameOptions.length);
    const [dataName, setDataName] = useState(dataNameOptions[randomIndexName]);
    const optionsType = ['Par jour', 'Accumulation'];
    const typeOptions = ['bar', 'line'];
    const randomIndexType = Math.floor(Math.random() * typeOptions.length);
    const [type, setType] = useState(typeOptions[randomIndexType]);
    const optionTime = ['Tous', 'Dernière semaine', 'Dernier mois'];
    const [time, setTime] = useState('Tous');
    const [nbAth, setNbAth] = useState(0);
    const [desiscritpions, setDesinscriptions] = useState([]);
    const [showModalDesinsc, setShowModalDesinsc] = useState(false);


    useEffect(() => {
        setDesinscriptions(removeInscription(inscriptions));
        let categoriesDic = {};
        let clubsDic = {};
        let alreadyCountAth = []
        for (let inscription of removeDesinscription(inscriptions)) {
            if (alreadyCountAth.includes(inscription.athleteId)) {
                continue;
            }else{
                if (categoriesDic[inscription.category] === undefined) {
                    categoriesDic[inscription.category] = {"value":1, "key":inscription.category};
                } else {
                    categoriesDic[inscription.category].value += 1;
                }
                if (clubsDic[inscription.club] === undefined) {
                    clubsDic[inscription.club] = {"value":1, "key":inscription.club};
                } else {
                    clubsDic[inscription.club].value += 1;
                }
            }
            alreadyCountAth.push(inscription.athleteId);
        }
        setNbAth(alreadyCountAth.length);
        setCategories(categoriesDic);
        setClubs(clubsDic);
    }, [inscriptions]);


    useEffect(() => {
        axios.get(`${INSCRIPTIONS_ADMIN_URL}/${id}/${user.uid}`)
        .then((response) => {
            const inscriptions = response.data.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            setInscriptions(inscriptions);
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    


    return (
        <div className='stats-page'>
            <div className='stat-card'>
                <div>
                    <div>
                        Revenue brut : {
                            inscriptions.reduce((acc, inscription) => acc + inscription.cost, 0)
                        }€
                    </div>
                    <div>
                        Nombre d'athlètes : {nbAth} 
                    </div>
                    <div>
                        Nombre d'inscriptions : {inscriptions.length}
                    </div>
                    
                </div>
                <div>
                    <div>
                        Nombre de désinscriptions : {desiscritpions.length}
                    </div>
                    <button className='BtnDesinsc' onClick={
                        () => {
                            setShowModalDesinsc(true);
                        }
                    }>Voir les désinscriptions</button>
                    {showModalDesinsc ? <Popup size={'big'} onClose={()=>{setShowModalDesinsc(false)}}><DesinscList id={id} setShowModalDesinsc={setShowModalDesinsc} user={user} inscriptions={desiscritpions} setInscriptions={setInscriptions} /></Popup> : null}
                </div>
            </div>
            <div className="card linear-graph">
                <select onChange={
                    (e) => {
                        console.log(e.target.value);
                        setDataName(e.target.value)
                    }} value={dataName}>
                    {dataNameOptions.map((option, index) => {
                        return <option key={index} value={option}>{optionsDataName[index]}</option>
                    })}
                </select>
                <select onChange={
                    (e) => {
                        setType(e.target.value);
                    }} value={type}>
                    {typeOptions.map((option, index) => {
                        return <option key={index} value={option}>{optionsType[index]}</option>
                    })}
                </select>
                <select onChange={
                    (e) => {
                        setTime(e.target.value);
                    }} value={time}>
                    {optionTime.map((option, index) => {
                        return <option key={index} value={option}>{option}</option>
                    })}
                </select>
                <LinearGraph inscriptions={sortInscriptions(inscriptions, dataName)} type={type} dataName={dataName} time={time}/>
            </div>
            <div className="card pie-chart">
                <div className='center title'>Athlètes par cathégorie:</div>
                <PieChart data={categories}/>
            </div>
            <div className="card pie-chart">
                <div className='center title'>Athlètes par club:</div>
                <PieChart data={clubs}/>
            </div>
        </div>
    );
};