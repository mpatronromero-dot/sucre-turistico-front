import React, { useEffect, useState } from 'react';
import { getExperiencias } from '../../api/experienciasService';

export const Experiencias = () => {
  const [experiencias, setExperiencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  const mockImages = [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", // Buceo/Mar
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80", // Kayak
    "https://images.unsplash.com/photo-1533692328991-08159ff19fca?w=800&q=80", // Playa
    "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80"  // Naturaleza
  ];

  useEffect(() => {
    const cargar = async () => {
      const data = await getExperiencias();
      if (data.length === 0) {
        setExperiencias([
          { id: 1, nombre: "Tour Islas de San Bernardo", municipio: "Tolú", tipo: "Náutico", precio: "120000" },
          { id: 2, nombre: "Senderismo Ecológico", municipio: "San Onofre", tipo: "Ecológico", precio: "50000" }
        ]);
      } else { setExperiencias(data); }
      setCargando(false);
    };
    cargar();
  }, []);

  const filtradas = experiencias.filter(e => 
    (filtroMunicipio === '' || e.municipio === filtroMunicipio) &&
    (filtroTipo === '' || e.tipo === filtroTipo)
  );

  if (cargando) return <div className="container py-5 text-center"><h5>Cargando...</h5></div>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Experiencias y Tours</h2>
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '20px' }}>
            <h5 className="fw-bold mb-4"><i className="bi bi-funnel-fill text-info"></i> Filtros</h5>
            <div className="mb-4">
              <label className="fw-semibold mb-2">Ubicación</label>
              <select className="form-select" value={filtroMunicipio} onChange={e => setFiltroMunicipio(e.target.value)}>
                <option value="">Todas</option><option value="Coveñas">Coveñas</option><option value="Tolú">Tolú</option><option value="San Onofre">San Onofre</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="fw-semibold mb-2">Tipo de Actividad</label>
              <select className="form-select" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
                <option value="">Cualquiera</option><option value="Náutico">Náutico</option><option value="Ecológico">Ecológico</option><option value="Cultural">Cultural</option>
              </select>
            </div>
            <button className="btn btn-outline-info w-100 text-dark" onClick={() => { setFiltroMunicipio(''); setFiltroTipo(''); }}>Limpiar</button>
          </div>
        </div>
        {/* Resultados */}
        <div className="col-lg-9">
          {filtradas.map(lugar => (
            <div key={lugar.id} className="card shadow-sm border-0 mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap">
                  <div>
                    <h3 className="card-title fw-bold">{lugar.nombre}</h3>
                    <p className="text-muted mb-0"><i className="bi bi-compass"></i> {lugar.municipio} • {lugar.tipo}</p>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded text-end border border-info border-opacity-25 mt-3 mt-md-0">
                    <span className="d-block text-muted small fw-bold">Por persona</span>
                    <span className="fs-4 fw-bold text-dark">$ {new Intl.NumberFormat('es-CO').format(lugar.precio)}</span>
                    <button className="btn btn-info fw-bold d-block w-100 mt-2 text-white">Reservar</button>
                  </div>
                </div>
                <div className="row g-2 mt-3">
                  <div className="col-md-6"><img src={mockImages[0]} className="img-fluid rounded w-100 h-100 object-fit-cover" style={{ minHeight: '200px' }} /></div>
                  <div className="col-md-6"><img src={mockImages[1]} className="img-fluid rounded w-100 h-100 object-fit-cover" /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};