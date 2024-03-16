import React, { useEffect, useState } from 'react';

import { SortCategory, groupByGender } from '../../../../SortCategory';

export const EventsByCat = ({events}) => {

    console.log(events);

    /*
    events = [
        {
            categories: ["BEN M", "BEN F"],
            abbr: "60m",
            pseudoName: "60m BEN"
        },
        ...
    ]
    */

    const categories = events.map(event => event.categories).flat();
    const sortedCategories = SortCategory(categories);

    console.log(sortedCategories);

    const groupedCategories = groupByGender(sortedCategories);

    console.log(groupedCategories);


    return (
        <div>
            
            
        </div>
    )
}
