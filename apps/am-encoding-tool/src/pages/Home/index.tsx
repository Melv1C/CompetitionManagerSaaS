import { useState } from "react";



export const Home = () => {
    const [competitionEid, setCompetitionEid] = useState('');

    return (
        <div>
            <h1>AM Encoding Tool</h1>
            <p>Welcome to the AM Encoding Tool. Please use the sidebar to navigate through the application.</p>
            <button onClick={() => window.location.href = '/truc'}>Go to Truc</button>
            <div>
                <input 
                    type="text" 
                    placeholder="Enter Competition EID"
                    value={competitionEid}
                    onChange={(e) => setCompetitionEid(e.target.value)}
                />
                <button onClick={() => window.location.href = `/competition/${competitionEid}`}>Open dashboard</button>
            </div>
        </div>
    )
}