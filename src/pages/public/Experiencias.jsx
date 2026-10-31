import React, { useEffect, useState } from 'react';
// Ya no necesitamos importar getExperiencias si hacemos el fetch directo

export const Experiencias = () => {
  const [experiencias, setExperiencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        // Hacemos la petición directamente al puerto 3004 garantizando la ruta correcta
        const response = await fetch('http://localhost:3004/api/experiencias');
        const data = await response.json();
        
        // Extraemos el array de datos sin importar si el backend lo mandó directo o dentro de un objeto
        const datosReales = Array.isArray(data) ? data : (data.data || []);
        setExperiencias(datosReales);
      } catch (error) {
        console.error("Error cargando experiencias desde el backend:", error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const filtradas = experiencias.filter(e => 
    (filtroMunicipio === '' || e.municipio === filtroMunicipio) &&
    (filtroTipo === '' || e.tipo === filtroTipo)
  );

  if (cargando) return <div className="container py-5 text-center"><h5>Cargando catálogo...</h5></div>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Experiencias y Tours</h2>
      <div className="row">
        
        {/* Sidebar de Filtros */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '20px' }}>
            <h5 className="fw-bold mb-4"><i className="bi bi-funnel-fill text-info"></i> Filtros</h5>
            <div className="mb-4">
              <label className="fw-semibold mb-2">Ubicación</label>
              <select className="form-select" value={filtroMunicipio} onChange={e => setFiltroMunicipio(e.target.value)}>
                <option value="">Todas</option>
                <option value="Coveñas">Coveñas</option>
                <option value="Tolú">Tolú</option>
                <option value="San Onofre">San Onofre</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="fw-semibold mb-2">Categoría</label>
              <select className="form-select" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
                <option value="">Cualquiera</option>
                <option value="Náutico">Náutico</option>
                <option value="Ecológico">Ecológico</option>
                <option value="Cultural">Cultural</option>
              </select>
            </div>
            <button className="btn btn-outline-info w-100 text-dark fw-bold" onClick={() => { setFiltroMunicipio(''); setFiltroTipo(''); }}>
              Limpiar
            </button>
          </div>
        </div>

        {/* Resultados Dinámicos */}
        <div className="col-lg-9">
          {filtradas.length === 0 ? (
            <div className="alert alert-light text-center border p-5">
              <h5 className="fw-bold text-muted">Aún no hay experiencias publicadas.</h5>
              <p className="mb-0">Las nuevas actividades registradas en el panel de administración aparecerán aquí.</p>
            </div>
          ) : (
            filtradas.map(lugar => (
              <div key={lugar.id} className="card shadow-sm border-0 mb-4 overflow-hidden">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap">
                    
                    {/* Info Básica */}
                    <div className="pe-md-4" style={{ flex: '1 1 auto' }}>
                      <h3 className="card-title fw-bold text-dark">{lugar.nombre}</h3>
                      <p className="text-muted mb-2">
                        <i className="bi bi-geo-alt-fill text-danger"></i> {lugar.municipio} &bull; {lugar.tipo}
                      </p>
                      <p className="text-secondary">{lugar.descripcion}</p>
                      
                      {/* Botón de Video (Si existe URL) */}
                      {lugar.video_url && (
                        <a href={lugar.video_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-danger fw-bold mt-2">
                          <i className="bi bi-youtube"></i> Ver Video
                        </a>
                      )}
                    </div>
                    
                    {/* Caja de Precio y Reserva */}
                    <div className="bg-info bg-opacity-10 p-3 rounded text-end border border-info border-opacity-25 mt-3 mt-md-0" style={{ minWidth: '220px' }}>
                      <span className="d-block text-muted small fw-bold text-uppercase">{lugar.tipo_tarifa || 'Tarifa Estándar'}</span>
                      <span className="fs-3 fw-bold text-dark">$ {new Intl.NumberFormat('es-CO').format(lugar.costo_estimado)}</span>
                      <button className="btn btn-info fw-bold d-block w-100 mt-2 text-white shadow-sm">
                        Reservar
                      </button>
                    </div>
                  </div>

                  {/* Imagen Real desde la Base de Datos */}
                  {lugar.imagen_url && (
                    <div className="mt-3">
                      <img 
                        src={lugar.imagen_url} 
                        alt={lugar.nombre} 
                        className="img-fluid rounded w-100 object-fit-cover shadow-sm" 
                        style={{ maxHeight: '350px' }} 
                        onError={(e) => { e.target.style.display = 'none'; }} // Oculta si el enlace de la imagen está roto
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};