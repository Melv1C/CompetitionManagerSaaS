
import React, { useEffect, useState } from 'react';

import { CleanStorage } from './CleanStorage';

import './App.css';
import './Colors.css';
import { NavBar } from './Components/NavBar/NavBar';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { Home } from './Pages/Home';
import { Competitions } from './Pages/Competitions';
import { Competition } from './Pages/Competition';

import { Profile } from './Pages/Profile';

import { Footer } from './Components/Footer/Footer';

import CacheBuster from 'react-cache-buster';
import PackageFile from '../package.json';

function App() {

    const version = PackageFile.version;
    const isProduction = process.env.NODE_ENV === 'production';

    const [liveConnection, setLiveConnection] = useState(true);

    return (


        <CacheBuster
            currentVersion={version}
            isEnabled={isProduction} //If false, the library is disabled.
            isVerboseMode={false} //If true, the library writes verbose logs to console.
            metaFileDirectory={'.'} //If public assets are hosted somewhere other than root on your server.
        >
            <div>
                <Router>
                    <CleanStorage />
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/competitions" element={<Competitions />} />
                        <Route path="/competitions/:competitionId" element={<Competition subPage="overview" />} />
                        <Route path="/competitions/:competitionId/inscription" element={<Competition subPage="inscription" />} />
                        <Route path="/competitions/:competitionId/schedule" element={<Competition subPage="schedule" />} />
                        <Route path="/competitions/:competitionId/:eventName" element={<Competition subPage="event" />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                    <Footer />
                </Router>
            </div>
        </CacheBuster>
        
        
    );
}

export default App;