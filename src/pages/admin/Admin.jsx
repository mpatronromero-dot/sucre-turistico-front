import React, { useState } from 'react';

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
              <button className="btn btn-success fw-bold" onClick={() => setVistaActiva('alojamientos')}>Nuevo Registro</button>
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
          <div className="card shadow-sm border-0 rounded-4 p-4 mx-auto" style={{ maxWidth: '800px' }}>
            <h4 className="mb-4 text-primary fw-bold">Registrar Nuevo Alojamiento</h4>
            <form onSubmit={handleSubmitAlojamiento}>
              <div className="row mb-3">
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-bold">Nombre del Hotel/Hostal</label>
                  <input type="text" className="form-control" name="nombre" value={alojamiento.nombre} onChange={handleChangeAlojamiento} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Municipio</label>
                  <select className="form-select" name="municipio" value={alojamiento.municipio} onChange={handleChangeAlojamiento} required>
                    <option value="">Selecciona uno...</option>
                    <option value="Coveñas">Coveñas</option>
                    <option value="Santiago de Tolú">Santiago de Tolú</option>
                    <option value="San Onofre">San Onofre</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Tipo de Alojamiento</label>
                  <select className="form-select" name="tipo" value={alojamiento.tipo} onChange={handleChangeAlojamiento} required>
                    <option value="">Selecciona uno...</option>
                    <option value="Hotel frente al mar">Hotel frente al mar</option>
                    <option value="Hostal">Hostal</option>
                    <option value="Cabaña">Cabaña</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold">Descripción</label>
                <textarea className="form-control" name="descripcion" value={alojamiento.descripcion} onChange={handleChangeAlojamiento} rows="3" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-bold">Guardar Alojamiento</button>
            </form>
          </div>
        )}

        {/* VISTA 3: FORMULARIO GASTRONOMÍA */}
        {vistaActiva === 'gastronomia' && (
          <div className="card shadow-sm border-0 rounded-4 p-4 mx-auto" style={{ maxWidth: '800px' }}>
            <h4 className="mb-4 text-success fw-bold">Registrar Nuevo Plato Típico</h4>
            <form onSubmit={handleSubmitGastronomia}>
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre del Plato</label>
                <input type="text" className="form-control" name="nombre_plato" value={gastronomia.nombre_plato} onChange={(e) => setGastronomia({...gastronomia, [e.target.name]: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Lugar Típico / Municipio</label>
                <input type="text" className="form-control" name="lugar_tipico" value={gastronomia.lugar_tipico} onChange={(e) => setGastronomia({...gastronomia, [e.target.name]: e.target.value})} required />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold">Descripción</label>
                <textarea className="form-control" name="descripcion" value={gastronomia.descripcion} onChange={(e) => setGastronomia({...gastronomia, [e.target.name]: e.target.value})} rows="3" required></textarea>
              </div>
              <button type="submit" className="btn btn-success w-100 fw-bold">Guardar Plato</button>
            </form>
          </div>
        )}

        {/* VISTA 4: FORMULARIO EXPERIENCIAS */}
        {vistaActiva === 'experiencias' && (
          <div className="card shadow-sm border-0 rounded-4 p-4 mx-auto" style={{ maxWidth: '800px' }}>
            <h4 className="mb-4 text-warning fw-bold">Registrar Nueva Experiencia</h4>
            <form onSubmit={handleSubmitExperiencia}>
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre de la Experiencia</label>
                <input type="text" className="form-control" name="nombre" value={experiencia.nombre} onChange={(e) => setExperiencia({...experiencia, [e.target.name]: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Costo Estimado</label>
                <input type="text" className="form-control" name="costo_estimado" value={experiencia.costo_estimado} onChange={(e) => setExperiencia({...experiencia, [e.target.name]: e.target.value})} required />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold">Descripción</label>
                <textarea className="form-control" name="descripcion" value={experiencia.descripcion} onChange={(e) => setExperiencia({...experiencia, [e.target.name]: e.target.value})} rows="3" required></textarea>
              </div>
              <button type="submit" className="btn btn-warning w-100 fw-bold text-dark">Guardar Experiencia</button>
            </form>
          </div>
        )}

        {/* VISTA 5: FORMULARIO EVENTOS */}
        {vistaActiva === 'eventos' && (
          <div className="card shadow-sm border-0 rounded-4 p-4 mx-auto" style={{ maxWidth: '800px' }}>
            <h4 className="mb-4 text-info fw-bold">Registrar Nuevo Evento</h4>
            <form onSubmit={handleSubmitEvento}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Nombre del Evento</label>
                  <input type="text" className="form-control" name="nombre" value={evento.nombre} onChange={(e) => setEvento({...evento, [e.target.name]: e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Fecha / Época</label>
                  <input type="text" className="form-control" name="fecha" value={evento.fecha} onChange={(e) => setEvento({...evento, [e.target.name]: e.target.value})} required />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Municipio</label>
                <select className="form-select" name="municipio" value={evento.municipio} onChange={(e) => setEvento({...evento, [e.target.name]: e.target.value})} required>
                  <option value="">Selecciona uno...</option>
                  <option value="Sincelejo">Sincelejo</option>
                  <option value="Coveñas">Coveñas</option>
                  <option value="San Onofre">San Onofre</option>
                  <option value="Santiago de Tolú">Santiago de Tolú</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold">Descripción</label>
                <textarea className="form-control" name="descripcion" value={evento.descripcion} onChange={(e) => setEvento({...evento, [e.target.name]: e.target.value})} rows="3" required></textarea>
              </div>
              <button type="submit" className="btn btn-info text-white w-100 fw-bold">Guardar Evento</button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};