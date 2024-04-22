import React from 'react'

import './Participants.css'

import { formatRecord } from '../../../../RecordsHandler'

export const Participants = ({event, inscriptions}) => {
    return (
        <div className="participants">
            {inscriptions.sort((a, b) => {
                if (event.type === 'time') {
                    return a.record - b.record;
                } else {
                    return b.record - a.record;
                }
            }).map(inscription => {
                return (
                    <div className="participants-item" key={inscription._id}>
                        <div className="participants-item-bib">{inscription.bib}</div>
                        <div className="participants-item-athlete">{inscription.athleteName}</div>
                        <div className="participants-item-club">{inscription.club}</div>
                        <div className="participants-item-record">{formatRecord(event.type, inscription.record)}</div>
                    </div>
                )
            })}
        </div>
    )
}
