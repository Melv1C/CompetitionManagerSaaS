import React from 'react'

import './Records.css'

function ControlButtons({setStep, records, events}) {
    return (
        <div className='control-buttons'>
            <button onClick={()=>{setStep(2)}}>Précédent</button>
            <button onClick={()=>{setStep(4)}}>Suivant</button>
        </div>
    )
}

export const Records = ({events, records, setRecords, setStep}) => {
  return (
    <div className='step-page'>
        <h2>Records</h2>

        <div className='records-list'>
            {events.map((event, index) => {
                return (
                    <div className='record-item' key={index}>
                        <div className='record-item-name'>{event}</div>
                        <input type='text' className='record-item-input' onChange={(e) => {
                            setRecords({...records, [event]: e.target.value});
                        }} />
                    </div>
                )
            })}
        </div>

        <ControlButtons setStep={setStep} records={records} events={events} />
    </div>
  )
}
