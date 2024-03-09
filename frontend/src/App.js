
import React, { useState } from 'react';

import './App.css';
import './Colors.css';
import { NavBar } from './Components/NavBar/NavBar';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { Home } from './Pages/Home';
import { Competitions } from './Pages/Competitions';
import { Competition } from './Pages/Competition';

import { Profile } from './Pages/Profile';

import { Footer } from './Components/Footer/Footer';

function App() {
    return (
        <div>
            <Router>
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
    );
}

export default App;
