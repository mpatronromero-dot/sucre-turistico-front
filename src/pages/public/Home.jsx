import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  
  // Inicializamos el hook de navegación
  const navigate = useNavigate();

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

  // Función para redirigir al detalle cuando se hace clic en una sugerencia
  const handleSeleccionarResultado = (item) => {
    const tipo = (item.tipo || '').toLowerCase();
    const id = item.id || item._id; 

    if (!id) return; 

    if (tipo.includes('gastronom')) {
      navigate(`/gastronomia/${id}`);
    } else if (tipo.includes('alojamiento') || tipo.includes('hotel')) {
      navigate(`/alojamientos/${id}`);
    } else if (tipo.includes('experiencia')) {
      navigate(`/experiencias/${id}`);
    } else if (tipo.includes('evento') || tipo.includes('agenda')) {
      navigate(`/eventos/${id}`);
    } else {
      console.warn('Categoría desconocida para redirección:', tipo);
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
      <style>{`
        .hero-section {
          min-height: 80vh; 
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
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

        .card-reveal {
          max-height: 0;
          opacity: 0;
          transform: translateY(15px);
          transition: max-height 0.3s ease 0s, opacity 0.3s ease 0s, transform 0.3s ease 0s;
        }

        .modern-card:hover .card-reveal {
          max-height: 200px; 
          opacity: 1;
          transform: translateY(0);
          transition: max-height 0.5s ease 1s, opacity 0.5s ease 1s, transform 0.5s ease 1s;
        }

        /* Ajustes tipográficos para la sección informativa */
        .info-section h2 {
          font-family: 'Playfair Display', serif;
          color: #1a4341;
        }
        .icon-box {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: rgba(15, 118, 110, 0.1);
          color: #0f766e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin: 0 auto 1rem;
        }
          /* Estilos para el Carrusel de Noticias */
        .noticias-carousel {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }
        
        .noticia-slide {
          height: 450px;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .noticia-overlay {
          background: linear-gradient(to top, rgba(15, 118, 110, 0.95) 0%, rgba(26, 67, 65, 0.7) 50%, rgba(0,0,0,0) 100%);
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3rem;
        }
        
        .carousel-indicators [data-bs-target] {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.5);
          margin: 0 6px;
        }
        .carousel-indicators .active {
          background-color: #fff;
          transform: scale(1.2);
        }
      `}</style>

      {/* SECCIÓN HERO CON TU IMAGEN DE FONDO LOCAL */}
      <div 
        className="hero-section d-flex flex-column justify-content-center align-items-center text-center px-3 mb-5 shadow-lg w-100"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${playaFondo})`
        }}
      >
        <h1 className="display-4 fw-bold text-white mb-3 text-shadow" style={{ fontFamily: 'Playfair Display, serif' }}>
          Golfo de Morrosquillo
        </h1>
        <p className="fs-5 text-white mb-4">
          Descubre los mejores destinos, hospedajes, gastronomía y eventos en Sucre.
        </p>

        {/* Buscador Search-as-you-type */}
        <div className="w-100 position-relative" style={{ maxWidth: '600px' }}>
          <div className="input-group input-group-lg shadow-lg rounded-pill overflow-hidden bg-white">
            <span className="input-group-text bg-white border-0 text-muted ps-4">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              className="form-control border-0 px-3 py-3 shadow-none" 
              placeholder="Buscar playas, hoteles, restaurantes, tours..." 
              value={query}
              onChange={handleSearch}
            />
          </div>
          {resultados.length > 0 && (
            <div className="list-group position-absolute w-100 shadow mt-2 rounded-4 overflow-hidden z-3 border-0">
              {resultados.map((item, index) => (
                <button 
                  key={index} 
                  className="list-group-item list-group-item-action text-start border-0 border-bottom py-3"
                  onClick={() => handleSeleccionarResultado(item)} 
                >
                  <strong className="text-dark">{item.nombre}</strong> 
                  <span className="badge bg-caribe-sobrio ms-2 rounded-pill fw-normal">{item.tipo}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN CATEGORÍAS CON IMÁGENES LOCALES Y EFECTO HOVER */}
      <div className="container mt-5 pt-4">
        <div className="text-center mb-5">
          <span className="text-uppercase tracking-wider fw-bold text-caribe-sobrio small">Explora la región</span>
          <h2 className="fw-bold mt-2 display-6" style={{ fontFamily: 'Playfair Display, serif', color: '#1a4341' }}>Descubre lo mejor de Sucre</h2>
        </div>
        
        <div className="row g-4 mb-5 pb-5">
          {categorias.map((cat) => (
            <div className="col-md-3 col-sm-6" key={cat.id}>
              <Link to={cat.ruta} className="text-decoration-none">
                <div className="modern-card position-relative bg-dark text-white">
                  
                  <img 
                    src={cat.imagen} 
                    className="w-100 h-100 object-fit-cover opacity-75" 
                    alt={cat.titulo}
                  />
                  
                  <div className="card-overlay position-absolute bottom-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-4">
                    <h5 className="fw-bold mb-0 text-white fs-4" style={{ letterSpacing: '1px', fontFamily: 'Playfair Display, serif' }}>
                      {cat.titulo}
                    </h5>
                    
                    <div className="card-reveal overflow-hidden">
                      <hr className="border-white opacity-25 my-3" />
                      <span className="badge bg-caribe-sobrio mb-2 rounded-pill fw-normal">Últimos agregados</span>
                      <ul className="list-unstyled mb-0 small text-light">
                        {cat.recientes.map((item, index) => (
                          <li key={index} className="mb-1 d-flex align-items-center">
                            <i className="bi bi-chevron-right me-2 opacity-75" style={{ fontSize: '0.8rem' }}></i>
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

        {/* NUEVA SECCIÓN INFORMATIVA: POR QUÉ VISITAR EL GOLFO */}
        <div className="info-section bg-fondo-claro rounded-5 p-5 mb-5 shadow-sm border border-light">
          <div className="text-center mb-5">
            <span className="text-uppercase tracking-wider fw-bold text-caribe-sobrio small">Tu próxima aventura</span>
            <h2 className="fw-bold mt-2 mb-4 display-6">¿Por qué elegir el Golfo de Morrosquillo?</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
              Desde las tranquilas playas de Coveñas hasta la vibrante cultura de Sincelejo, Sucre ofrece una combinación única de naturaleza virgen, gastronomía auténtica y hospitalidad caribeña.
            </p>
          </div>

          <div className="row g-5 text-center mt-2">
            <div className="col-md-4">
              <div className="icon-box shadow-sm transition-hover">
                <i className="bi bi-sun"></i>
              </div>
              <h4 className="fw-bold mb-3 fs-5">Clima Perfecto</h4>
              <p className="text-muted small">Disfruta de sol brillante y brisa marina durante todo el año, ideal para actividades acuáticas y descanso en la playa.</p>
            </div>
            <div className="col-md-4">
              <div className="icon-box shadow-sm transition-hover">
                <i className="bi bi-shop"></i>
              </div>
              <h4 className="fw-bold mb-3 fs-5">Cultura y Sabor</h4>
              <p className="text-muted small">Déjate sorprender por festivales tradicionales, artesanías locales y el inconfundible sabor del frito sabanero y los mariscos frescos.</p>
            </div>
            <div className="col-md-4">
              <div className="icon-box shadow-sm transition-hover">
                <i className="bi bi-geo-alt"></i>
              </div>
              <h4 className="fw-bold mb-3 fs-5">Destinos Cercanos</h4>
              <p className="text-muted small">Explora fácilmente múltiples municipios en distancias cortas. Pasa la mañana en Tolú y el atardecer en San Onofre.</p>
            </div>
          </div>
        </div>
{/* NUEVA SECCIÓN: NOTICIAS RECIENTES DEL GOLFO (CARRUSEL) */}
        <div className="mb-5 pb-5">
          <div className="text-center mb-5">
            <span className="text-uppercase tracking-wider fw-bold text-caribe-sobrio small">Actualidad</span>
            <h2 className="fw-bold mt-2 display-6" style={{ fontFamily: 'Playfair Display, serif', color: '#1a4341' }}>Noticias del Golfo</h2>
          </div>

          <div id="carouselNoticias" className="carousel slide noticias-carousel mx-auto" data-bs-ride="carousel" style={{ maxWidth: '900px' }}>
            
            {/* Indicadores (Puntitos abajo) */}
            <div className="carousel-indicators mb-4">
              <button type="button" data-bs-target="#carouselNoticias" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselNoticias" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselNoticias" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>

            {/* Slides de Noticias */}
            <div className="carousel-inner">
              
              {/* Noticia 1 */}
              <div className="carousel-item active" data-bs-interval="5000">
                <div className="noticia-slide" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1000&q=80)' }}>
                  <div className="noticia-overlay text-white">
                    <span className="badge bg-light text-caribe-sobrio mb-3 align-self-start fw-bold px-3 py-2 rounded-pill">Turismo Sostenible</span>
                    <h3 className="fw-bold display-6 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Coveñas recibe certificación de Playa Azul</h3>
                    <p className="fs-5 opacity-75 mb-0" style={{ maxWidth: '700px' }}>
                      El sector de la Primera Ensenada ha sido galardonado por su compromiso con el medio ambiente y la calidad de sus aguas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Noticia 2 */}
              <div className="carousel-item" data-bs-interval="5000">
                <div className="noticia-slide" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=1000&q=80)' }}>
                  <div className="noticia-overlay text-white">
                    <span className="badge bg-light text-caribe-sobrio mb-3 align-self-start fw-bold px-3 py-2 rounded-pill">Cultura</span>
                    <h3 className="fw-bold display-6 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Arrancan los preparativos para las Fiestas de Tolú</h3>
                    <p className="fs-5 opacity-75 mb-0" style={{ maxWidth: '700px' }}>
                      Las comparsas y bandas tradicionales ya afinan detalles para lo que será la celebración más grande del municipio este año.
                    </p>
                  </div>
                </div>
              </div>

              {/* Noticia 3 */}
              <div className="carousel-item" data-bs-interval="5000">
                <div className="noticia-slide" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1000&q=80)' }}>
                  <div className="noticia-overlay text-white">
                    <span className="badge bg-light text-caribe-sobrio mb-3 align-self-start fw-bold px-3 py-2 rounded-pill">Infraestructura</span>
                    <h3 className="fw-bold display-6 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Nueva vía conecta Rincón del Mar en tiempo récord</h3>
                    <p className="fs-5 opacity-75 mb-0" style={{ maxWidth: '700px' }}>
                      La pavimentación del tramo principal reducirá el tiempo de viaje, impulsando la llegada de turistas a este paraíso escondido.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Controles del Carrusel (Flechas) */}
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselNoticias" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselNoticias" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        </div>
        {/* SECCIÓN LLAMADO A LA ACCIÓN (CALL TO ACTION) */}
        <div className="text-center py-5 mb-5 border-top">
          <h3 className="fw-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#1a4341' }}>¿Eres dueño de un negocio turístico en Sucre?</h3>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '600px' }}>
            Únete a nuestra plataforma y muestra tu hotel, restaurante o tour a miles de visitantes interesados en descubrir el Golfo de Morrosquillo.
          </p>
          <Link to="/login" className="btn btn-caribe-sobrio btn-lg rounded-pill px-5 fw-bold shadow-sm">
            Registrar mi negocio
          </Link>
        </div>

      </div>
      {/* FOOTER CORPORATIVO Y CRÉDITOS */}
        <footer className="text-white pt-5 pb-4 mt-5 shadow-lg" style={{ backgroundColor: '#1a2e3b' }}>
          <div className="container text-center">
            <div className="mb-4">
              <i className="bi bi-water fs-1" style={{ color: '#2dd4bf' }}></i>
              <h4 className="fw-bold mt-2 mb-2" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '1px' }}>Sucre Turístico</h4>
              <p className="opacity-75 small mx-auto" style={{ maxWidth: '500px' }}>
                Plataforma tecnológica multi-tenant para la promoción inteligente del turismo, la gastronomía y la cultura en el Golfo de Morrosquillo.
              </p>
            </div>
            
            <div className="border-top border-light border-opacity-10 pt-4 mt-4">
              <p className="mb-2 small opacity-75">
                &copy; {new Date().getFullYear()} Sucre Turístico. Todos los derechos reservados.
              </p>
              <p className="mb-1 small opacity-75">
                Proyecto Integrador de Ingeniería de Sistemas <br/>
                Arquitectura y Desarrollo por <strong style={{ color: '#2dd4bf' }}>Moisés Patrón</strong>
              </p>
              <div className="mt-2">
                <span className="badge bg-dark border border-secondary text-light fw-normal py-1 px-2 mx-1">
                  <i className="bi bi-kanban me-1"></i> Scrum Master
                </span>
                <span className="badge bg-dark border border-secondary text-light fw-normal py-1 px-2 mx-1">
                  <i className="bi bi-code-slash me-1"></i> Full-Stack Dev
                </span>
                <span className="badge bg-dark border border-secondary text-light fw-normal py-1 px-2 mx-1">
                  <i className="bi bi-mortarboard me-1"></i> Corposucre
                </span>
              </div>
            </div>
          </div>
        </footer>
    </>
  );
};