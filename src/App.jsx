import { Destinos } from './pages/public/Destinos';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/public/Home';
import { Alojamientos } from './pages/public/Alojamientos';
import { Gastronomia } from './pages/public/Gastronomia';
import { Experiencias } from './pages/public/Experiencias'; 
import { Eventos } from './pages/public/Eventos';  
import { Admin } from './pages/admin/Admin';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/alojamientos" element={<Alojamientos />} />
         <Route path="/destinos" element={<Destinos />} />
        <Route path="/gastronomia" element={<Gastronomia />} />
        <Route path="/experiencias" element={<Experiencias />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/admin" element={<Admin />} />
       
      </Routes>
    </Router>
  );
}

export default App;