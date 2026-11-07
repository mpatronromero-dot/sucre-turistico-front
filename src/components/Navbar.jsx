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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
      <div className="container">
        {/* Logo y Nombre a la izquierda */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-water me-2 fs-4"></i>
          <span className="fw-bold">Sucre Turístico</span>
        </Link>

        {/* Botón hamburguesa para móviles */}
        <button 
          className="navbar-toggler" 
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
              // Fragmento <> </> para agrupar los dos botones cuando SÍ hay sesión
              <>
                <li className="nav-item mb-2 mb-lg-0">
                  <Link 
                    to="/admin" 
                    className="btn btn-light text-primary ms-lg-3 fw-bold shadow-sm"
                  >
                    <i className="bi bi-speedometer2 me-2"></i>Panel Admin
                  </Link>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-outline-light ms-lg-3 fw-semibold"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              // Cuando NO hay sesión, solo muestra Iniciar Sesión
              <li className="nav-item">
                <Link 
                  to="/login" 
                  className="btn btn-outline-light ms-lg-3 fw-semibold"
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