import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { ATLHETES_URL, COMPETITIONS_URL } from "../../Gateway";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

import './InscriptionMulti.css';

import { useParams } from 'react-router-dom';





export const InscriptionMulti = (props) => {
    const { id } = useParams();
    const [separator, setSeparator] = useState("\t");
    const [data, setData] = useState("");
    const [dataList, setDataList] = useState([]);
    const [errors, setErrors] = useState([]);
    const [errorsVerif, setErrorsVerif] = useState([]);

    function handleDataChange(data) {
        const newErrors = [];
        const newData = data.split("\n");
        const newDatalist = [];
        for (let i = 0; i < newData.length; i++) {
            if (newData[i].length === 0) {
                continue;
            }
            const line = newData[i].split(separator);
            if (line.length !== 3) {
                newErrors.push({text:`La ligne ${i + 1} ne contient pas 3 éléments`,gravity:1});
            }else{
                newDatalist.push({name:line[0],event:line[1],record:line[2]});
            }
        }
        setDataList(newDatalist);
        setErrors(newErrors);
    }

    useEffect(() => {
        handleDataChange(data);
    }, [data,separator])

    async function verifData(){
        const athletes = {};
        const validEvents = {};
        for (let i = 0; i < dataList.length; i++) {
            let find = true;
            if (!athletes[dataList[i].name]) {
                find = false;
                await axios.get(`${ATLHETES_URL}?key=${dataList[i].name}`).then(res => {
                    const filteredAthletes = res.data.data.filter(athlete => {
                        return athlete.bib !== null;
                    })
                    if (filteredAthletes.length === 0) {
                        setErrorsVerif(errorsVerif => [...errorsVerif,{text:`Ligne ${i+1} Aucun athlète trouvé pour ${dataList[i].name}`,gravity:1}]);
                    }else if (filteredAthletes[0].firstName + ' ' + filteredAthletes[0].lastName !== dataList[i].name) {
                        setErrorsVerif(errorsVerif => [...errorsVerif,{text:`Ligne ${i+1} Nom non-exact : trouvé ${filteredAthletes[0].firstName + ' ' + filteredAthletes[0].lastName}(${filteredAthletes[0].bib}) pour ${dataList[i].name}`,gravity:3}]);
                        athletes[dataList[i].name] = filteredAthletes[0];
                        find = true;
                    }else{
                        athletes[dataList[i].name] = filteredAthletes[0];
                        find = true;
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
            if (!find) {
                continue;
            }
            if (!validEvents[athletes[dataList[i].name].category]) {
                find = false;
                await axios.get(`${COMPETITIONS_URL}/${id}/events?category=${athletes[dataList[i].name].category}`).then(res => {
                    console.log(res);
                    if (res.data.data.length === 0) {
                        setErrorsVerif(errorsVerif => [...errorsVerif,{text:`Ligne ${i+1} Aucune épreuve possible pour ${athletes[dataList[i].name].firstName+ ' ' + athletes[dataList[i].name].lastName}(${athletes[dataList[i].name].category})`,gravity:1}]);
                    }else{
                        validEvents[athletes[dataList[i].name].category] = res.data.data;
                        find = true;
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
            if (!find) {
                continue;
            }
            console.log(validEvents);
            const event = validEvents[athletes[dataList[i].name].category].find(event => event.name === dataList[i].event || event.pseudoName === dataList[i].event);
            if (!event) {
                setErrorsVerif(errorsVerif => [...errorsVerif,{text:`Ligne ${i+1} Epreuve ${dataList[i].event} non-trouvé pour ${athletes[dataList[i].name].firstName+ ' ' + athletes[dataList[i].name].lastName}(${athletes[dataList[i].name].category})`,gravity:1}]);
            }
            //to continue
        }
    }



    return (
        <div>
            <div>
                <h1>Inscription Multi</h1>
                <h2>Nom/nom epreuve/record</h2>
                <label>Separateur</label>
                <select name="separator" onChange={(event) => {
                    setSeparator(event.target.value);
                }}>
                    <option value="\t">Tabulation (\t)</option>
                    <option value=",">Virgule (,)</option>
                    <option value=";">Point-virgule (;)</option>
                </select>
            </div>
            <div className="Error">
                {errors.map((error, index) => {
                    return (
                        <p key={index} className={`errorMsg gravity-${error.gravity}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle} className='exclamationIcon'/>
                            {error.text}
                        </p>
                    )
                })}
                {errorsVerif.map((error, index) => {
                    return (
                        <p key={index} className={`errorMsg gravity-${error.gravity}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle} className='exclamationIcon'/>
                            {error.text}
                        </p>
                    )
                })}
            </div>
            <div>
                <textarea name="data" cols="30" rows="10" onChange={(event) => {setData(event.target.value);}}></textarea>
                <button onClick={verifData}>Verifier</button>
            </div>
        </div>
    )
}