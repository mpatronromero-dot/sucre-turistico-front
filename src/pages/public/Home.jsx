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
      </div>
    </div>
  );
};