import React, {useEffect, useState} from 'react'

import { Switch } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, } from '@fortawesome/free-solid-svg-icons';

import './Results.css';

function compareResult(resultType, a, b) {
    if (resultType === 'Time') {
        // si les 2 sont négatifs (DNF, DNS, DQ, etc)
        if (a <= 0 && b <= 0) {
            return 0;
        } else if (a <= 0) {
            return 1;
        } else if (b <= 0) {
            return -1;
        } else {
            return a - b;
        }
    } else {
        return b - a;
    }
}

function GetCode(result, resultType) {
    switch (resultType) {
        case 'Time':
            switch (result) {
                case -1: // ??
                    return 'DNF';
                case -2:
                    return 'DQ';
                case -3: 
                    return 'DNS';
                default:
                    return result.toString();
            }
        case 'Height':
            switch (result) {
                case -1:
                    return 'X';
                case -2:
                    return '-';
                case -3:
                    return 'DNS';
                case -7:
                    return 'NM';
                case -8:
                    return 'r';
                default:
                    return result.toString();
            }
        case 'Distance':
            switch (result) {
                case -1:
                    return 'X';
                case -2:
                    return '-';
                case -3:
                    return 'DNS';
                case -7:
                    return 'NM';
                case -8:
                    return 'r';
                default:
                    return result.toString();
            }
        case 'Points':
            return result.toString();
        default:
            return result.toString();
    }
}

export function formatResult(result, resultType) {
    if (result <= 0) {
        return GetCode(result, resultType);
    }

    switch (resultType) {
        case 'Time':
            let time = new Date(result);
            let minutes = time.getUTCMinutes();
            let seconds = time.getUTCSeconds();
            let milliseconds = time.getUTCMilliseconds();

            let centiseconds = Math.ceil(milliseconds / 10);

            if (minutes > 0) {
                return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
            } else {
                return `${seconds}.${centiseconds.toString().padStart(2, '0')}`;
            }
        case 'Height':
        case 'Distance':
            // always 2 decimals
            return `${result.toFixed(2)} m`;
        case 'Points':
            return `${result} pts`;
        default:
            return result.toString();
    }
}

function Heat({results, heat}) {
    
    return (
        <div className="heat">
            { heat > 0 && <div className="heat-title">Série {heat}</div> }
            {results.map((result, index) => {
                return (
                    <div key={result.id} className="results-item-container">
                        <ResultItem index={index} result={result} />
                    </div>
                )
            })}
        </div>
    )
}

function ResultItem({index, result}) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <>
            <div className="results-item">
                <div className="results-item-order">{index + 1}</div>
                <div className="results-item-bib">{result.bib}</div>
                <div className="results-item-athlete">{result.firstName} {result.lastName}</div>
                <div className="results-item-category">{result.category}</div>
                <div className="results-item-club">{result.club}</div>
                <div className="results-item-result">{result.result}</div>
                { result.details.length > 1 ? 
                <div className="results-item-details" onClick={() => setShowDetails(!showDetails)}>
                    {showDetails ? <FontAwesomeIcon icon={faCaretDown} rotation={180} /> : <FontAwesomeIcon icon={faCaretDown} />}
                </div>
                : <div className="results-item-details"></div> }
            </div>
            { showDetails ? <Details details={result.details} resultType={result.event_resultType} /> : null }
        </>
        
    )
}


function Details({details, resultType}) {
    switch (resultType) {
        case 'Height':
            // group by height(trynum) and concat results
            const groupedDetails = details.reduce((acc, detail) => {
                if (!acc[detail.trynum]) {
                    acc[detail.trynum] = [];
                }
                acc[detail.trynum].push(detail.result);
                return acc;
            }, {});

            return (
                <div className="details">
                    {Object.keys(groupedDetails).sort((a, b) => a - b).map((trynum) => {
                        return (
                            <div key={trynum} className="detail">
                                <div className="detail-trynum">{formatResult(parseFloat(trynum), resultType)}</div>
                                <div className="detail-result">{groupedDetails[trynum].join('')}</div>
                            </div>
                        )
                    })}
                </div>
            )
        
        default:
            return (
                <div className="details">
                    {details.map((detail) => {
                        return (
                            <div key={detail.id} className="detail">
                                <div className="detail-trynum">{detail.trynum}</div>
                                <div className="detail-result">{detail.result}</div>
                            </div>
                        )
                    })}
                </div>
            )
    }
}



export const Results = ({results}) => {
    const sortedResults = results.sort((a, b) => {
        return compareResult(a.event_resultType, a.value, b.value);
    });    

    const nbHeats = results.reduce((acc, result) => {
        return Math.max(acc, result.heat);
    }, 0);

    const [showHeats, setShowHeats] = useState(true);

    useEffect(() => {
        if (nbHeats <= 1) {
            setShowHeats(false);
        }
    }, [nbHeats]);

    return (
        <div className="results">
            { nbHeats > 1 ?
                <div className="heats-switch">
                    <Switch
                        checked={showHeats}
                        onChange={() => setShowHeats(!showHeats)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <div className='heats-switch-label'>
                        Voir les Séries
                    </div>
                </div>
            : null }
            {/* <div className="results-item">
                <div className="results-item-order">#</div>
                <div className="results-item-bib">Dossard</div>
                <div className="results-item-athlete">Athlète</div>
                <div className="results-item-category">Catégorie</div>
                <div className="results-item-club">Club</div>
                <div className="results-item-result">Résultat</div>
            </div> */}
            { sortedResults.length === 0 ? 
            <div className="no-results">Pas de résultats pour le moment</div>
            : null }
            { showHeats ?
                <div className="heats">
                    {Array.from({length: nbHeats}, (v, i) => i + 1).map((heat) => {
                        return (
                            <Heat key={heat} results={sortedResults.filter((result) => result.heat === heat)} heat={heat} />
                        )
                    })}
                </div>
                :
                    <Heat results={sortedResults} heat={0} />
            }
        </div>
    )
}
