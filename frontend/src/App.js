
import React, { useState } from 'react';

import './App.css';
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
                    <Route path="/competitions/:id" element={<Competition />} />

                    <Route path="/profile" element={<Profile />} />
                </Routes>
            <Footer />
            </Router>
        </div>
    );
}

export default App;
