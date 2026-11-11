import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../api/axiosConfig';

export const GastronomiaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ restaurante: null, menu: [] });
  const [cargando, setCargando] = useState(true);

  // Estado del modal y del formulario de reserva
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reserva, setReserva] = useState({
    nombre_cliente: '',
    telefono_cliente: '',
    fecha: '',
    hora: '',
    numero_personas: 2
  });
  const [enviandoReserva, setEnviandoReserva] = useState(false);

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        const response = await api.get(`/gastronomia/${id}`);
        const result = response.data;
        
        if (result.status === 'success' && result.data) {
          const restauranteObj = result.data.restaurante || result.data;
          const menuArray = result.data.menu || restauranteObj.menu || [];
          
          setDatos({
            restaurante: restauranteObj,
            menu: menuArray
          });
        }
      } catch (error) {
        console.error("Error cargando la carta del restaurante:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDetalle();
  }, [id]);

  const handleReservaChange = (e) => {
    setReserva({ ...reserva, [e.target.name]: e.target.value });
  };

  const handleCrearReserva = async (e) => {
    e.preventDefault();
    setEnviandoReserva(true);

    try {
      const response = await api.post('/gastronomia/reservas', { ...reserva, restaurante_id: id });
      const result = response.data;

      if (result.status === 'success') {
        setMostrarModal(false);
        Swal.fire('¡Reserva Enviada!', 'El restaurante se pondrá en contacto contigo para confirmar tu mesa.', 'success');
        setReserva({ nombre_cliente: '', telefono_cliente: '', fecha: '', hora: '', numero_personas: 2 });
      } else {
        Swal.fire('Error', result.message || 'No se pudo procesar la reserva', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    } finally {
      setEnviandoReserva(false);
    }
  };

  if (cargando) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>;
  if (!datos.restaurante) return <div className="text-center py-5"><h4>Restaurante no encontrado</h4></div>;

  const tipoComidaText = datos.restaurante.tipo || datos.restaurante.tipo_comida || 'Gastronomía';

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left me-2"></i>Volver a Gastronomía
      </button>

      {/* Cabecera del Restaurante */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
        <div className="row g-0">
          <div className="col-md-5">
            <img 
              src={datos.restaurante.imagen_url || datos.restaurante.imagen_portada || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80'} 
              alt={datos.restaurante.nombre}
              className="img-fluid w-100 h-100 object-fit-cover"
              style={{ minHeight: '280px' }}
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80'; 
              }}
            />
          </div>
          <div className="col-md-7 p-5">
            <span className="badge bg-warning text-dark mb-2">{tipoComidaText}</span>
            <h1 className="fw-bold text-success">{datos.restaurante.nombre}</h1>
            <p className="text-muted">
              <i className="bi bi-geo-alt-fill text-danger me-1"></i> 
              {datos.restaurante.municipio} {datos.restaurante.direccion ? `- ${datos.restaurante.direccion}` : ''}
            </p>
            <p className="fs-5 mt-3">{datos.restaurante.descripcion}</p>
            
            <button 
              onClick={() => setMostrarModal(true)} 
              className="btn btn-success btn-lg mt-3 fw-bold rounded-pill px-4 shadow"
            >
              <i className="bi bi-calendar-check me-2"></i>Reservar Mesa
            </button>
          </div>
        </div>
      </div>

      {/* La Carta / Menú */}
      <h3 className="fw-bold mb-4 border-bottom border-success border-3 pb-2 d-inline-block">Nuestra Carta</h3>
      
      {datos.menu.length === 0 ? (
        <div className="alert alert-light text-center py-4 border">Este restaurante aún no ha publicado sus platos.</div>
      ) : (
        <div className="row g-4">
          {datos.menu.map(plato => {
            const nombrePlato = plato.nombre || plato.nombre_plato;

            return (
              <div className="col-md-6 col-lg-4" key={plato.id}>
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                  <img 
                    src={plato.imagen_url || plato.foto_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'} 
                    className="card-img-top" 
                    alt={nombrePlato} 
                    style={{ height: '220px', objectFit: 'cover' }}
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'; 
                    }}
                  />
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="fw-bold mb-0 text-dark">{nombrePlato}</h5>
                      <span className="fs-5 fw-bold text-success">${Number(plato.precio).toLocaleString('es-CO')}</span>
                    </div>
                    <p className="text-muted small mb-0">{plato.descripcion}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE RESERVA DE MESA */}
      {mostrarModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold"><i className="bi bi-calendar-event me-2"></i>Reservar en {datos.restaurante.nombre}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModal(false)}></button>
              </div>
              
              <form onSubmit={handleCrearReserva}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Nombre Completo</label>
                    <input type="text" className="form-control" name="nombre_cliente" value={reserva.nombre_cliente} onChange={handleReservaChange} required placeholder="Ej. Carlos Mendoza" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Teléfono de Contacto</label>
                    <input type="tel" className="form-control" name="telefono_cliente" value={reserva.telefono_cliente} onChange={handleReservaChange} required placeholder="Ej. 3001234567" />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Fecha</label>
                      <input type="date" className="form-control" name="fecha" value={reserva.fecha} onChange={handleReservaChange} required />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Hora</label>
                      <input type="time" className="form-control" name="hora" value={reserva.hora} onChange={handleReservaChange} required />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Número de Personas</label>
                    <input type="number" className="form-control" name="numero_personas" min="1" max="20" value={reserva.numero_personas} onChange={handleReservaChange} required />
                  </div>
                </div>

                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setMostrarModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-success fw-bold px-4" disabled={enviandoReserva}>
                    {enviandoReserva ? 'Confirmando...' : 'Confirmar Reserva'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};