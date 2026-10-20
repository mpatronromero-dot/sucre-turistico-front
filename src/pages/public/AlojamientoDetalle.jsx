import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const AlojamientoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        const response = await fetch(`http://localhost:3005/api/alojamientos/${id}`);
        const result = await response.json();
        if (result.status === 'success') {
          setHotel(result.data);
        }
      } catch (error) {
        console.error("Error al cargar detalles:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDetalle();
  }, [id]);

  if (cargando) return <div className="container py-5 text-center"><h5 className="text-primary">Cargando detalles...</h5></div>;
  if (!hotel) return <div className="container py-5 text-center"><h5>Hotel no encontrado</h5></div>;

  return (
    <div className="container py-5">
      {/* Botón de regreso */}
      <button className="btn btn-outline-secondary mb-4 rounded-pill" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Volver a resultados
      </button>

      {/* Título y Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-primary mb-1">{hotel.nombre}</h2>
          <p className="text-muted fs-5 mb-0"><i className="bi bi-geo-alt-fill text-danger"></i> {hotel.municipio}</p>
        </div>
        <button className="btn btn-primary btn-lg fw-bold px-4 rounded-pill shadow-sm">
          Reservar ahora
        </button>
      </div>

      {/* Galería de Fotos */}
      {hotel.galeria && hotel.galeria.length > 0 ? (
        <div className="row g-2 mb-5">
          <div className="col-md-6">
            <img 
              src={hotel.imagen_url} 
              alt="Foto principal" 
              className="w-100 h-100 object-fit-cover rounded-start-4"
              style={{ minHeight: '400px' }}
            />
          </div>
          <div className="col-md-6">
            <div className="row g-2 h-100">
              {hotel.galeria.slice(0, 4).map((foto, index) => (
                <div key={index} className="col-6" style={{ height: '50%' }}>
                  <img 
                    src={foto.url_foto} 
                    alt={`Galería ${index + 1}`} 
                    className={`w-100 h-100 object-fit-cover ${index === 1 ? 'rounded-top-end-4' : ''} ${index === 3 ? 'rounded-bottom-end-4' : ''}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-5">
          <img src={hotel.imagen_url} className="w-100 object-fit-cover" style={{ height: '400px' }} alt={hotel.nombre} />
        </div>
      )}

      {/* Descripción */}
      <div className="mb-5">
        <h4 className="fw-bold mb-3">Acerca de este alojamiento</h4>
        <p className="fs-5 text-secondary lh-lg">{hotel.descripcion}</p>
      </div>

      {/* Tabla de Disponibilidad */}
      <h3 className="fw-bold mb-4 border-bottom pb-2">Disponibilidad</h3>
      
      <div className="table-responsive shadow-sm rounded-3 border mb-5">
        <table className="table table-bordered table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col" className="py-3 px-4">Tipo de habitación</th>
              <th scope="col" className="py-3 text-center">Número de personas</th>
              <th scope="col" className="py-3 text-center">Precio por noche</th>
              <th scope="col" className="py-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {hotel.habitaciones && hotel.habitaciones.length > 0 ? (
              hotel.habitaciones.map((hab) => (
                <tr key={hab.id}>
                  <td className="p-4">
                    <h5 className="fw-bold text-primary mb-2">{hab.tipo_habitacion}</h5>
                    <p className="text-muted mb-0 small"><i className="bi bi-info-circle"></i> {hab.descripcion_camas}</p>
                  </td>
                  <td className="p-4 text-center fs-5">
                    <i className="bi bi-person-fill text-secondary"></i> x {hab.capacidad_personas}
                  </td>
                  <td className="p-4 text-center fs-5 fw-bold text-success">
                    ${Number(hab.precio_noche).toLocaleString('es-CO')} COP
                  </td>
                  <td className="p-4 text-center">
                    <button className="btn btn-primary fw-bold px-4 py-2 rounded-3">Reservar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center py-5 text-muted">No hay habitaciones registradas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};