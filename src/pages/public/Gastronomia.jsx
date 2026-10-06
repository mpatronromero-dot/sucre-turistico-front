import React, { useEffect, useState } from 'react';
import { getGastronomia } from '../../api/gastronomiaService';

export const Gastronomia = () => {
 const [restaurantes, setRestaurantes] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para los filtros
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('');

  const mockImages = [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    "https://images.unsplash.com/photo-1579684947550-22e945225d9a?w=800&q=80",
    "https://images.unsplash.com/photo-1550847844-5315695dadac?w=800&q=80",
    "https://images.unsplash.com/photo-1544148103-0773bf18d302?w=800&q=80"
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/gastronomia');
        const result = await response.json();
        
        if (result.status === 'success') {
          setRestaurantes(result.data);
        }
      } catch (error) {
        console.error("Error al cargar gastronomía:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  // Lógica de Filtrado
  const restaurantesFiltrados = restaurantes.filter((lugar) => {
    const coincideMunicipio = filtroMunicipio === '' || lugar.municipio === filtroMunicipio;
    const coincideEspecialidad = filtroEspecialidad === '' || lugar.especialidad === filtroEspecialidad;
    return coincideMunicipio && coincideEspecialidad;
  });

  if (cargando) return <div className="container py-5 text-center"><h5>Cargando restaurantes...</h5></div>;

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
                <option value="Coveñas">Coveñas</option>
                <option value="Tolú">Santiago de Tolú</option>
                <option value="San Onofre">San Onofre</option>
              </select>
            </div>

            {/* Filtro: Especialidad */}
            <div className="mb-4">
              <label className="fw-semibold mb-2">Tipo de Comida</label>
              <select className="form-select" value={filtroEspecialidad} onChange={(e) => setFiltroEspecialidad(e.target.value)}>
                <option value="">Todas las opciones</option>
                <option value="Mariscos">Mariscos y Pescados</option>
                <option value="Tradicional">Comida Tradicional</option>
                <option value="Comida Rápida">Comida Rápida</option>
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
            restaurantesFiltrados.map((lugar) => (
              <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap">
            <div>
              <h3 className="card-title fw-bold text-success">{lugar.nombre_plato}</h3>
              <p className="text-muted mb-0"><i className="bi bi-geo-alt-fill"></i> {lugar.lugar_tipico}</p>
              <p className="mt-2 text-secondary">{lugar.descripcion}</p>
            </div>
            <div className="bg-success bg-opacity-10 p-3 rounded text-end border border-success border-opacity-25 mt-3 mt-md-0">
              <span className="d-block text-muted small fw-bold">Gastronomía</span>
              <span className="fs-5 fw-bold text-dark d-block mb-2">Sucre Turístico</span>
              <button className="btn btn-success fw-bold d-block w-100 mt-2">Ver Plato {'>'}</button>
            </div>
          </div>
                  </div>
                  
                  <div className="row g-2 mt-3">
                    <div className="col-md-6">
                      <img src={mockImages[0]} alt="Plato principal" className="img-fluid rounded w-100 h-100 object-fit-cover" style={{ minHeight: '250px' }} />
                    </div>
                    <div className="col-md-6">
                      <div className="row g-2 h-100">
                        <div className="col-6"><img src={mockImages[1]} className="img-fluid rounded w-100 h-100 object-fit-cover" /></div>
                        <div className="col-6"><img src={mockImages[2]} className="img-fluid rounded w-100 h-100 object-fit-cover" /></div>
                        <div className="col-12 mt-2"><img src={mockImages[3]} className="img-fluid rounded w-100 object-fit-cover" style={{ height: '120px' }} /></div>
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