import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { INSCRIPTIONS_URL } from '../Gateway';

import { SubNavBarInscription } from '../Components/SubNavBarInscription/SubNavBarInscription';
import { Inscription } from '../Components/InscriptionComponents/Inscription';
import { InscriptionMulti } from '../Components/InscriptionComponents/InscriptionMulti';




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












