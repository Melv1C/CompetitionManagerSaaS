import { Competition } from 'cm-data'
// import React from 'react'

import UploadFromFile from '../../Components/UploadFromFile'

type FileResultProps = {
    competition: Competition
}

export const FileResult = ({ competition }: FileResultProps) => {
  return (
    <div>
        <UploadFromFile competition={competition} />
    </div>
  )
}
