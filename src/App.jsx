import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientList from "./ClientList";
import ClientDetail from "./ClientDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientList />} />
        <Route path="/client/:contract" element={<ClientDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
