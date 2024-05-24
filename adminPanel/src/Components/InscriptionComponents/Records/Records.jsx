import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';

import axios from 'axios';
import { ATLHETES_URL } from '../../../Gateway'

import './Records.css'

function ControlButtons({setStep, records, events}) {
    const nextEnabled = Object.keys(records).length === events.length;
    return (
        <div className='control-buttons'>
            <button onClick={()=>{setStep(2)}}>Précédent</button>
            <button onClick={()=>{setStep(4)}} disabled={!nextEnabled}>Suivant</button>
        </div>
    )
}

function RecordsList({records, setRecord, events, athleteId}) {

    return (
        <div className='records-list'>
            {events.map((event) => {
                return <RecordsItem 
                            record={records[event.pseudoName]} 
                            setRecord={setRecord}
                            event={event}
                            athleteId={athleteId} 
                            records={records} 
                            key={event.pseudoName} 
                        />
            })}
        </div>
    )
}

function RecordsItem({record, setRecord, event, athleteId, records}) {

    const isMultiEvent = event.subEvents ? event.subEvents.length > 0 : false;
    const isSubEvent = event.superEvent !== undefined;

    useEffect(() => {
        if (record === undefined) {
            setTimeout(() => {
                if (isMultiEvent) {
                    setRecord(event.pseudoName, "0", "total", "setTo0IfUndef")
                } else if (isSubEvent) {
                    setRecord(event.superEvent, "0", event.name, "setTo0IfUndef")
                } else {
                    setRecord(event.pseudoName, "0", null, "setTo0IfUndef")
                }
            }, 3000);

            axios.get(`${ATLHETES_URL}/${athleteId}/${event.name}?maxYears=2`)
                .then(response => {
                    if (isMultiEvent) {
                        setRecord(event.pseudoName, response.data.data.perf, "total", "setToRecordIfNot0");
                    } else if (isSubEvent) {
                        setRecord(event.superEvent, response.data.data.perf, event.name, "setToRecordIfNot0");
                    } else {
                        setRecord(event.pseudoName, response.data.data.perf, null, "setToRecordIfNot0");
                    }
                })
                .catch(error => {
                    console.log(error);
                    console.log(event.pseudoName);
                    if (isMultiEvent) {
                        setRecord(event.pseudoName, "0", "total", "setTo0IfUndef")
                    } else if (isSubEvent) {
                        setRecord(event.superEvent, "0", event.name, "setTo0IfUndef")
                    } else {
                        setRecord(event.pseudoName, "0", null, "setTo0IfUndef")
                    }
                });
        }
    }, [record]);

    return (
        <div className='record-item'>
            <div className='record-item-name'>{event.pseudoName}</div>
            <RecordInput 
                record={isMultiEvent ? record?.total : (isSubEvent && records[event.superEvent]) ? records[event.superEvent][event.name] : record}
                setRecord={(newRecord) => {
                    if (isMultiEvent) {setRecord(event.pseudoName, newRecord, "total")}
                    else if (isSubEvent) {setRecord(event.superEvent, newRecord, event.name)}
                    else {setRecord(event.pseudoName, newRecord)}
                }} 
                event={event}
            />
        </div>
    )    
}

function RecordInput({record, setRecord, event}) {
    if (record === undefined) {
        return <div className='record-item-input'>Chargement...</div>
    }

    switch (event.type) {
        case "distance":
            return <DistanceInput record={record} setRecord={setRecord} event={event.pseudoName} />
        case "time":
            return <TimeInput record={record} setRecord={setRecord} />
        case "points":
            return <PointsInput record={record} setRecord={setRecord}/>
        default:
            return <div className='record-item-input'>Type d'épreuve inconnu</div>
    }
}

