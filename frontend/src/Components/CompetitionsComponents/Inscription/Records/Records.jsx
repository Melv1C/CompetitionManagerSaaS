import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';

import axios from 'axios';

import './Records.css'

function ControlButtons({setStep, records, events}) {
    return (
        <div className='control-buttons'>
            <button onClick={()=>{setStep(2)}}>Précédent</button>
            <button onClick={()=>{setStep(4)}}>Suivant</button>
        </div>
    )
}

function RecordsList({records, setRecords, events, athleteId}) {
    console.log(records);
    return (
        <div className='records-list'>
            {events.map((event) => {
                return <RecordsItem record={records[event.name]} setRecords={setRecords} event={event} athleteId={athleteId} key={event.name} />
            })}
        </div>
    )
}

function RecordsItem({record, setRecords, event, athleteId}) {

    useEffect(() => {
        const url = process.env.NODE_ENV === 'development' ? 'http://localhost/api/athletes' : '/api/athletes';

        axios.get(`${url}/${athleteId}/${event.name}?maxYears=1`)
            .then(response => {
                setRecords(prev => ({...prev, [event.name]: response.data.data.perf}));
            })
            .catch(error => {
                // if the athlete has no record, 404 is returned
                if (error.response.status === 404) {
                    setRecords(prev => ({...prev, [event.name]: 0}));
                }
            });
    }, [athleteId]);

    return (
        <div className='record-item'>
            <div className='record-item-name'>{event.name}</div>
            <RecordInput record={record} setRecord={(newRecord) => setRecords(prev => ({...prev, [event.name]: newRecord}))} event={event} />
        </div>
    )    
}

function RecordInput({record, setRecord, event}) {

    if (record === undefined) {
        return <div className='record-item-input'>Chargement...</div>
    }

    const type = event.type;

    switch (type) {
        case "distance":
            return <DistanceInput record={record} setRecord={setRecord} event={event.name} />
        case "time":
            return <TimeInput record={record} setRecord={setRecord} />
        case "points":
            return <PointsInput record={record} setRecord={setRecord}/>
        default:
            return <input type='number' className='record-item-input' value={record} onInput={(e) => setRecord(prev => ({...prev, [event.name]: e.target.value}))} />
    }
}

function DistanceInput({record, setRecord}) {
    let [meters, centimeters] = record.split('.');

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
    console.log(record);

    // record is in milliseconds
    let time = new Date(0);
    time.setMilliseconds(record);

    console.log(time.getTime());

    const minutes = time.getUTCMinutes();
    const seconds = time.getUTCSeconds();
    const milliseconds = time.getUTCMilliseconds();

    console.log(minutes, seconds, milliseconds);

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
            <div className='record-item-input-number-label'>"</div>
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
            <div className='record-item-input-number-label'>'</div>
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
    console.log(record);

    // if record is not 4 digits long, add 0s at the beginning
    if (record.length < 4) {
        record = '0'.repeat(4 - record.length) + record;
    }

    const [a, b, c, d] = record.split('');

    console.log(a, b, c, d);

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

export const Records = ({events, records, setRecords, setStep}) => {

    const [searchParams, setSearchParams] = useSearchParams();

    const athleteId = searchParams.get('athleteId');

    return (
        <div className='step-page'>
            <h2>Records</h2>

            <div className='records'>
                <RecordsList records={records} setRecords={setRecords} events={events} athleteId={athleteId} />
            </div>

            <ControlButtons setStep={setStep} records={records} events={events} />
        </div>
    )
}
