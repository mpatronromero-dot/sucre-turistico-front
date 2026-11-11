import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

export const Gastronomia = () => {
  const [restaurantes, setRestaurantes] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para los filtros
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Petición a través del API Gateway (/api/gastronomia)
        const response = await api.get('/gastronomia');
        const result = response.data;
        
        if (result.status === 'success') {
          setRestaurantes(result.data || []);
        }
      } catch (error) {
        console.error("Error al cargar restaurantes:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  // Lógica de filtrado alineada con las columnas reales de MySQL ('tipo' y 'municipio')
  const restaurantesFiltrados = restaurantes.filter((lugar) => {
    const tipoRestaurante = lugar.tipo || lugar.tipo_comida || '';
    const coincideMunicipio = filtroMunicipio === '' || lugar.municipio === filtroMunicipio;
    const coincideEspecialidad = filtroEspecialidad === '' || tipoRestaurante === filtroEspecialidad;
    return coincideMunicipio && coincideEspecialidad;
  });

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success mb-3" role="status"></div>
        <h5 className="text-muted">Cargando restaurantes...</h5>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Gastronomía en Sucre</h2>
      
      <div className="row">
        {/* BARRA LATERAL (SIDEBAR DE FILTROS) */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '20px' }}>
            <h5 className="fw-bold mb-4"><i className="bi bi-funnel-fill text-primary"></i> Filtros</h5>
            
            {/* Filtro: Municipio */}
            <div className="mb-4">
              <label className="fw-semibold mb-2">Ubicación</label>
              <select className="form-select" value={filtroMunicipio} onChange={(e) => setFiltroMunicipio(e.target.value)}>
                <option value="">Todos los municipios</option>
                <option value="Sincelejo">Sincelejo</option>
                <option value="Coveñas">Coveñas</option>
                <option value="Tolú">Tolú</option>
                <option value="San Onofre">San Onofre</option>
                <option value="San Antero">San Antero</option>
              </select>
            </div>

            {/* Filtro: Especialidad */}
            <div className="mb-4">
              <label className="fw-semibold mb-2">Tipo de Comida</label>
              <select className="form-select" value={filtroEspecialidad} onChange={(e) => setFiltroEspecialidad(e.target.value)}>
                <option value="">Todas las opciones</option>
                <option value="Almuerzo / Corriente">Almuerzo / Corriente</option>
                <option value="Mariscos y Pescados">Mariscos y Pescados</option>
                <option value="Comida Tradicional / Típica">Comida Tradicional / Típica</option>
                <option value="Comida Rápida">Comida Rápida</option>
                <option value="Comida vegana">Comida Vegana</option>
              </select>
            </div>

            <button className="btn btn-outline-danger w-100" onClick={() => { setFiltroMunicipio(''); setFiltroEspecialidad(''); }}>
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* LISTADO DE RESULTADOS */}
        <div className="col-lg-9">
          {restaurantesFiltrados.length === 0 ? (
            <div className="alert alert-warning border-0 shadow-sm text-center py-5">
              <h5 className="fw-bold mb-1">No hay restaurantes</h5>
              <p className="mb-0 text-muted">Intenta cambiar los filtros para ver más opciones.</p>
            </div>
          ) : (
            <div className="row g-4">
              {restaurantesFiltrados.map((lugar) => {
                const tipoComidaText = lugar.tipo || lugar.tipo_comida || 'Gastronomía';

                return (
                  <div className="col-md-6 col-lg-6" key={lugar.id}>
                    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                      <img 
                        src={lugar.imagen_url || lugar.imagen_portada || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80'} 
                        className="card-img-top" 
                        alt={lugar.nombre} 
                        style={{ height: '200px', objectFit: 'cover' }} 
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80'; 
                        }}
                      />
                      
                      <div className="card-body p-4 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title fw-bold text-dark mb-0">{lugar.nombre}</h5>
                          <span className="badge bg-warning text-dark">{tipoComidaText}</span>
                        </div>
                        
                        <p className="text-muted small mb-3">
                          <i className="bi bi-geo-alt-fill text-danger me-1"></i> 
                          {lugar.municipio} {lugar.direccion ? `- ${lugar.direccion}` : ''}
                        </p>
                        
                        <p className="card-text text-secondary mb-4 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {lugar.descripcion}
                        </p>
                        
                        <button 
                          onClick={() => navigate(`/gastronomia/${lugar.id}`)} 
                          className="btn btn-success w-100 fw-bold rounded-pill"
                        >
                          Ver Carta y Reservar <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};