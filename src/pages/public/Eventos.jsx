import React, { useEffect, useState } from 'react';
import { getEventos } from '../../api/eventosService';

export const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroMes, setFiltroMes] = useState('');

  useEffect(() => {
    const cargar = async () => {
      const data = await getEventos();
      if (data.length === 0) {
        setEventos([
          { id: 1, nombre: "Fiestas del 20 de Enero", municipio: "Sincelejo", fecha: "2027-01-20", tipo: "Festividad" },
          { id: 2, nombre: "Festival de la Pollera Colorá", municipio: "Sampués", fecha: "2026-10-15", tipo: "Cultural" }
        ]);
      } else { setEventos(data); }
      setCargando(false);
    };
    cargar();
  }, []);

  const filtrados = eventos.filter(e => {
    if (filtroMes === '') return true;
    const mesEvento = new Date(e.fecha).getMonth() + 1; // 1 a 12
    return mesEvento.toString() === filtroMes;
  });

  if (cargando) return <div className="container py-5 text-center"><h5>Cargando agenda...</h5></div>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Agenda y Eventos</h2>
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '20px' }}>
            <h5 className="fw-bold mb-4"><i className="bi bi-calendar-event text-danger"></i> Filtros</h5>
            <div className="mb-4">
              <label className="fw-semibold mb-2">Mes del evento</label>
              <select className="form-select" value={filtroMes} onChange={e => setFiltroMes(e.target.value)}>
                <option value="">Cualquier fecha</option>
                <option value="1">Enero</option>
                <option value="10">Octubre</option>
                <option value="12">Diciembre</option>
              </select>
            </div>
            <button className="btn btn-outline-danger w-100" onClick={() => setFiltroMes('')}>Limpiar</button>
          </div>
        </div>
        {/* Resultados */}
        <div className="col-lg-9">
          {filtrados.map(ev => (
            <div key={ev.id} className="card shadow-sm border-0 mb-4 border-start border-danger border-5">
              <div className="card-body p-4 d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="card-title fw-bold text-danger">{ev.nombre}</h4>
                  <p className="text-muted mb-0"><i className="bi bi-pin-map-fill"></i> {ev.municipio} • {ev.tipo}</p>
                </div>
                <div className="text-end">
                  <span className="d-block text-muted small fw-bold">Fecha programada</span>
                  <span className="fs-5 fw-bold text-dark">{ev.fecha}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};