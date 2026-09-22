import React, { useEffect, useState } from 'react';
import { getDestinos } from '../../api/destinosService';

export const Destinos = () => {
  const [destinos, setDestinos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      const data = await getDestinos();
      setDestinos(data);
      setCargando(false);
    };
    cargarDatos();
  }, []);

  if (cargando) {
    return <div className="container py-5 text-center"><h5>Cargando destinos del Golfo...</h5></div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-primary">Destinos en Sucre</h2>
      <div className="row g-4">
        {destinos.map((destino) => (
          <div className="col-md-6 col-lg-4" key={destino.id}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title fw-bold mb-0">{destino.nombre}</h5>
                  <span className="badge bg-info text-dark">{destino.tipo}</span>
                </div>
                <h6 className="card-subtitle mb-2 text-muted"><i className="bi bi-geo-alt-fill"></i> {destino.municipio}</h6>
                <p className="card-text">{destino.descripcion}</p>
                <button className="btn btn-outline-primary btn-sm w-100 mt-2">Ver detalles</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};