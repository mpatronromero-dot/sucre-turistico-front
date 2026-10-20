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
    <nav className="navbar navbar-dark bg-primary shadow-sm py-3">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo / Nombre del sitio (Redirige al Home) */}
        <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2 m-0" to="/">
          <i className="bi bi-water fs-3"></i> Sucre Turístico
        </Link>

        {/* Único botón de la barra: Iniciar Sesión / Panel Admin */}
        <div className="d-flex align-items-center gap-2">
          {token ? (
            <>
              <Link to="/admin" className="btn btn-outline-light fw-bold rounded-pill px-4">
                <i className="bi bi-speedometer2 me-1"></i> Admin
              </Link>
              <button onClick={handleLogout} className="btn btn-danger fw-bold rounded-pill px-3" title="Cerrar Sesión">
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline-light fw-bold rounded-pill px-4">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};