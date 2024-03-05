import React, { useState } from 'react';

import { SubNavBarInscription } from '../SubNavBarInscription/SubNavBarInscription';
import { Inscription } from '../InscriptionComponents/Inscription';
import { InscriptionMulti } from '../InscriptionComponents/InscriptionMulti';

export const Inscriptions = (props) => {
    const [subPage, setSubPage] = useState("one");
    return (
        <div>
            <SubNavBarInscription subPage={subPage} setSubPage={setSubPage} />
            {subPage === "one" ? <Inscription user={props.user} setUser={props.setUser}/> : null}
            {subPage === "multi" ? <InscriptionMulti user={props.user} setUser={props.setUser}/> : null}
        </div>
    )
}












