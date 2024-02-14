
import React, { useState, useEffect } from 'react';

import './App.css';
import { NavBar } from './Components/NavBar/NavBar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import { Home } from './Pages/Home';
import { Competition } from './Pages/Competition';
import { Create } from './Pages/Create';
import { Inscription } from './Pages/Inscription';
import { getUser } from './Auth';


function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            getUser(userId, setUser);
        }
    }, []);
        
    return (
        <div>
            <Router>
                <NavBar user={user} setUser={setUser}/>
                <Routes>
                    <Route path="/" element={<Home user={user} setUser={setUser}/>} />
                    <Route path="/create" element={<Create user={user} setUser={setUser}/>}/>
                    <Route path="/competitions/:id" element={<Competition user={user} setUser={setUser}/>} />
                    <Route path="/competitions/:id/inscription" element={<Inscription user={user} setUser={setUser}/>} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
