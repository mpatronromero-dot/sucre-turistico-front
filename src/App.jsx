import { Destinos } from './pages/public/Destinos';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/public/Home';
import { Alojamientos } from './pages/public/Alojamientos';
import { Gastronomia } from './pages/public/Gastronomia';
import { Experiencias } from './pages/public/Experiencias';   

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinos" element={<Destinos />} />
        <Route path="/gastronomia" element={<Gastronomia />} />
        <Route path="/experiencias" element={<Experiencias />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/admin" element={<div className="container py-4"><h2>Panel de Administración</h2></div>} />
        <Route path="/alojamientos" element={<Alojamientos />} />
      </Routes>
    </Router>
  );
}

export default App;