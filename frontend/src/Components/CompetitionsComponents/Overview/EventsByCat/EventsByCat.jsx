import React, { useEffect, useState } from 'react';

import { SortCategory, groupByGender } from '../../../../SortCategory';

import './EventsByCat.css';

export const EventsByCat = ({events}) => {

    const modifiedEvents = events.map(event => {
        return {
            categories: event.categories.map(category => {
                if (category.length === 3) {
                    if (category.includes("M")) {
                        return "MAS M";
                    } else if (category.includes("W")) {
                        return "MAS F";
                    }
                }
                return category;
            }),
            abbr: event.abbr,
            pseudoName: event.pseudoName
        }
    });

    console.log(modifiedEvents);

    const categories = modifiedEvents.map(event => event.categories).flat();
    const sortedCategories = SortCategory(categories);
    const groupedCategories = groupByGender(sortedCategories);

    return (
        <div className="events-by-cat">
            <div className="categories">
                {groupedCategories.female.length > 0 ?
                <div className="category female">
                    <div className="category-list">
                        {groupedCategories.female.map((category, index) => {
                            return (
                                <div key={index} className="category">
                                    <div className="category-title">{category}</div>
                                    <div className="events-div">
                                        {[...new Set(modifiedEvents.filter(event => event.categories.includes(category)).map(event => event.abbr))].sort().map((event, index) => {
                                            return (
                                                <div key={index} className="event">{event}</div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                : null}
                {groupedCategories.male.length > 0 ?
                <div className="category male">
                    <div className="category-list">
                        {groupedCategories.male.map((category, index) => {
                            return (
                                <div key={index} className="category">
                                    <div className="category-title">{category}</div>
                                    <div className="events-div">
                                        {[...new Set(modifiedEvents.filter(event => event.categories.includes(category)).map(event => event.abbr))].sort().map((event, index) => {
                                            return (
                                                <div key={index} className="event">{event}</div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                : null}
            </div>
        </div>
    )
}