function DistanceInput({record, setRecord}) {
    let [meters, centimeters] = [0, 0];
    if (record.includes('.')) {
        [meters, centimeters] = record.split('.');
        centimeters = centimeters.padEnd(2, '0');
    } else {
        meters = record;
        centimeters = '0';
    }

    const decameters = parseInt(meters/10);
    meters = meters%10;
    const decimeters = parseInt(centimeters/10);
    centimeters = centimeters%10;
    
    return (
        <div className='record-item-input'>
            <div className='record-item-input-number'>
                <input 
                    type='number' 
                    value={decameters} 
                    onInput={(e) => {
                        if (e.target.value.length === 1) {
                            setRecord(`${e.target.value}${meters}.${decimeters}${centimeters}`);
                        } 
                        e.target.nextSibling.focus();
                    }} 
                    min='0' 
                    max='9' 
                    onFocus={(e) => e.target.select()} 
                    onWheel={(e) => e.target.blur()}
                />
                <input 
                    type='number'
                    value={meters}
                    onInput={(e) => {
                        if (e.target.value.length === 1) {
                            setRecord(`${decameters}${e.target.value}.${decimeters}${centimeters}`);
                        }
                        e.target.parentNode.nextSibling.nextSibling.firstChild.focus();
                    }}
                    min='0'
                    max='9'
                    onFocus={(e) => e.target.select()}
                    onWheel={(e) => e.target.blur()}
                />
            </div>
            <div className='record-item-input-number-label'>m</div>
            <div className='record-item-input-number'>
                <input
                    type='number'
                    value={decimeters}
                    onInput={(e) => {
                        if (e.target.value.length === 1) {
                            setRecord(`${decameters}${meters}.${e.target.value}${centimeters}`);
                        }
                        e.target.nextSibling.focus();
                    }}
                    min='0'
                    max='9'
                    onFocus={(e) => e.target.select()}
                    onWheel={(e) => e.target.blur()}
                />
                <input
                    type='number'
                    value={centimeters}
                    onInput={(e) => {
                        if (e.target.value.length === 1) {
                            setRecord(`${decameters}${meters}.${decimeters}${e.target.value}`);
                        }
                        e.target.blur();
                    }}
                    min='0'
                    max='9'
                    onFocus={(e) => e.target.select()}
                    onWheel={(e) => e.target.blur()}
                />
            </div>
        </div>
    )

}

function TimeInput({record, setRecord, event}) {
    // record is in milliseconds
    let time = new Date(0);
    time.setMilliseconds(record);

    const minutes = time.getUTCMinutes();
    const seconds = time.getUTCSeconds();
    const milliseconds = time.getUTCMilliseconds();

    const [m1, m2] = minutes.toString().padStart(2, '0').split('');
    const [s1, s2] = seconds.toString().padStart(2, '0').split('');
    const [ms1, ms2] = milliseconds.toString().padStart(3, '0').split('');

    return (
        <div className='record-item-input'>
            <div className='record-item-input-number'>
                <input 
                    type='number' 
                    value={m1} 
                    onInput={(e) => {
                        if (e.target.value.length === 1) {
                            time.setMinutes(parseInt(`${e.target.value}${m2}`));
                            setRecord(time.getTime());
                        }
                        e.target.nextSibling.focus();
                    }} 
                    min='0' 
                    max='5' 
                    onFocus={(e) => e.target.select()} 
                    onWheel={(e) => e.target.blur()}
                />
                <input 
                    type='number' 
                    value={m2} 
                    onInput={(e) => {
                        if (e.target.value.length === 1) {
                            time.setMinutes(parseInt(`${m1}${e.target.value}`));
                            setRecord(time.getTime());
                        }
                        e.target.parentNode.nextSibling.nextSibling.firstChild.focus();
                    }} 
                    min='0' 
                    max='9' 
                    onFocus={(e) => e.target.select()} 
                    onWheel={(e) => e.target.blur()}
                />
            </div>
            <div className='record-item-input-number-label'>'</div>
            <div className='record-item-input-number'>
                <input 
                    type='number' 
                    value={s1} 
                    onInput={(e) => {
                        if (e.target.value.length === 1) {
                            time.setSeconds(parseInt(`${e.target.value}${s2}`));
                            setRecord(time.getTime());
                        }
                        e.target.nextSibling.focus();
                    }} 
                    min='0' 
                    max='5' 
                    onFocus={(e) => e.target.select()} 
                    onWheel={(e) => e.target.blur()}
                />
                <input 
                    type='number' 
                    value={s2} 
                    onInput={(e) => {
                        if (e.target.value.length === 1) {
                            time.setSeconds(parseInt(`${s1}${e.target.value}`));
                            setRecord(time.getTime());
                        }
                        e.target.parentNode.nextSibling.nextSibling.firstChild.focus();
                    }} 
                    min='0' 
                    max='9' 
                    onFocus={(e) => e.target.select()} 
                    onWheel={(e) => e.target.blur()}
                />
            </div>
            <div className='record-item-input-number-label'>"</div>
            <div className='record-item-input-number'>
                <input
                    type='number'
                    value={ms1}
                    onInput={(e) => {
                        if (e.target.value.length === 1) {
                            time.setMilliseconds(parseInt(`${e.target.value}${ms2}0`));
                            setRecord(time.getTime());
                        }
                        e.target.nextSibling.focus();
                    }}
                    min='0'
                    max='9'
                    onFocus={(e) => e.target.select()}
                    onWheel={(e) => e.target.blur()}
                />
                <input
                    type='number'
                    value={ms2}
                    onInput={(e) => {
                        if (e.target.value.length === 1) {
                            time.setMilliseconds(parseInt(`${ms1}${e.target.value}0`));
                            setRecord(time.getTime());
                        }
                        e.target.blur();
                    }}
                    min='0'
                    max='9'
                    onFocus={(e) => e.target.select()}
                    onWheel={(e) => e.target.blur()}
                />
            </div>
        </div>  
    )
}

