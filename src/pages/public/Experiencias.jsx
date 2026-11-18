import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

export const Experiencias = () => {
  const [experiencias, setExperiencias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  const [paginaActual, setPaginaActual] = useState(1);
  const experienciasPorPagina = 2;

  const [showModal, setShowModal] = useState(false);
  const [experienciaSeleccionada, setExperienciaSeleccionada] = useState(null);
  const [formDataReserva, setFormDataReserva] = useState({
    nombre_cliente: '',
    telefono: '',
    fecha: '',
    cantidad_personas: 1
  });

  useEffect(() => {
    const cargar = async () => {
      try {
        const response = await api.get('/experiencias');
        const data = response.data;
        const datosReales = Array.isArray(data) ? data : (data.data || []);
        setExperiencias(datosReales);
      } catch (error) {
        console.error("Error cargando experiencias:", error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtroMunicipio, filtroTipo]);

  const handleAbrirReserva = (lugar) => {
    setExperienciaSeleccionada(lugar);
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setExperienciaSeleccionada(null);
    setFormDataReserva({ nombre_cliente: '', telefono: '', fecha: '', cantidad_personas: 1 });
  };

  const handleSubmitReserva = (e) => {
    e.preventDefault();
    alert(`¡Reserva solicitada con éxito para: ${experienciaSeleccionada.nombre}!\n\nEl operador se contactará al número ${formDataReserva.telefono} para confirmar el pago y la hora exacta.`);
    handleCerrarModal();
  };

  const filtradas = experiencias.filter(e =>
    (filtroMunicipio === '' || e.municipio === filtroMunicipio) &&
    (filtroTipo === '' || e.tipo === filtroTipo)
  );

  const totalPaginas = Math.ceil(filtradas.length / experienciasPorPagina);
  const indiceUltima = paginaActual * experienciasPorPagina;
  const indicePrimera = indiceUltima - experienciasPorPagina;
  const experienciasActuales = filtradas.slice(indicePrimera, indiceUltima);

  const obtenerImagenUrl = (url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return null;
    const limpia = url.trim().replace(/\\/g, '/');
    if (limpia.startsWith('http://') || limpia.startsWith('https://')) {
      return encodeURI(limpia);
    }
    const rutaConBarra = limpia.startsWith('/') ? limpia : `/${limpia}`;
    return encodeURI(`http://localhost:3004${rutaConBarra}`);
  };

  if (cargando) return <div className="container py-5 text-center"><h5>Cargando catálogo...</h5></div>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Experiencias y Tours</h2>
      <div className="row">

        {/* Sidebar de Filtros (Sin sticky-top para que no tape el Navbar) */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm border-0 p-4 rounded-4">
            <h5 className="fw-bold mb-4"><i className="bi bi-funnel-fill text-info"></i> Filtros</h5>
            <div className="mb-4">
              <label className="fw-semibold mb-2">Ubicación</label>
              <select className="form-select" value={filtroMunicipio} onChange={e => setFiltroMunicipio(e.target.value)}>
                <option value="">Todas</option>
                <option value="Coveñas">Coveñas</option>
                <option value="Tolú">Tolú</option>
                <option value="San Onofre">San Onofre</option>
                <option value="San Antero">San Antero</option>
                <option value="Toluviejo">Toluviejo</option>
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

        {/* Resultados Dinámicos (2 tarjetas por página) */}
        <div className="col-lg-9">
          {filtradas.length === 0 ? (
            <div className="alert alert-light text-center border p-5 rounded-4">
              <h5 className="fw-bold text-muted">Aún no hay experiencias publicadas.</h5>
              <p className="mb-0">Las nuevas actividades registradas en el panel de administración aparecerán aquí.</p>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {experienciasActuales.map(lugar => {
                  const imagenUsuario = obtenerImagenUrl(lugar.imagen_url);

                  return (
                    <div key={lugar.id} className="col-md-6">
                      <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden d-flex flex-column">
                        {imagenUsuario ? (
                          <img
                            src={imagenUsuario}
                            alt={lugar.nombre}
                            className="card-img-top w-100 object-fit-cover"
                            style={{ height: '190px' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/600x400?text=Sin+imagen';
                            }}
                          />
                        ) : (
                          <div
                            className="bg-light d-flex flex-column justify-content-center align-items-center text-muted border-bottom"
                            style={{ height: '190px' }}
                          >
                            <i className="bi bi-image fs-2 mb-1"></i>
                            <span className="small">Sin imagen cargada</span>
                          </div>
                        )}

                        <div className="card-body p-4 d-flex flex-column flex-grow-1">
                          <div className="mb-2">
                            <span className="text-muted small fw-semibold">
                              <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                              {lugar.municipio} &bull; {lugar.tipo}
                            </span>
                            <h5 className="card-title fw-bold text-dark mt-1 mb-2">{lugar.nombre}</h5>
                          </div>

                          <p
                            className="text-secondary small mb-3 flex-grow-1"
                            style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                          >
                            {lugar.descripcion}
                          </p>

                          {lugar.video_url && (
                            <div className="mb-3">
                              <a href={lugar.video_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-danger fw-bold">
                                <i className="bi bi-youtube me-1"></i> Ver Video
                              </a>
                            </div>
                          )}

                          <div className="bg-info bg-opacity-10 p-3 rounded-3 border border-info border-opacity-25 d-flex justify-content-between align-items-center mt-auto">
                            <div>
                              <span className="d-block text-muted small fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>
                                {lugar.tipo_tarifa || 'Tarifa Estándar'}
                              </span>
                              <span className="fs-5 fw-bold text-dark">
                                $ {new Intl.NumberFormat('es-CO').format(lugar.costo_estimado)}
                              </span>
                            </div>

                            <button
                              className="btn btn-info fw-bold text-white px-3 shadow-sm"
                              onClick={() => handleAbrirReserva(lugar)}
                            >
                              Reservar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPaginas > 1 && (
                <nav className="mt-4 d-flex justify-content-center" aria-label="Paginación de experiencias">
                  <ul className="pagination mb-0">
                    <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPaginaActual(paginaActual - 1)}>
                        Anterior
                      </button>
                    </li>

                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                      <li key={num} className={`page-item ${paginaActual === num ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setPaginaActual(num)}>
                          {num}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPaginaActual(paginaActual + 1)}>
                        Siguiente
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de Reservas */}
      {showModal && experienciaSeleccionada && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header bg-info text-white">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-calendar-check me-2"></i>
                    Reservar: {experienciaSeleccionada.nombre}
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={handleCerrarModal}></button>
                </div>

                <div className="modal-body p-4">
                  <form onSubmit={handleSubmitReserva}>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-dark">Nombre Completo</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        required
                        placeholder="Ingresa tu nombre"
                        value={formDataReserva.nombre_cliente}
                        onChange={e => setFormDataReserva({ ...formDataReserva, nombre_cliente: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold text-dark">Teléfono / WhatsApp</label>
                      <input
                        type="tel"
                        className="form-control bg-light"
                        required
                        placeholder="Ej. 300 123 4567"
                        value={formDataReserva.telefono}
                        onChange={e => setFormDataReserva({ ...formDataReserva, telefono: e.target.value })}
                      />
                    </div>

                    <div className="row mb-4">
                      <div className="col-6">
                        <label className="form-label fw-bold text-dark">Fecha de la Actividad</label>
                        <input
                          type="date"
                          className="form-control bg-light"
                          required
                          value={formDataReserva.fecha}
                          onChange={e => setFormDataReserva({ ...formDataReserva, fecha: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-bold text-dark">Total Asistentes</label>
                        <input
                          type="number"
                          min="1"
                          className="form-control bg-light"
                          required
                          value={formDataReserva.cantidad_personas}
                          onChange={e => setFormDataReserva({ ...formDataReserva, cantidad_personas: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="d-grid mt-2">
                      <button type="submit" className="btn btn-warning fw-bold fs-5 shadow-sm text-dark">
                        Confirmar Reserva
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};