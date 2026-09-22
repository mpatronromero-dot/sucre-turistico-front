import React, { useEffect, useState } from 'react';
import { getAlojamientos } from '../../api/alojamientosService';

export const Alojamientos = () => {
  const [alojamientos, setAlojamientos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Imágenes de prueba para simular la galería de tu captura
  const mockImages = [
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80", // Casa playa
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", // Cuarto
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80", // Baño
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80"  // Piscina
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      const data = await getAlojamientos();
      // Si el backend aún no tiene datos de alojamientos, inyectamos uno de prueba
      if (data.length === 0) {
        setAlojamientos([{
          id: 1,
          nombre: "Hermoso apartamento frente al mar, 4 Habitaciones",
          municipio: "Coveñas",
          precio: "1.000.000",
          tipo: "Apartamento"
        }]);
      } else {
        setAlojamientos(data);
      }
      setCargando(false);
    };
    cargarDatos();
  }, []);

  if (cargando) return <div className="container py-5 text-center"><h5>Cargando alojamientos...</h5></div>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Alojamientos en Sucre</h2>
      
      {alojamientos.map((lugar) => (
        <div key={lugar.id} className="card shadow-sm border-0 mb-5">
          <div className="card-body p-4">
            
            {/* Encabezado y Precio (Estilo de la imagen de referencia) */}
            <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap">
              <div>
                <h3 className="card-title fw-bold">{lugar.nombre}</h3>
                <p className="text-muted mb-0"><i className="bi bi-geo-alt-fill"></i> {lugar.municipio} • {lugar.tipo}</p>
                
                {/* Enlaces estilo menú */}
                <div className="d-flex gap-3 mt-2 fs-6">
                  <a href="#" className="text-dark fw-bold text-decoration-underline">Fotos</a>
                  <a href="#" className="text-secondary text-decoration-none">Opiniones</a>
                  <a href="#" className="text-secondary text-decoration-none">Info</a>
                  <a href="#" className="text-secondary text-decoration-none">Mapa</a>
                </div>
              </div>

              {/* Caja verde de precio */}
              <div className="bg-success bg-opacity-10 p-3 rounded text-end border border-success border-opacity-25 mt-3 mt-md-0">
                <span className="d-block text-muted small fw-bold"><i className="bi bi-house-door-fill text-danger"></i> Sucre Turístico</span>
                <span className="fs-4 fw-bold text-dark">$ {lugar.precio || "350.000"}</span>
                <button className="btn btn-success fw-bold d-block w-100 mt-2">Ver oferta {'>'}</button>
              </div>
            </div>

            {/* Filtros tipo Píldoras */}
            <div className="d-flex gap-2 mb-3 overflow-auto pb-2">
              <span className="badge rounded-pill bg-primary text-white px-3 py-2">Todas las fotos (52)</span>
              <span className="badge rounded-pill bg-light text-dark border px-3 py-2">Habitaciones (11)</span>
              <span className="badge rounded-pill bg-light text-dark border px-3 py-2">Baño (7)</span>
              <span className="badge rounded-pill bg-light text-dark border px-3 py-2">Piscina (5)</span>
            </div>

            {/* Cuadrícula de Imágenes (Grid Mampostería simulada) */}
            <div className="row g-2">
              <div className="col-md-6">
                <img src={mockImages[0]} alt="Principal" className="img-fluid rounded w-100 h-100 object-fit-cover" style={{ minHeight: '300px' }} />
              </div>
              <div className="col-md-6">
                <div className="row g-2 h-100">
                  <div className="col-6">
                    <img src={mockImages[1]} alt="Habitación" className="img-fluid rounded w-100 h-100 object-fit-cover" />
                  </div>
                  <div className="col-6">
                    <img src={mockImages[2]} alt="Baño" className="img-fluid rounded w-100 h-100 object-fit-cover" />
                  </div>
                  <div className="col-12 mt-2">
                    <img src={mockImages[3]} alt="Piscina" className="img-fluid rounded w-100 object-fit-cover" style={{ height: '145px' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};