function PointsInput({record, setRecord, event}) {

    // if record is not 4 digits long, add 0s at the beginning
    if (record.length < 4) {
        record = '0'.repeat(4 - record.length) + record;
    }

    const [a, b, c, d] = record.split('');

    return (
        <div className='record-item-input'>
            <div className='record-item-input-number'>
                <input 
                    type='number' 
                    value={a} 
                    onInput={(e) => {
                        if (e.target.value.length === 1) {
                            setRecord(`${e.target.value}${b}${c}${d}`);
                        }
                        e.target.nextSibling.focus();
                    }} 
                    min='0' 
                    max='9' 
                    onFocus={(e) => e.target.select()}
                    onWheel={(e) => e.target.blur()}
                />
                <input 
                    type='number' 
                    value={b} 
                    onInput={(e) => {
                        if (e.target.value.length === 1) {
                            setRecord(`${a}${e.target.value}${c}${d}`);
                        }
                        e.target.nextSibling.focus();
                    }} 
                    min='0' 
                    max='9' 
                    onFocus={(e) => e.target.select()}
                    onWheel={(e) => e.target.blur()}
                />
                <input 
                    type='number' 
                    value={c} 
                    onInput={(e) => {
                        if (e.target.value.length === 1) {
                            setRecord(`${a}${b}${e.target.value}${d}`);
                        }
                        e.target.nextSibling.focus();
                    }} 
                    min='0' 
                    max='9' 
                    onFocus={(e) => e.target.select()}
                    onWheel={(e) => e.target.blur()}
                />
                <input 
                    type='number' 
                    value={d} 
                    onInput={(e) => {
                        if (e.target.value.length === 1) {
                            setRecord(`${a}${b}${c}${e.target.value}`);
                        }
                        e.target.blur();
                    }} 
                    min='0' 
                    max='9' 
                    onFocus={(e) => e.target.select()}
                    onWheel={(e) => e.target.blur()}
                />
            </div>
            <div className='record-item-input-number-label'>pts</div>
            
        </div>
    )
}

export const Records = ({events, records, setRecord, setStep}) => {

    const [searchParams, setSearchParams] = useSearchParams();

    const athleteId = searchParams.get('athleteId');

    let eventsList = [];
    for (let event of events) {
        eventsList.push(event);
        for (let subEvent of event.subEvents) {
            eventsList.push({...subEvent, pseudoName: `${event.pseudoName} - ${subEvent.name}`, superEvent: event.pseudoName});
        }
    }

    return (
        <div className='step-page'>
            <h2>Records</h2>

            <div className='records'>
                <RecordsList records={records} setRecord={setRecord} events={eventsList} athleteId={athleteId} />
            </div>

            <ControlButtons setStep={setStep} records={records} events={events} />
        </div>
    )
}
