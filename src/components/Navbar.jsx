import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
  
  // Verificamos si hay un token de sesión activo
  const isAuthenticated = !!localStorage.getItem('token'); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); 
    window.location.reload(); 
  };

  return (
    // ¡MEDIDA RADICAL! Reemplazamos bg-primary por bg-caribe-sobrio
    <nav className="navbar navbar-expand-lg navbar-dark bg-caribe-sobrio sticky-top shadow-sm py-3">
      <div className="container">
        {/* Logo y Nombre a la izquierda */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-water me-2 fs-3"></i>
          {/* Tipografía serif para el logo, dándole ese toque elegante */}
          <span className="fw-bold fs-4" style={{ fontFamily: 'serif', letterSpacing: '1px' }}>Sucre Turístico</span>
        </Link>

        {/* Botón hamburguesa para móviles (sin bordes rústicos) */}
        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenedor derecho (Botones de sesión y Panel) */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            {isAuthenticated ? (
              <>
                <li className="nav-item mb-2 mb-lg-0 mt-3 mt-lg-0">
                  <Link 
                    to="/admin" 
                    // Reemplazamos text-primary por text-caribe-sobrio y añadimos rounded-pill
                    className="btn btn-light text-caribe-sobrio ms-lg-3 fw-bold shadow-sm rounded-pill px-4"
                  >
                    <i className="bi bi-speedometer2 me-2"></i>Panel Admin
                  </Link>
                </li>
                <li className="nav-item mt-2 mt-lg-0">
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-outline-light ms-lg-3 fw-semibold rounded-pill px-4"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item mt-3 mt-lg-0">
                <Link 
                  to="/login" 
                  className="btn btn-outline-light ms-lg-3 fw-semibold rounded-pill px-4"
                >
                  Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};