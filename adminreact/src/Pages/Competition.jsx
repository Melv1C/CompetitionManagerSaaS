import React from "react";
import { useParams} from 'react-router-dom';


export const Competition = () => {
    const { id } = useParams();




    return (
        <div>
        <h1>Competition {id}</h1>
        </div>
    );
};