import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
// Imagen local de fondo
import playaFondo from '../../assets/playa-fondo.jpg';

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
    <>
      {/* SECCIÓN HERO CON IMAGEN DE FONDO */}
      <div 
        className="d-flex flex-column justify-content-center align-items-center text-center px-3 mb-5 shadow-lg"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${playaFondo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '60vh', 
          width: '100%',
          marginTop: '-1.5rem' 
        }}
      >
        <h1 className="display-4 fw-bold text-white mb-3 text-shadow">
          Golfo de Morrosquillo
        </h1>
        <p className="fs-5 text-white mb-4">
          Descubre los mejores destinos, hospedajes, gastronomía y eventos en Sucre.
        </p>

        {/* Buscador Search-as-you-type */}
        <div className="w-100 position-relative" style={{ maxWidth: '600px' }}>
          <input 
            type="text" 
            className="form-control form-control-lg shadow-lg border-0" 
            placeholder="Buscar playas, hoteles, restaurantes, tours..." 
            value={query}
            onChange={handleSearch}
          />
          {resultados.length > 0 && (
            <div className="list-group position-absolute w-100 shadow mt-1 z-3">
              {resultados.map((item, index) => (
                <button key={index} className="list-group-item list-group-item-action text-start">
                  <strong>{item.nombre}</strong> <span className="badge bg-secondary ms-2">{item.tipo}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sección: Categorías Destacadas Conectadas a Rutas */}
      <div className="container mt-5 pt-4">
        <h3 className="text-center fw-bold mb-4 text-dark">Descubre lo mejor de Sucre</h3>
        <div className="row g-4 mb-5">

          {/* Tarjeta 1: Alojamientos */}
          <div className="col-md-3 col-sm-6">
            <Link to="/alojamientos" className="text-decoration-none">
              <div className="card text-bg-dark border-0 shadow-sm overflow-hidden rounded-4" style={{ height: '250px', cursor: 'pointer' }}>
                <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=80" className="card-img w-100 h-100 object-fit-cover opacity-75" alt="Alojamientos" />
                <div className="card-img-overlay d-flex flex-column justify-content-end p-0">
                  <div className="bg-dark bg-opacity-50 w-100 p-3 text-center" style={{ backdropFilter: 'blur(2px)' }}>
                    <h5 className="card-title fw-bold mb-0 text-white">Alojamientos</h5>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Tarjeta 2: Gastronomía */}
          <div className="col-md-3 col-sm-6">
            <Link to="/gastronomia" className="text-decoration-none">
              <div className="card text-bg-dark border-0 shadow-sm overflow-hidden rounded-4" style={{ height: '250px', cursor: 'pointer' }}>
                <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80" className="card-img w-100 h-100 object-fit-cover opacity-75" alt="Gastronomía" />
                <div className="card-img-overlay d-flex flex-column justify-content-end p-0">
                  <div className="bg-dark bg-opacity-50 w-100 p-3 text-center" style={{ backdropFilter: 'blur(2px)' }}>
                    <h5 className="card-title fw-bold mb-0 text-white">Gastronomía</h5>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Tarjeta 3: Experiencias */}
          <div className="col-md-3 col-sm-6">
            <Link to="/experiencias" className="text-decoration-none">
              <div className="card text-bg-dark border-0 shadow-sm overflow-hidden rounded-4" style={{ height: '250px', cursor: 'pointer' }}>
                <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80" className="card-img w-100 h-100 object-fit-cover opacity-75" alt="Experiencias" />
                <div className="card-img-overlay d-flex flex-column justify-content-end p-0">
                  <div className="bg-dark bg-opacity-50 w-100 p-3 text-center" style={{ backdropFilter: 'blur(2px)' }}>
                    <h5 className="card-title fw-bold mb-0 text-white">Experiencias</h5>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Tarjeta 4: Eventos / Agenda Cultural */}
          <div className="col-md-3 col-sm-6">
            <Link to="/eventos" className="text-decoration-none">
              <div className="card text-bg-dark border-0 shadow-sm overflow-hidden rounded-4" style={{ height: '250px', cursor: 'pointer' }}>
                <img 
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80" 
                  className="card-img w-100 h-100 object-fit-cover opacity-75" 
                  alt="Agenda Cultural" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80';
                  }}
                />
                <div className="card-img-overlay d-flex flex-column justify-content-end p-0">
                  <div className="bg-dark bg-opacity-50 w-100 p-3 text-center" style={{ backdropFilter: 'blur(2px)' }}>
                    <h5 className="card-title fw-bold mb-0 text-white">Agenda Cultural</h5>
                  </div>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};