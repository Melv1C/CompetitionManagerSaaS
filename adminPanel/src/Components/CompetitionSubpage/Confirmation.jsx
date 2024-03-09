import React, { useState } from 'react';
import { SubNavBarConfirmation } from '../SubNavBarConfirmation/SubNavBarConfirmation';

export const Confirmation = (props) => {
    const [subPage, setSubPage] = useState("one");
    return (
        <div>
            <div className='margin'>
                <SubNavBarConfirmation subPage={subPage} setSubPage={setSubPage} />
            </div>
        </div>
    )
}



