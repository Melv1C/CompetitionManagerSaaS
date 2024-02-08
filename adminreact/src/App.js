
import React, { useState, useEffect } from 'react';

import './App.css';
import { NavBar } from './Components/NavBar/NavBar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import { Home } from './Pages/Home';
import { Competition } from './Pages/Competition';
import { Create } from './Pages/Create';

import axios from 'axios';
axios.defaults.withCredentials = true;


function App() {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        axios.get('http://localhost:3000/adminAuth')
            .then((response) => {
                setUser(response.data);
                setLoading(true);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [loading]);
    return (
        <div>
            <Router>
                <NavBar user={user} setUser={setUser} loading={loading} setLoading={setLoading}/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<Create user={user} setUser={setUser}/>}/>
                    <Route path="/competitions/:id" element={<Competition user={user} setUser={setUser}/>} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
