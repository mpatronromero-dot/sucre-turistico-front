import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig'; // Asegúrate de tener importada tu instancia de API

export const Alojamientos = () => {
  // --- 1. ESTADOS ---
  const [alojamientos, setAlojamientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const navigate = useNavigate();

  // --- 2. CONSUMO DE LA API (GET) ---
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await api.get('/alojamientos');
        // Extraemos correctamente el array de datos manejando ambos formatos posibles
        const lista = response.data.data || response.data || [];
        setAlojamientos(Array.isArray(lista) ? lista : []);
      } catch (error) {
        console.error("Error al cargar alojamientos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  // --- 3. LÓGICA DE FILTRADO ---
  const alojamientosFiltrados = alojamientos.filter(hotel =>
    filtroMunicipio === '' || hotel.municipio === filtroMunicipio
  );

  // Pantalla de carga
  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <h5 className="text-muted fw-semibold">Cargando hoteles y cabañas del Golfo...</h5>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Encabezado Principal Estilizado */}
      <div className="mb-5">
        <h2 className="fw-bold text-dark display-6" style={{ fontFamily: 'serif' }}>Alojamientos en Sucre</h2>
        <p className="text-muted">Encuentra los mejores lugares para hospedarte frente al mar o en la ciudad.</p>
      </div>
      
      <div className="row g-4">
        {/* ==========================================
            BARRA LATERAL (FILTROS TIPO E-COMMERCE)
        ========================================== */}
        <div className="col-lg-3">
          <div className="card shadow-sm border-0 p-4 sticky-top rounded-4 bg-white" style={{ top: '20px' }}>
            <h5 className="fw-bold mb-4 text-dark"><i className="bi bi-funnel-fill text-primary me-2"></i> Filtros</h5>
            
            <div className="mb-4">
              <label className="fw-semibold small text-muted mb-2 text-uppercase">Ubicación</label>
              <select 
                className="form-select border-0 bg-light py-2" 
                value={filtroMunicipio} 
                onChange={(e) => setFiltroMunicipio(e.target.value)}
              >
                <option value="">Todos los municipios</option>
                <option value="Coveñas">Coveñas</option>
                <option value="Santiago de Tolú">Santiago de Tolú</option>
                <option value="San Onofre">San Onofre</option>
                <option value="Sincelejo">Sincelejo</option>
              </select>
            </div>
            
            <button className="btn btn-outline-danger w-100 fw-bold rounded-pill py-2" onClick={() => setFiltroMunicipio('')}>
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* ==========================================
            LISTADO DE RESULTADOS (TARJETAS HORIZONTALES)
        ========================================== */}
        <div className="col-lg-9">
          {alojamientosFiltrados.length === 0 ? (
            <div className="card border-0 shadow-sm text-center py-5 rounded-4 bg-white">
              <div className="card-body">
                <i className="bi bi-building-exclamation display-4 text-muted mb-3"></i>
                <h5 className="fw-bold mb-1 text-dark">No hay alojamientos disponibles</h5>
                <p className="mb-0 text-muted">Intenta cambiar los filtros para ver más opciones.</p>
              </div>
            </div>
          ) : (
            alojamientosFiltrados.map((hotel) => (
              <div key={hotel.id} className="card shadow-sm border-0 mb-4 rounded-4 overflow-hidden bg-white transition-hover">
                <div className="row g-0">
                  
                  {/* Imagen Real del Alojamiento (Cargada desde el Back-End / Multer) */}
                  <div className="col-md-4 position-relative" style={{ minHeight: '220px' }}>
                    <img 
                      src={hotel.imagen_url || 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80'} 
                      className="w-100 h-100 object-fit-cover" 
                      alt={hotel.nombre} 
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80'; }}
                    />
                    <span className="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 text-white px-3 py-2 rounded-pill backdrop-blur">
                      {hotel.tipo}
                    </span>
                  </div>
                  
                  {/* Datos del Alojamiento */}
                  <div className="col-md-8">
                    <div className="card-body p-4 d-flex flex-column justify-content-between h-100">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <span className="text-muted small fw-bold text-uppercase tracking-wider">
                              <i className="bi bi-geo-alt-fill text-danger me-1"></i> {hotel.municipio}
                            </span>
                            <h4 className="fw-bold text-dark mt-1 mb-2" style={{ fontFamily: 'serif' }}>{hotel.nombre}</h4>
                          </div>
                        </div>
                        
                        <p className="text-secondary small mb-4" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {hotel.descripcion}
                        </p>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                        <span className="text-success fw-bold fs-5">
                          {hotel.precio_noche ? `$${Number(hotel.precio_noche).toLocaleString()} / noche` : 'Consultar tarifa'}
                        </span>
                        <button 
                          className="btn btn-dark fw-bold px-4 rounded-pill shadow-sm" 
                          onClick={() => navigate(`/alojamientos/${hotel.id}`)}
                        >
                          Ver Detalles <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};