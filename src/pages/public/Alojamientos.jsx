import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
        // Asegúrate de que el puerto 3005 (API Gateway) esté corriendo
        const response = await fetch('http://localhost:3005/api/alojamientos');
        const result = await response.json();
        
        if (result.status === 'success') {
          setAlojamientos(result.data);
        }
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

  // Pantalla de carga mientras responde Railway
  if (cargando) {
    return <div className="container py-5 text-center"><h5 className="text-primary">Cargando hoteles y cabañas...</h5></div>;
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-dark">Alojamientos en Sucre</h2>
      
      <div className="row">
        {/* ==========================================
            BARRA LATERAL (FILTROS)
        ========================================== */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '20px' }}>
            <h5 className="fw-bold mb-4"><i className="bi bi-funnel-fill text-primary"></i> Filtros</h5>
            
            <div className="mb-4">
              <label className="fw-semibold mb-2">Ubicación</label>
              <select 
                className="form-select" 
                value={filtroMunicipio} 
                onChange={(e) => setFiltroMunicipio(e.target.value)}
              >
                <option value="">Todos los municipios</option>
                <option value="Coveñas">Coveñas</option>
                <option value="Santiago de Tolú">Santiago de Tolú</option>
                <option value="San Onofre">San Onofre</option>
              </select>
            </div>
            
            <button className="btn btn-outline-danger w-100 fw-bold" onClick={() => setFiltroMunicipio('')}>
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* ==========================================
            LISTADO DE RESULTADOS (TARJETAS)
        ========================================== */}
        <div className="col-lg-9">
          {alojamientosFiltrados.length === 0 ? (
            <div className="alert alert-warning border-0 shadow-sm text-center py-5 rounded-4">
              <h5 className="fw-bold mb-1">No hay alojamientos</h5>
              <p className="mb-0 text-muted">Intenta cambiar los filtros para ver más opciones.</p>
            </div>
          ) : (
            alojamientosFiltrados.map((hotel) => (
              <div key={hotel.id} className="card shadow-sm border-0 mb-4 rounded-4 overflow-hidden">
                <div className="row g-0">
                  {/* Imagen del Alojamiento (Por ahora genérica de Unsplash) */}
                  <div className="col-md-4">
                    <img 
                      src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80" 
                      className="img-fluid h-100 object-fit-cover" 
                      alt="Hotel" 
                      style={{ minHeight: '200px' }}
                    />
                  </div>
                  
                  {/* Datos traídos de la Base de Datos */}
                  <div className="col-md-8">
                    <div className="card-body p-4 d-flex flex-column h-100">
                      <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap">
                        <div>
                          {/* NOMBRE DEL ALOJAMIENTO */}
                          <h4 className="card-title fw-bold text-primary mb-1">{hotel.nombre}</h4>
                          {/* MUNICIPIO */}
                          <p className="text-muted small mb-0">
                            <i className="bi bi-geo-alt-fill text-danger"></i> {hotel.municipio}
                          </p>
                        </div>
                        {/* TIPO (Hotel, Cabaña, Hostal) */}
                        <span className="badge bg-info text-dark mt-2 mt-md-0 px-3 py-2 rounded-pill shadow-sm">
                          {hotel.tipo}
                        </span>
                      </div>
                      
                      {/* DESCRIPCIÓN */}
                      <p className="card-text text-secondary mt-3">{hotel.descripcion}</p>
                      
                      <div className="mt-auto text-end pt-3">
                        <button className="btn btn-primary fw-bold px-4 rounded-pill"  onClick={() => navigate(`/alojamientos/${hotel.id}`)}>
                        Ver Detalles
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