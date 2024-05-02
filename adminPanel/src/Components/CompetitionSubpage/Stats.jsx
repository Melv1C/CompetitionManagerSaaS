import {React, useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { INSCRIPTIONS_URL, COMPETITIONS_URL, INSCRIPTIONS_ADMIN_URL } from '../../Gateway';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';

import { PieChart } from '../PieChart/PieChart'
import { LinearGraph } from '../LinearGraph/LinearGraph'

import './styles/Stats.css'

function sortInscriptions(inscriptions, dataName) {
    if (dataName === 'Nouveaux athlètes par jour') {
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
        console.log(OneInsc);
        return OneInsc;
    }
    return inscriptions;
}

export const Stats = ({competition, user}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inscriptions, setInscriptions] = useState([]);
    const [categories, setCategories] = useState({});
    const [clubs, setClubs] = useState({});
    const dataNameOptions = ['Inscription par jour', '€ par jour', 'Nouveaux athlètes par jour'];
    const randomIndexName = Math.floor(Math.random() * dataNameOptions.length);
    const [dataName, setDataName] = useState(dataNameOptions[randomIndexName]);
    const typeOptions = ['bar', 'line'];
    const randomIndexType = Math.floor(Math.random() * typeOptions.length);
    console.log(typeOptions[randomIndexType]);
    console.log(dataNameOptions[randomIndexName]);
    const [type, setType] = useState(typeOptions[randomIndexType]);


    useEffect(() => {
        let categoriesDic = {};
        let clubsDic = {};
        let alreadyCountAth = []
        for (let inscription of inscriptions) {
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
        setCategories(categoriesDic);
        setClubs(clubsDic);
        console.log(inscriptions);
    }, [inscriptions]);

    useEffect(() => {
        axios.get(`${INSCRIPTIONS_ADMIN_URL}/${id}`)
        .then((response) => {
            setInscriptions(response.data.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);
    


    return (
        <div className='stats-page'>
            <div>
                Revenue brut : {
                    inscriptions.reduce((acc, inscription) => acc + inscription.cost, 0)
                }€
            </div>
            <div className="card linear-graph">
                <LinearGraph inscriptions={sortInscriptions(inscriptions, dataName)} type={type} dataName={dataName}/>
            </div>
            {/* <div className="card linear-graph">
                <div className='center title'>Revenue par jour:</div>
                <LinearMoney inscriptions={inscriptions}/>
            </div>
            <div className="card linear-graph">
                <div className='center title'>Revenue:</div>
                <LinearMoneyAcc inscriptions={inscriptions}/>
            </div>
            <div className="card linear-graph">
                <div className='center title'>Inscriptions par jour:</div>
                <InscriptionsPerDay inscriptions={inscriptions}/>
            </div>
            <div className="card linear-graph">
                <div className='center title'>Inscriptions:</div>
                <InscriptionsPerDayAcc inscriptions={inscriptions}/>
            </div>
            <div className="card linear-graph">
                <div className='center title'>Nouveaux athlètes par jour:</div>
                <InscriptionsPerDay inscriptions={OneInscAth}/>
            </div>
            <div className="card linear-graph">
                <div className='center title'>Nouveaux athlètes:</div>
                <InscriptionsPerDayAcc inscriptions={OneInscAth}/>
            </div>
            <div className="card pie-chart">
                <div className='center title'>Athlètes par cathégorie:</div>
                <PieChart data={categories}/>
            </div>
            <div className="card pie-chart">
                <div className='center title'>Athlètes par club:</div>
                <PieChart data={clubs}/>
            </div> */}
        </div>
    );
};