import React from 'react'
import { CompetitionInfo } from '../Components/CompetitionInfo/CompetitionInfo'

export const Create = (props) => {
  return (
    
    <CompetitionInfo user={props.user} setUser={props.setUser}/>
    
  )
}