import React, { useEffect, useState } from 'react';

export const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroMes, setFiltroMes] = useState('');
  
  // Estado para controlar cuál evento está desplegado (acordeón)
  const [expandidoId, setExpandidoId] = useState(null);

  // Estado para la imagen seleccionada en pantalla completa (Lightbox)
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const response = await fetch('http://localhost:3006/api/eventos');
        const data = await response.json();
        const eventosReales = Array.isArray(data) ? data : (data.data || []);
        setEventos(eventosReales);
      } catch (error) {
        console.error("Error cargando eventos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarEventos();
  }, []);

  const toggleExpandir = (id) => {
    setExpandidoId(expandidoId === id ? null : id);
  };

  // Función auxiliar para transformar fechas ISO a formato amigable (Ej: 7 de enero de 2027)
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) return fechaStr; 
    
    return fecha.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const filtrados = eventos.filter(evento => {
    if (filtroMes === '') return true;
    if (!evento.fecha_inicio) return false;
    return evento.fecha_inicio.includes(`-${filtroMes}-`);
  });

  if (cargando) return <div className="container py-5 text-center"><h5>Cargando agenda cultural...</h5></div>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Agenda y Eventos</h2>
      <div className="row">
        
        {/* Sidebar de Filtros */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '20px' }}>
            <h5 className="fw-bold mb-4"><i className="bi bi-funnel-fill text-info"></i> Filtros</h5>
            <div className="mb-4">
              <label className="fw-semibold mb-2">Mes del evento</label>
              <select className="form-select" value={filtroMes} onChange={e => setFiltroMes(e.target.value)}>
                <option value="">Cualquier fecha</option>
                <option value="01">Enero</option><option value="02">Febrero</option><option value="03">Marzo</option>
                <option value="04">Abril</option><option value="05">Mayo</option><option value="06">Junio</option>
                <option value="07">Julio</option><option value="08">Agosto</option><option value="09">Septiembre</option>
                <option value="10">Octubre</option><option value="11">Noviembre</option><option value="12">Diciembre</option>
              </select>
            </div>
            <button className="btn btn-outline-info w-100 text-dark fw-bold" onClick={() => setFiltroMes('')}>
              Limpiar
            </button>
          </div>
        </div>

        {/* Listado Interactivo tipo Acordeón */}
        <div className="col-lg-9">
          {filtrados.length === 0 ? (
            <div className="alert alert-light text-center border p-5">
              <h5 className="fw-bold text-muted">No hay eventos registrados en este periodo.</h5>
            </div>
          ) : (
            filtrados.map(evento => {
              const estaAbierto = expandidoId === evento.id;
              
              let listaImagenes = [];
              try {
                listaImagenes = evento.imagen_url ? JSON.parse(evento.imagen_url) : [];
              } catch {
                listaImagenes = evento.imagen_url ? [evento.imagen_url] : [];
              }

              return (
                <div key={evento.id} className="card shadow-sm border-0 mb-3 overflow-hidden border-start border-info border-4">
                  
                  {/* Encabezado Clickendable */}
                  <div 
                    className="card-body p-4 bg-white d-flex justify-content-between align-items-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleExpandir(evento.id)}
                  >
                    <div>
                      <h4 className="fw-bold text-dark mb-1">{evento.nombre}</h4>
                      <p className="text-muted mb-0 small">
                        <i className="bi bi-geo-alt-fill text-danger"></i> {evento.municipio} &bull; <span className="badge bg-info text-dark">Festividad Cultural</span>
                      </p>
                    </div>

                    <div className="text-end d-flex align-items-center gap-3">
                      <div className="bg-light px-3 py-2 rounded border d-none d-md-block">
                        <span className="d-block text-muted small fw-bold">FECHA PROGRAMADA</span>
                        <span className="fw-bold text-dark small">
                          {formatearFecha(evento.fecha_inicio)} {evento.fecha_fin ? ` al ${formatearFecha(evento.fecha_fin)}` : ''}
                        </span>
                      </div>
                      <i className={`bi bi-chevron-${estaAbierto ? 'up' : 'down'} fs-4 text-info fw-bold`}></i>
                    </div>
                  </div>

                  {/* Contenido Desplegable */}
                  {estaAbierto && (
                    <div className="card-footer bg-light p-4 border-top">
                      <div className="mb-3">
                        <h6 className="fw-bold text-primary">Descripción y Programación</h6>
                        <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{evento.descripcion}</p>
                      </div>

                      {/* Galería de Múltiples Imágenes con Efecto Hover */}
                      {listaImagenes.length > 0 && (
                        <div className="mt-4">
                          <h6 className="fw-bold text-dark mb-3">
                            <i className="bi bi-images text-info"></i> Galería, Cronograma y Rutas <small className="text-muted fw-normal">(Haz clic en una imagen para verla en pantalla completa)</small>
                          </h6>
                          <div className="row g-3">
                            {listaImagenes.map((img, index) => (
                              <div className="col-md-6" key={index}>
                                <div 
                                  className="card border-0 shadow-sm overflow-hidden position-relative group"
                                  style={{ cursor: 'pointer', borderRadius: '10px' }}
                                  onClick={() => setImagenSeleccionada(img)}
                                >
                                  <img 
                                    src={img} 
                                    alt={`Afiche ${index + 1}`} 
                                    className="img-fluid w-100 object-fit-cover transition" 
                                    style={{ height: '260px', transition: 'transform 0.3s ease' }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                  />
                                  <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-50 text-white text-center py-1 small">
                                    <i className="bi bi-zoom-in"></i> Clic para ampliar
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* ==============================================
          MODAL LIGHTBOX (PANTALLA COMPLETA)
      =============================================== */}
      {imagenSeleccionada && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-black bg-opacity-75"
          style={{ zIndex: 1050 }}
          onClick={() => setImagenSeleccionada(null)}
        >
          <div className="position-relative p-3 max-w-100 max-h-100 text-center" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="btn btn-light position-absolute top-0 end-0 m-4 rounded-circle shadow fw-bold fs-5 px-3 py-2"
              onClick={() => setImagenSeleccionada(null)}
              style={{ zIndex: 1060 }}
            >
              <i className="bi bi-x-lg"></i>
            </button>
            <img 
              src={imagenSeleccionada} 
              alt="Vista ampliada" 
              className="img-fluid rounded shadow-lg"
              style={{ maxHeight: '85vh', maxWidth: '90vw', objectFit: 'contain' }} 
            />
          </div>
        </div>
      )}

    </div>
  );
};