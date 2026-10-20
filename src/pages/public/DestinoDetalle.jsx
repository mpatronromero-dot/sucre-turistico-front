import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export const DestinoDetalle = () => {
  const { id } = useParams(); // Captura el número de la URL
  const [destino, setDestino] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDetalle = async () => {
      // NOTA: Datos simulados momentáneos para armar la vista.
      // Próximamente reemplazarás esto por tu llamada a la API: await getDestinoById(id);
      const mockDestinos = [
        { id: 1, nombre: "Coveñas", municipio: "Coveñas", tipo: "Playa", descripcion: "Playas de agua tibia y tranquilas ideales para el descanso familiar." },
        { id: 2, nombre: "Tolú", municipio: "Santiago de Tolú", tipo: "Playa / Ecoturismo", descripcion: "Gran oferta turística, paseos en bicitaxi y excelente gastronomía." },
        { id: 3, nombre: "San Onofre", municipio: "San Onofre", tipo: "Playa / Ecoturismo", descripcion: "Hogar de Rincón del Mar, playas vírgenes de arena blanca, manglares y gran biodiversidad." }
      ];

      const encontrado = mockDestinos.find(d => d.id === parseInt(id));
      setDestino(encontrado);
      setCargando(false);
    };

    cargarDetalle();
  }, [id]);

  if (cargando) return <div className="container py-5 text-center"><h5>Cargando información...</h5></div>;
  if (!destino) return <div className="container py-5 text-center"><h5>Destino no encontrado.</h5></div>;

  return (
    <div className="container py-5">
      <Link to="/destinos" className="btn btn-light mb-4 shadow-sm">
        <i className="bi bi-arrow-left"></i> Volver a Destinos
      </Link>

      <div className="row align-items-center bg-white shadow-sm rounded-4 overflow-hidden">
        {/* Espacio para la foto */}
        <div className="col-md-6 p-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
            alt={destino.nombre}
            className="img-fluid w-100 object-fit-cover"
            style={{ minHeight: '400px' }}
          />
        </div>

        {/* Información detallada del destino */}
        <div className="col-md-6 p-5">
          <span className="badge bg-info text-dark mb-2">{destino.tipo}</span>
          <h1 className="display-5 fw-bold text-primary mb-3">{destino.nombre}</h1>
          <h5 className="text-muted mb-4">
            <i className="bi bi-geo-alt-fill"></i> {destino.municipio}, Sucre
          </h5>
          <p className="lead">{destino.descripcion}</p>
          <hr className="my-4" />
          <h6 className="fw-bold mb-3">¿Qué hacer aquí?</h6>
          <ul className="text-muted">
            <li>Disfrutar de la rica gastronomía local costera.</li>
            <li>Recorridos ecoturísticos guiados por la naturaleza.</li>
            <li>Actividades acuáticas y relajación total.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};