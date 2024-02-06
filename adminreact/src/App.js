
import React from 'react';

import './App.css';
import { NavBar } from './Components/NavBar/NavBar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import { Home } from './Pages/Home';
import { Competition } from './Pages/Competition';

function App() {
    return (
        <div>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/competitions/:id" element={<Competition />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
