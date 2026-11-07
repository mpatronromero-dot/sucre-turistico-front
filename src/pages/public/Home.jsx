import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';

// 1. Importación de todas tus imágenes locales desde assets
import playaFondo from '../../assets/playa-fondo.jpg';
import fotoAlojamientos from '../../assets/alojamientos.jpg';
import fotoGastronomia from '../../assets/gastronomia.jpg';
import fotoExperiencias from '../../assets/experiencias.jpg';
import fotoEventos from '../../assets/eventos.jpg';

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

  // 2. Arreglo mapeado con tus imágenes locales asignadas
  const categorias = [
    {
      id: 1,
      titulo: "Alojamientos",
      ruta: "/alojamientos",
      imagen: fotoAlojamientos,
      recientes: ["Hotel El Velero", "Cabañas Tolú", "Hostal Centro"]
    },
    {
      id: 2,
      titulo: "Gastronomía",
      ruta: "/gastronomia",
      imagen: fotoGastronomia,
      recientes: ["Restaurante La Playa", "Pizzería Sucre", "Asados El Paisa"]
    },
    {
      id: 3,
      titulo: "Experiencias",
      ruta: "/experiencias",
      imagen: fotoExperiencias,
      recientes: ["Buceo Rincón del Mar", "Tour Manglares", "Paseo en Bote"]
    },
    {
      id: 4,
      titulo: "Agenda Cultural",
      ruta: "/eventos",
      imagen: fotoEventos,
      recientes: ["Festival de Bandas", "Fiestas de Sincelejo", "Concierto Playa"]
    }
  ];

  return (
    <>
      {/* ESTILOS CSS INSERTADOS PARA EL EFECTO MODERNO Y EL DELAY */}
      <style>{`
        .hero-section {
          min-height: 100vh; /* Ocupa el 100% de la pantalla */
          background-size: cover;
          background-position: center;
          background-attachment: fixed; /* Efecto Parallax */
          margin-top: -1.5rem; 
        }
        
        .modern-card {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 350px;
        }
        
        .modern-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.3);
        }

        .card-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 100%);
        }

        /* Contenedor Oculto (El que se despliega) */
        .card-reveal {
          max-height: 0;
          opacity: 0;
          transform: translateY(15px);
          /* Al quitar el cursor, se cierra al instante (0s delay) */
          transition: max-height 0.3s ease 0s, opacity 0.3s ease 0s, transform 0.3s ease 0s;
        }

        /* Efecto Hover: Despliega después de 1 segundo de mantener el cursor */
        .modern-card:hover .card-reveal {
          max-height: 200px; 
          opacity: 1;
          transform: translateY(0);
          /* 1s de delay al poner el cursor */
          transition: max-height 0.5s ease 1s, opacity 0.5s ease 1s, transform 0.5s ease 1s;
        }
      `}</style>

      {/* SECCIÓN HERO CON TU IMAGEN DE FONDO LOCAL */}
      <div 
        className="hero-section d-flex flex-column justify-content-center align-items-center text-center px-3 mb-5 shadow-lg w-100"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${playaFondo})`
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

      {/* SECCIÓN CATEGORÍAS CON IMÁGENES LOCALES Y EFECTO HOVER */}
      <div className="container mt-5 pt-4">
        <h3 className="text-center fw-bold mb-4 text-dark">Descubre lo mejor de Sucre</h3>
        <div className="row g-4 mb-5">
          
          {categorias.map((cat) => (
            <div className="col-md-3 col-sm-6" key={cat.id}>
              <Link to={cat.ruta} className="text-decoration-none">
                <div className="modern-card position-relative bg-dark text-white">
                  
                  {/* Se renderiza la imagen local importada */}
                  <img 
                    src={cat.imagen} 
                    className="w-100 h-100 object-fit-cover opacity-75" 
                    alt={cat.titulo}
                  />
                  
                  <div className="card-overlay position-absolute bottom-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-4">
                    <h5 className="fw-bold mb-0 text-white" style={{ letterSpacing: '1px' }}>
                      {cat.titulo}
                    </h5>
                    
                    {/* Lista que se despliega después de 1 segundo */}
                    <div className="card-reveal overflow-hidden">
                      <hr className="border-white opacity-25 my-3" />
                      <span className="badge bg-primary mb-2">Últimos agregados</span>
                      <ul className="list-unstyled mb-0 small text-light">
                        {cat.recientes.map((item, index) => (
                          <li key={index} className="mb-1 d-flex align-items-center">
                            <i className="bi bi-chevron-right me-2 text-info" style={{ fontSize: '0.8rem' }}></i>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </Link>
            </div>
          ))}

        </div>
      </div>
    </>
  );
};