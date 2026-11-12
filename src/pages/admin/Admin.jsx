import React, { useState } from 'react';
import { FormularioAlojamiento } from '../../components/FormularioAlojamiento';
import { GestionHabitaciones } from '../../components/GestionHabitaciones';
import { FormularioGastronomia } from '../../components/FormularioGastronomia';
import { FormularioExperiencias } from '../../components/FormularioExperiencias';
import { FormularioEventos } from '../../components/FormularioEventos';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Admin = () => {
  const navigate = useNavigate();

  // --- LÓGICA DE ROLES ---
  const rolUsuario = localStorage.getItem('rol_usuario') || 'superadmin';
  // Creamos la bandera del Modo Dios (Super-Usuario)
  const isSuperAdmin = rolUsuario === 'superadmin';

  // --- ESTADO DE NAVEGACIÓN ---
  const [vistaActiva, setVistaActiva] = useState('dashboard');

  const irANuevoRegistro = () => {
    if (isSuperAdmin || rolUsuario === 'alojamiento') setVistaActiva('alojamientos');
    else if (rolUsuario === 'gastronomia') setVistaActiva('gastronomia');
    else if (rolUsuario === 'experiencias') setVistaActiva('experiencias');
    else if (rolUsuario === 'eventos') setVistaActiva('eventos');
  };

  const handleCerrarSesion = () => {
    Swal.fire({
      title: '¿Deseas cerrar sesión?',
      text: "Tendrás que volver a ingresar tu correo y contraseña.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('rol_usuario');
        navigate('/login', { replace: true });
      }
    });
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#fcfbf9' }}>
      
      {/* ==========================================
          SIDEBAR (Menú Lateral Elegante con Filtro de Roles)
      ========================================== */}
      <div className="text-white p-4 d-flex flex-column shadow-lg" style={{ width: '280px', backgroundColor: '#1a2e3b' }}>
        <h4 className="text-white fw-bold mb-5 mt-2 d-flex align-items-center" style={{ fontFamily: 'Playfair Display, serif' }}>
          <i className={`bi ${isSuperAdmin ? 'bi-star-fill text-warning' : 'bi-shield-lock text-info'} me-2 fs-3`}></i> 
          Panel {isSuperAdmin ? 'Master' : 'Admin'}
        </h4>
        
        <div className="nav flex-column gap-3">
          <button 
            className={`btn text-start w-100 fw-semibold rounded-3 py-2 px-3 transition-hover ${vistaActiva === 'dashboard' ? 'btn-caribe-sobrio shadow' : 'btn-outline-light border-0 opacity-75'}`}
            onClick={() => setVistaActiva('dashboard')}
          >
            <i className="bi bi-grid-1x2 me-2"></i> Dashboard
          </button>
          
          {/* RENDERIZADO CONDICIONAL: Se muestra si es ese rol específico O si es SuperAdmin */}
          {(rolUsuario === 'alojamiento' || isSuperAdmin) && (
            <button 
              className={`btn text-start w-100 fw-semibold rounded-3 py-2 px-3 transition-hover ${vistaActiva === 'alojamientos' ? 'btn-caribe-sobrio shadow' : 'btn-outline-light border-0 opacity-75'}`}
              onClick={() => setVistaActiva('alojamientos')}
            >
              <i className="bi bi-building me-2"></i> Alojamientos
            </button>
          )}

          {(rolUsuario === 'gastronomia' || isSuperAdmin) && (
            <button 
              className={`btn text-start w-100 fw-semibold rounded-3 py-2 px-3 transition-hover ${vistaActiva === 'gastronomia' ? 'btn-caribe-sobrio shadow' : 'btn-outline-light border-0 opacity-75'}`}
              onClick={() => setVistaActiva('gastronomia')}
            >
              <i className="bi bi-cup-hot me-2"></i> Gastronomía
            </button>
          )}

          {(rolUsuario === 'experiencias' || isSuperAdmin) && (
            <button 
              className={`btn text-start w-100 fw-semibold rounded-3 py-2 px-3 transition-hover ${vistaActiva === 'experiencias' ? 'btn-caribe-sobrio shadow' : 'btn-outline-light border-0 opacity-75'}`}
              onClick={() => setVistaActiva('experiencias')}
            >
              <i className="bi bi-compass me-2"></i> Experiencias
            </button>
          )}

          {(rolUsuario === 'eventos' || isSuperAdmin) && (
            <button 
              className={`btn text-start w-100 fw-semibold rounded-3 py-2 px-3 transition-hover ${vistaActiva === 'eventos' ? 'btn-caribe-sobrio shadow' : 'btn-outline-light border-0 opacity-75'}`}
              onClick={() => setVistaActiva('eventos')}
            >
              <i className="bi bi-calendar-event me-2"></i> Eventos
            </button>
          )}
        </div>

        <div className="mt-auto border-top border-secondary border-opacity-25 pt-4">
          <div className="d-flex align-items-center">
            <div className={`bg-caribe-sobrio text-white rounded-circle d-flex justify-content-center align-items-center me-3 ${isSuperAdmin ? 'border border-2 border-warning' : ''}`} style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-person-fill fs-5"></i>
            </div>
            <div>
              <p className="mb-0 fw-bold fs-6">Moisés Patrón</p>
              <small className={`text-capitalize ${isSuperAdmin ? 'text-warning fw-bold' : 'opacity-75'}`}>
                {isSuperAdmin ? 'Super Administrador' : rolUsuario}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          ÁREA DE CONTENIDO PRINCIPAL
      ========================================== */}
      <div className="flex-grow-1 p-5 overflow-auto">
        
        {/* VISTA 1: DASHBOARD (Resumen General) */}
        {vistaActiva === 'dashboard' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
              <h2 className="fw-bold mb-0" style={{ color: '#1a2e3b' }}>Resumen General</h2>
              <div>
                <button className="btn btn-caribe-sobrio fw-bold me-3 shadow-sm" onClick={irANuevoRegistro}>
                  <i className="bi bi-plus-lg me-1"></i> Nuevo Registro
                </button>
                <button className="btn btn-outline-danger fw-bold rounded-pill" onClick={handleCerrarSesion}>
                  Cerrar Sesión
                </button>
              </div>
            </div>

            {/* Tarjetas de Estadísticas Modernas */}
            <div className="row mb-5 g-4">
              <div className="col-md-4">
                <div className="card shadow-sm border-0 rounded-4 h-100 bg-white position-relative overflow-hidden">
                  <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', backgroundColor: '#0f766e' }}></div>
                  <div className="card-body p-4 d-flex align-items-center">
                    <div className="bg-light rounded-circle d-flex justify-content-center align-items-center me-4" style={{ width: '60px', height: '60px', color: '#0f766e' }}>
                       <i className="bi bi-building fs-3"></i>
                    </div>
                    <div>
                      <p className="text-muted fw-bold mb-1 text-uppercase" style={{ fontSize: '0.8rem' }}>Mis Registros</p>
                      <h3 className="fw-bold mb-0" style={{ color: '#1a2e3b' }}>12</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm border-0 rounded-4 h-100 bg-white position-relative overflow-hidden">
                  <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', backgroundColor: '#2dd4bf' }}></div>
                  <div className="card-body p-4 d-flex align-items-center">
                    <div className="bg-light rounded-circle d-flex justify-content-center align-items-center me-4" style={{ width: '60px', height: '60px', color: '#2dd4bf' }}>
                       <i className="bi bi-people fs-3"></i>
                    </div>
                    <div>
                      <p className="text-muted fw-bold mb-1 text-uppercase" style={{ fontSize: '0.8rem' }}>Vistas a mi perfil</p>
                      <h3 className="fw-bold mb-0" style={{ color: '#1a2e3b' }}>342</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm border-0 rounded-4 h-100 bg-white position-relative overflow-hidden">
                  <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', backgroundColor: '#eab308' }}></div>
                  <div className="card-body p-4 d-flex align-items-center">
                    <div className="bg-light rounded-circle d-flex justify-content-center align-items-center me-4" style={{ width: '60px', height: '60px', color: '#eab308' }}>
                       <i className="bi bi-bookmark-check fs-3"></i>
                    </div>
                    <div>
                      <p className="text-muted fw-bold mb-1 text-uppercase" style={{ fontSize: '0.8rem' }}>Interacciones</p>
                      <h3 className="fw-bold mb-0" style={{ color: '#1a2e3b' }}>56</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla CRUD */}
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
              <div className="card-header bg-white border-bottom py-4 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0" style={{ color: '#1a2e3b' }}>Gestión de Catálogo</h5>
                <span className="badge bg-light text-muted border px-3 py-2 rounded-pill">Últimos Registros</span>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <tr>
                      <th className="px-4 py-3 border-0">Nombre</th>
                      <th className="px-4 py-3 border-0">Categoría</th>
                      <th className="px-4 py-3 border-0">Ubicación</th>
                      <th className="px-4 py-3 border-0">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 fw-semibold">Mi Negocio Local</td>
                      <td className="px-4 py-3 text-muted text-capitalize"><i className="bi bi-shop me-2"></i>{rolUsuario}</td>
                      <td className="px-4 py-3">Santiago de Tolú</td>
                      <td className="px-4 py-3"><span className="badge bg-success bg-opacity-25 text-success rounded-pill px-3">Activo</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 2: FORMULARIO ALOJAMIENTOS */}
        {(vistaActiva === 'alojamientos' && (rolUsuario === 'alojamiento' || isSuperAdmin)) && (
          <div className="d-flex flex-column gap-5 pb-5 mx-auto" style={{ maxWidth: '900px' }}>
            <FormularioAlojamiento />
            <GestionHabitaciones />
          </div>
        )}
        
        {/* VISTA 3: FORMULARIO GASTRONOMIA */}
        {(vistaActiva === 'gastronomia' && (rolUsuario === 'gastronomia' || isSuperAdmin)) && (
          <div className="d-flex flex-column gap-4 pb-5 mx-auto" style={{ maxWidth: '900px' }}>
            <FormularioGastronomia />
          </div>
        )}
        
        {/* VISTA 4: FORMULARIO EXPERIENCIAS */}
        {(vistaActiva === 'experiencias' && (rolUsuario === 'experiencias' || isSuperAdmin)) && (
          <div className="d-flex flex-column gap-4 pb-5 mx-auto" style={{ maxWidth: '900px' }}>
             <FormularioExperiencias />
          </div>
        )}

        {/* VISTA 5: FORMULARIO EVENTOS */}
        {(vistaActiva === 'eventos' && (rolUsuario === 'eventos' || isSuperAdmin)) && (
          <div className="d-flex flex-column gap-4 pb-5 mx-auto" style={{ maxWidth: '900px' }}>
            <FormularioEventos />
          </div>
        )}

      </div>
    </div>
  );
};