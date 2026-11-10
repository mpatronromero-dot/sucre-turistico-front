
import React, { useState } from 'react';
import { FormularioAlojamiento } from '../../components/FormularioAlojamiento';
import { GestionHabitaciones } from '../../components/GestionHabitaciones';
import { FormularioGastronomia } from '../../components/FormularioGastronomia';
import { FormularioExperiencias } from '../../components/FormularioExperiencias';
import { FormularioEventos } from '../../components/FormularioEventos';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Admin = () => {
  // --- 1. ESTADO DE NAVEGACIÓN (El "Switch" de las vistas) ---
  const [vistaActiva, setVistaActiva] = useState('dashboard');

  // --- 2. ESTADOS DE LOS FORMULARIOS ---
  const [alojamiento, setAlojamiento] = useState({ nombre: '', municipio: '', tipo: '', descripcion: '' });
  const [gastronomia, setGastronomia] = useState({ nombre_plato: '', descripcion: '', lugar_tipico: '' });
  const [experiencia, setExperiencia] = useState({ nombre: '', descripcion: '', costo_estimado: '' });
  const [evento, setEvento] = useState({ nombre: '', fecha: '', municipio: '', descripcion: '' });

  // --- 3. FUNCIONES DE ENVÍO (POST) ---
  const handleChangeAlojamiento = (e) => setAlojamiento({ ...alojamiento, [e.target.name]: e.target.value });

  const handleSubmitAlojamiento = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3005/api/alojamientos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(alojamiento)
      });
      if ((await response.json()).status === 'success') {
        alert("¡Alojamiento guardado con éxito!");
        setAlojamiento({ nombre: '', municipio: '', tipo: '', descripcion: '' });
      }
    } catch (error) { console.error(error); alert("Error de conexión"); }
  };

  const handleSubmitGastronomia = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3005/api/gastronomia', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(gastronomia)
      });
      if ((await response.json()).status === 'success') {
        alert("¡Plato guardado con éxito!");
        setGastronomia({ nombre_plato: '', descripcion: '', lugar_tipico: '' });
      }
    } catch (error) { console.error(error); alert("Error de conexión"); }
  };

  const handleSubmitExperiencia = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3005/api/experiencias', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(experiencia)
      });
      if ((await response.json()).status === 'success') {
        alert("¡Experiencia guardada con éxito!");
        setExperiencia({ nombre: '', descripcion: '', costo_estimado: '' });
      }
    } catch (error) { console.error(error); alert("Error de conexión"); }
  };

  const handleSubmitEvento = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3005/api/eventos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(evento)
      });
      if ((await response.json()).status === 'success') {
        alert("¡Evento guardado con éxito!");
        setEvento({ nombre: '', fecha: '', municipio: '', descripcion: '' });
      }
    } catch (error) { console.error(error); alert("Error de conexión"); }
  };
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    Swal.fire({
      title: '¿Deseas cerrar sesión?',
      text: "Tendrás que volver a ingresar tu correo y contraseña.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545', // Rojo para salir
      cancelButtonColor: '#6c757d', // Gris para cancelar
      confirmButtonText: 'Salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // 1. Eliminamos las credenciales de la memoria
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        
        // 2. Lo enviamos al login
        navigate('/login', { replace: true });
      }
    });
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      
      {/* ==========================================
          SIDEBAR (Menú Lateral)
      ========================================== */}
      <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: '250px' }}>
        <h4 className="text-info fw-bold mb-4 mt-2">Panel Admin</h4>
        
        <div className="nav flex-column gap-2">
          <button 
            className={`btn text-start w-100 ${vistaActiva === 'dashboard' ? 'btn-primary' : 'btn-dark text-white'}`}
            onClick={() => setVistaActiva('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`btn text-start w-100 ${vistaActiva === 'alojamientos' ? 'btn-primary' : 'btn-dark text-white'}`}
            onClick={() => setVistaActiva('alojamientos')}
          >
            Alojamientos
          </button>
          <button 
            className={`btn text-start w-100 ${vistaActiva === 'gastronomia' ? 'btn-primary' : 'btn-dark text-white'}`}
            onClick={() => setVistaActiva('gastronomia')}
          >
            Gastronomía
          </button>
          <button 
            className={`btn text-start w-100 ${vistaActiva === 'experiencias' ? 'btn-primary' : 'btn-dark text-white'}`}
            onClick={() => setVistaActiva('experiencias')}
          >
            Experiencias
          </button>
          <button 
            className={`btn text-start w-100 ${vistaActiva === 'eventos' ? 'btn-primary' : 'btn-dark text-white'}`}
            onClick={() => setVistaActiva('eventos')}
          >
            Eventos
          </button>
        </div>

        <div className="mt-auto border-top border-secondary pt-3">
          <p className="mb-0 fw-bold">Moisés Patrón</p>
          <small className="text-muted">Administrador</small>
        </div>
      </div>

      {/* ==========================================
          ÁREA DE CONTENIDO PRINCIPAL
      ========================================== */}
      <div className="flex-grow-1 p-4">
        
        {/* VISTA 1: DASHBOARD (Resumen General) */}
        {vistaActiva === 'dashboard' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
  <h2 className="fw-bold">Resumen General</h2>
  <div>
    <button className="btn btn-success fw-bold me-2" onClick={() => setVistaActiva('alojamientos')}>Nuevo Registro</button>
    <button className="btn btn-outline-danger fw-bold" onClick={handleCerrarSesion}>Cerrar Sesión</button>
  </div>
</div>

            {/* Tarjetas de Estadísticas */}
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="card shadow-sm border-0 border-start border-primary border-4 py-2">
                  <div className="card-body">
                    <p className="text-muted fw-bold mb-1">Total Alojamientos</p>
                    <h3 className="fw-bold mb-0">124</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm border-0 border-start border-success border-4 py-2">
                  <div className="card-body">
                    <p className="text-muted fw-bold mb-1">Turistas Registrados</p>
                    <h3 className="fw-bold mb-0">8,432</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm border-0 border-start border-warning border-4 py-2">
                  <div className="card-body">
                    <p className="text-muted fw-bold mb-1">Reservas Activas</p>
                    <h3 className="fw-bold mb-0">56</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla CRUD */}
            <div className="card shadow-sm border-0 p-4">
              <h5 className="fw-bold mb-3">Gestión de Catálogo (Últimos Registros)</h5>
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Ubicación</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Hotel el Velero</td>
                    <td>Alojamiento</td>
                    <td>Santiago de Tolú</td>
                    <td><span className="badge bg-success">Activo</span></td>
                  </tr>
                  <tr>
                    <td>Tour Islas San Bernardo</td>
                    <td>Experiencia</td>
                    <td>Tolú</td>
                    <td><span className="badge bg-success">Activo</span></td>
                  </tr>
                  <tr>
                    <td>Restaurante El Pargo</td>
                    <td>Gastronomía</td>
                    <td>San Onofre</td>
                    <td><span className="badge bg-danger">Inactivo</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

       {/* VISTA 2: FORMULARIO ALOJAMIENTOS */}
{vistaActiva === 'alojamientos' && (
  <div className="d-flex flex-column gap-5 pb-5 mx-auto" style={{ maxWidth: '900px' }}>
    <FormularioAlojamiento />
    <GestionHabitaciones />
  </div>
)}
        {/* VISTA 3: FORMULARIO GASTRONOMIA */}
        {vistaActiva === 'gastronomia' && (
        <div className="d-flex flex-column gap-4 pb-5">
        <FormularioGastronomia />
        </div>
        )}
       {/* VISTA 4: FORMULARIO EXPERIENCIAS */}
        {vistaActiva === 'experiencias' && (
          <div className="d-flex flex-column gap-4 pb-5 mx-auto" style={{ maxWidth: '800px' }}>
             <FormularioExperiencias />
          </div>
        )}

      {/* VISTA 5: FORMULARIO EVENTOS */}
        {vistaActiva === 'eventos' && (
          <div className="d-flex flex-column gap-4 pb-5 mx-auto" style={{ maxWidth: '800px' }}>
            <FormularioEventos />
          </div>
        )}

      </div>
    </div>
  );
};