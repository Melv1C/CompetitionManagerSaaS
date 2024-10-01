import { useState, useEffect } from "react";
import myAxios, { refreshToken } from "./AxiosHandler";

import { jwtDecode } from "jwt-decode";

// import { ReactDOM } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./Pages/Home/Home";
import { FileResult } from "./Pages/FileResult/FileResult";
import { DistanceEvent } from "./Pages/DistanceEvent/DistanceEvent";


import { KitContainer, NavBar, Input, Button, toast, Modal } from "ui-kit";
import { Competition } from "cm-data";

import { AddAthletesModalContainer } from "./Components/Modals/AddAthletesModal";


function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setHasToken(true);
      const decodedToken = jwtDecode(token);
      const expiration = decodedToken.exp! * 1000 - 60000; // 1 minute before expiration
      setTimeout(() => refreshToken(setHasToken), expiration - Date.now());
    }
  }, []);

  function handleLogin() {
    myAxios
      .post("/login", { username, password })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        setHasToken(true);

        const decodedToken = jwtDecode(res.data.token);
        const expiration = decodedToken.exp! * 1000 - 60000; // 1 minute before expiration
        setTimeout(refreshToken, expiration - Date.now());

        toast({ message: "Login successful", type: "success" });
      })
      .catch((err) => {
        console.log(err);
        toast({ message: "Login failed", type: "error" });
      });
  }

  const [competition, setCompetition] = useState<Competition | undefined>(
    undefined
  );

  useEffect(() => {
      myAxios
      .post("/MYSQL", { query: "SELECT * FROM competitions c WHERE id=2" })
      .then((res) => {
        setCompetition(
          res.data.data.map((data: any) => Competition.fromJson(data))[0]
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <Router>
      <NavBar
        title="New Admin Panel"
        navLinks={[
          { name: "Home", link: "/" },
          { name: "File Result", link: "/fileresult" },
          { name: "Distance Event", link: "/distanceevent" },
        ]}
        reactRouter
      />

      {competition && <Routes>
        <Route path="/" element={<Home competition={competition} />} />
        <Route path="/fileresult" element={<FileResult competition={competition} />} />
        <Route path="/distanceevent" element={<DistanceEvent competition={competition} />} />
      </Routes>}
      
      <Modal
        title="Login"
        open={!hasToken}
        onClose={() => {}}
        closeBtn={false}
        closeOnOverlayClick={false}
      >
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <Button onClick={handleLogin}>Login</Button>
      </Modal>
      <AddAthletesModalContainer />
      <KitContainer />
    </Router>
    
  );
}

export default App;