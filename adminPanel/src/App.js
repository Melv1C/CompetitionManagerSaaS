import React, { useState, useEffect } from 'react';
import './App.css';
import { NavBar } from './Components/NavBar/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './Firebase';
import { Home } from './Pages/Home';
import { Competition } from './Pages/Competition';
import { Create } from './Pages/Create';
import { Inscriptions } from './Pages/Inscriptions';
import { AddModifEvent } from './Pages/AddModifEvent';
import { Footer } from './Components/Footer/Footer';
import { Auth } from './Pages/Auth';
import { Audio } from 'react-loader-spinner';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user){
                setUser(user);
            }else{
                setUser(auth)
            }
        });
    }, []);
    if (user === null) {
        return (
            <>
                <NavBar />
                <div className='center'>
                    <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" wrapperStyle wrapperClass/>
                </div>
                <Footer />      
            </>
        )
    }else if (user.uid === undefined) {
        return (
            <>
                <NavBar />
                <Auth />
                <Footer />
            </>
        );
    }
    return (
        <div>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="/create" element={<Create user={user}/>} />
                    <Route path="/competitions/:id" element={<Competition  user={user}/>} />
                    <Route path="/competitions/:id/addEvent" element={<AddModifEvent  user={user}/>} />
                    <Route path="/competitions/:id/events/:eventId" element={<AddModifEvent  user={user}/>} />
                    <Route path="/competitions/:id/inscriptions" element={<Inscriptions user={user}/>} />
                </Routes>
                <Footer />
            </Router>
        </div>
    );
}

export default App;
