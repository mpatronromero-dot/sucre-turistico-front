import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const esInicio = location.pathname === '/';
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-caribe-sobrio sticky-top shadow-sm py-3">
      <div className="container">
        <div className="d-flex align-items-center">
          {!esInicio && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline-light btn-sm rounded-circle me-3 d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px' }}
              title="Regresar"
              aria-label="Regresar"
            >
              <i className="bi bi-arrow-left fs-5"></i>
            </button>
          )}

          <Link className="navbar-brand d-flex align-items-center mb-0" to="/">
            <i className="bi bi-water me-2 fs-3"></i>
            <span className="fw-bold fs-4" style={{ fontFamily: 'serif', letterSpacing: '1px' }}>
              Sucre Turístico
            </span>
          </Link>
        </div>

        {esInicio && (
          <>
            <button
              className="navbar-toggler border-0 shadow-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul className="navbar-nav align-items-center">
                {isAuthenticated ? (
                  <>
                    <li className="nav-item mb-2 mb-lg-0 mt-3 mt-lg-0">
                      <Link
                        to="/admin"
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
          </>
        )}
      </div>
    </nav>
  );
};