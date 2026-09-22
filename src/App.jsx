import { Destinos } from './pages/public/Destinos';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/public/Home';
import { Alojamientos } from './pages/public/Alojamientos';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinos" element={<Destinos />} />
        
        <Route path="/gastronomia" element={<div className="container py-4"><h2>Módulo Gastronomía</h2></div>} />
        <Route path="/experiencias" element={<div className="container py-4"><h2>Módulo Experiencias</h2></div>} />
        <Route path="/eventos" element={<div className="container py-4"><h2>Módulo Eventos</h2></div>} />
        <Route path="/admin" element={<div className="container py-4"><h2>Panel de Administración</h2></div>} />
        <Route path="/alojamientos" element={<Alojamientos />} />
      </Routes>
    </Router>
  );
}

export default App;