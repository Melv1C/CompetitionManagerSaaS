import { Competition } from 'cm-data'
// import React from 'react'

import A  from '../../Components/DistanceEvent'

type DistanceEventProps = {
    competition: Competition
}

export const DistanceEvent = ({ competition }: DistanceEventProps) => {
  return (
    <div>
        <A competition={competition} />
    </div>
  )
}
