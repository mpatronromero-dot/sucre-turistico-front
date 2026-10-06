import React, { useEffect, useState } from 'react';
import { getAlojamientos } from '../../api/alojamientosService';

export const Alojamientos = () => {
 const [alojamientos, setAlojamientos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 1. Estados para los filtros (Facets)
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroPrecio, setFiltroPrecio] = useState('');

  const mockImages = [
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    "https://images.unsplash.com/photo-1540541338287-41700207dca6?w=800&q=80"
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Hacemos la llamada real a tu API Gateway en el puerto 3005
        const response = await fetch('http://localhost:3005/api/alojamientos');
        const result = await response.json();
        
        if (result.status === 'success') {
          // Guardamos los datos de Railway en la variable alojamientos
          setAlojamientos(result.data);
        }
      } catch (error) {
        console.error("Error al cargar los alojamientos desde la nube:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  // 2. Lógica de Filtrado Dinámico
  const alojamientosFiltrados = alojamientos.filter((lugar) => {
    // Verifica si el municipio coincide (o si no hay filtro seleccionado)
    const coincideMunicipio = filtroMunicipio === '' || lugar.municipio === filtroMunicipio;
    
    // Verifica el rango de precios
    let coincidePrecio = true;
    /*
    const precioNumerico = parseInt(String(lugar.precio).replace(/\./g, '')); // Limpia los puntos si vienen del backend
    
    if (filtroPrecio === 'economico') coincidePrecio = precioNumerico <= 500000;
    if (filtroPrecio === 'premium') coincidePrecio = precioNumerico > 500000;
    */
    return coincideMunicipio && coincidePrecio;
  });

  if (cargando) return <div className="container py-5 text-center"><h5>Cargando alojamientos...</h5></div>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Alojamientos en Sucre</h2>
      
      <div className="row">
        {/* BARRA LATERAL (SIDEBAR DE FILTROS) */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '20px' }}>
            <h5 className="fw-bold mb-4"><i className="bi bi-funnel-fill text-primary"></i> Filtros</h5>
            
            {/* Filtro: Municipio */}
            <div className="mb-4">
              <label className="fw-semibold mb-2">Ubicación</label>
              <select 
                className="form-select" 
                value={filtroMunicipio} 
                onChange={(e) => setFiltroMunicipio(e.target.value)}
              >
                <option value="">Todos los municipios</option>
                <option value="Coveñas">Coveñas</option>
                <option value="Tolú">Santiago de Tolú</option>
                <option value="San Onofre">San Onofre</option>
              </select>
            </div>

            {/* Filtro: Rango de Precio */}
            <div className="mb-4">
              <label className="fw-semibold mb-2">Rango por noche</label>
              <div className="form-check mb-2">
                <input className="form-check-input" type="radio" name="precio" id="precioTodos" value="" checked={filtroPrecio === ''} onChange={(e) => setFiltroPrecio(e.target.value)} />
                <label className="form-check-label" htmlFor="precioTodos">Cualquier precio</label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input" type="radio" name="precio" id="precioEco" value="economico" checked={filtroPrecio === 'economico'} onChange={(e) => setFiltroPrecio(e.target.value)} />
                <label className="form-check-label" htmlFor="precioEco">Económico (Hasta $500.000)</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="precio" id="precioPremium" value="premium" checked={filtroPrecio === 'premium'} onChange={(e) => setFiltroPrecio(e.target.value)} />
                <label className="form-check-label" htmlFor="precioPremium">Premium (Más de $500.000)</label>
              </div>
            </div>

            <button className="btn btn-outline-danger w-100" onClick={() => { setFiltroMunicipio(''); setFiltroPrecio(''); }}>
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* LISTADO DE RESULTADOS */}
        <div className="col-lg-9">
          {alojamientosFiltrados.length === 0 ? (
            <div className="alert alert-warning border-0 shadow-sm text-center py-5">
              <h5 className="fw-bold mb-1">No hay resultados</h5>
              <p className="mb-0 text-muted">Intenta cambiar los filtros para ver más opciones de hospedaje.</p>
            </div>
          ) : (
            alojamientosFiltrados.map((lugar) => (
              <div key={lugar.id} className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap">
                    <div>
              <h3 className="card-title fw-bold">{lugar.nombre}</h3>
              <p className="text-muted mb-0"><i className="bi bi-geo-alt-fill"></i> {lugar.municipio} • {lugar.tipo}</p>
              {/* Aquí agregamos la descripción que viene de la base de datos */}
              <p className="mt-2 text-secondary">{lugar.descripcion}</p>
            </div>
            <div className="bg-success bg-opacity-10 p-3 rounded text-end border border-success border-opacity-25 mt-3 mt-md-0">
              {/* Como no hay precio, cambiamos este texto temporalmente */}
              <span className="d-block text-muted small fw-bold">Sucre Turístico</span>
              <span className="fs-5 fw-bold text-dark d-block mb-2">¡Reserva Ahora!</span>
              <button className="btn btn-success fw-bold d-block w-100 mt-2">Ver oferta {'>'}</button>
            </div>
                  </div>
                  
                  {/* Cuadrícula de Imágenes simplificada */}
                  <div className="row g-2 mt-3">
                    <div className="col-md-6">
                      <img src={mockImages[0]} alt="Principal" className="img-fluid rounded w-100 h-100 object-fit-cover" style={{ minHeight: '250px' }} />
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};