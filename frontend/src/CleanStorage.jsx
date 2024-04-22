import React, { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';



export const CleanStorage = () => {

    // if not /competitions/:competitionId/inscription 
    // clear local storage
    const location = useLocation();
    useEffect(() => {
        if (!location.pathname.includes("/competitions/") || !location.pathname.includes("/inscription")) {
            //console.log("Clearing local storage");
            localStorage.clear();
        } else {
            //console.log("Not clearing local storage");
            //console.log(location.pathname);
        }
    }, [location])

    return null;
}
