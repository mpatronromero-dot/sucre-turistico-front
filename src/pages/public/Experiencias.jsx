import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig'; // Usamos el API Gateway centralizado

export const Experiencias = () => {
  const [experiencias, setExperiencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para filtros
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  // Estados para el Modal de Reserva
  const [showModal, setShowModal] = useState(false);
  const [experienciaSeleccionada, setExperienciaSeleccionada] = useState(null);
  const [formDataReserva, setFormDataReserva] = useState({
    nombre_cliente: '',
    telefono: '',
    fecha: '',
    cantidad_personas: 1
  });

  // 1. Cargar las experiencias desde el API Gateway
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

  // 2. Funciones para manejar el Modal
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

  // 3. Filtrado en tiempo real
  const filtradas = experiencias.filter(e => 
    (filtroMunicipio === '' || e.municipio === filtroMunicipio) &&
    (filtroTipo === '' || e.tipo === filtroTipo)
  );

  // Auxiliar para asegurar que la URL de la imagen apunte correctamente al microservicio o URL absoluta
  const obtenerImagenUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80';
    if (url.startsWith('http')) {
      // Opcional: si la imagen trae el puerto 3004 directo, puedes dejarla o adaptarla al Gateway si deseas
      return url;
    }
    return `http://localhost:3004${url}`;
  };

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
                      
                      <button 
                        className="btn btn-info fw-bold d-block w-100 mt-3 text-white shadow-sm"
                        onClick={() => handleAbrirReserva(lugar)}
                      >
                        Reservar
                      </button>

                    </div>
                  </div>

                  <div className="mt-4">
                    <img 
                      src={obtenerImagenUrl(lugar.imagen_url)} 
                      alt={lugar.nombre} 
                      className="img-fluid rounded w-100 object-fit-cover shadow-sm" 
                      style={{ maxHeight: '350px' }} 
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80'; 
                      }} 
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ==============================================
          MODAL EMERGENTE DE RESERVAS 
      =============================================== */}
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
                      <input type="text" className="form-control bg-light" required placeholder="Ingresa tu nombre"
                             value={formDataReserva.nombre_cliente} 
                             onChange={e => setFormDataReserva({...formDataReserva, nombre_cliente: e.target.value})} />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold text-dark">Teléfono / WhatsApp</label>
                      <input type="tel" className="form-control bg-light" required placeholder="Ej. 300 123 4567"
                             value={formDataReserva.telefono} 
                             onChange={e => setFormDataReserva({...formDataReserva, telefono: e.target.value})} />
                    </div>
                    
                    <div className="row mb-4">
                      <div className="col-6">
                        <label className="form-label fw-bold text-dark">Fecha de la Actividad</label>
                        <input type="date" className="form-control bg-light" required
                               value={formDataReserva.fecha} 
                               onChange={e => setFormDataReserva({...formDataReserva, fecha: e.target.value})} />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-bold text-dark">Total Asistentes</label>
                        <input type="number" min="1" className="form-control bg-light" required
                               value={formDataReserva.cantidad_personas} 
                               onChange={e => setFormDataReserva({...formDataReserva, cantidad_personas: e.target.value})} />
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