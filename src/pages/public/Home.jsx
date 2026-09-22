import React, { useState } from 'react';
import api from '../../api/axiosConfig';

export const Home = () => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);

  // Búsqueda en tiempo real conectada al buscador-service
  const handleSearch = async (e) => {
    const text = e.target.value;
    setQuery(text);

    if (text.trim().length > 2) {
      try {
        const response = await api.get(`/buscador?q=${text}`);
        setResultados(response.data);
      } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
      }
    } else {
      setResultados([]);
    }
  };

  return (
    <div className="container py-4">
      {/* Banner Principal */}
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm text-center">
        <h1 className="display-5 fw-bold text-primary">Golfo de Morrosquillo</h1>
        <p className="fs-5 text-muted">
          Descubre los mejores destinos, hospedajes, gastronomía y eventos en Sucre.
        </p>
        
        {/* Buscador Search-as-you-type */}
        <div className="row justify-content-center mt-4">
          <div className="col-md-8 position-relative">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Buscar playas, hoteles, restaurantes, tours..."
              value={query}
              onChange={handleSearch}
            />
            {resultados.length > 0 && (
              <div className="list-group position-absolute w-100 shadow mt-1 z-3">
                {resultados.map((item, index) => (
                  <button
                    key={index}
                    className="list-group-item list-group-item-action text-start"
                  >
                    <strong>{item.nombre}</strong> <span className="badge bg-secondary ms-2">{item.tipo}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Nueva Sección: Categorías Destacadas */}
      <div className="container mt-5 pt-4">
        <h3 className="text-center fw-bold mb-4 text-dark">Descubre lo mejor de Sucre</h3>
        <div className="row g-4 mb-5">
          
          {/* Tarjeta 1: Alojamientos */}
          <div className="col-md-3 col-sm-6">
            <div className="card text-bg-dark border-0 shadow-sm overflow-hidden rounded-4" style={{ height: '250px', cursor: 'pointer' }}>
              <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=80" className="card-img w-100 h-100 object-fit-cover opacity-75" alt="Alojamientos" />
              <div className="card-img-overlay d-flex flex-column justify-content-end p-0">
                <div className="bg-dark bg-opacity-50 w-100 p-3 text-center" style={{ backdropFilter: 'blur(2px)' }}>
                  <h5 className="card-title fw-bold mb-0 text-white">Alojamientos</h5>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Gastronomía */}
          <div className="col-md-3 col-sm-6">
            <div className="card text-bg-dark border-0 shadow-sm overflow-hidden rounded-4" style={{ height: '250px', cursor: 'pointer' }}>
              <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80" className="card-img w-100 h-100 object-fit-cover opacity-75" alt="Gastronomía" />
              <div className="card-img-overlay d-flex flex-column justify-content-end p-0">
                <div className="bg-dark bg-opacity-50 w-100 p-3 text-center" style={{ backdropFilter: 'blur(2px)' }}>
                  <h5 className="card-title fw-bold mb-0 text-white">Gastronomía</h5>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Experiencias */}
          <div className="col-md-3 col-sm-6">
            <div className="card text-bg-dark border-0 shadow-sm overflow-hidden rounded-4" style={{ height: '250px', cursor: 'pointer' }}>
              <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80" className="card-img w-100 h-100 object-fit-cover opacity-75" alt="Experiencias" />
              <div className="card-img-overlay d-flex flex-column justify-content-end p-0">
                <div className="bg-dark bg-opacity-50 w-100 p-3 text-center" style={{ backdropFilter: 'blur(2px)' }}>
                  <h5 className="card-title fw-bold mb-0 text-white">Experiencias</h5>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 4: Eventos */}
          <div className="col-md-3 col-sm-6">
            <div className="card text-bg-dark border-0 shadow-sm overflow-hidden rounded-4" style={{ height: '250px', cursor: 'pointer' }}>
              <img src="https://images.unsplash.com/photo-1533174000243-782a2ba6e59b?w=600&q=80" className="card-img w-100 h-100 object-fit-cover opacity-75" alt="Eventos" />
              <div className="card-img-overlay d-flex flex-column justify-content-end p-0">
                <div className="bg-dark bg-opacity-50 w-100 p-3 text-center" style={{ backdropFilter: 'blur(2px)' }}>
                  <h5 className="card-title fw-bold mb-0 text-white">Agenda Cultural</h5>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
    </div>
  );
};