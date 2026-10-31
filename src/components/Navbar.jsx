import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🌊 Sucre Turístico
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/destinos">Destinos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/alojamientos">Alojamientos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/gastronomia">Gastronomía</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/experiencias">Experiencias</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/eventos">Eventos</Link>
            </li>
            <li className="nav-item ms-lg-2">
              <Link className="btn btn-outline-light btn-sm mt-1 mt-lg-0" to="/admin">
                Iniciar Sesión
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};