import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Admin = () => {
  // Datos de prueba para el gráfico
  const datosVisitas = [
    { municipio: 'Coveñas', visitas: 4500 },
    { municipio: 'Tolú', visitas: 3200 },
    { municipio: 'San Onofre', visitas: 1800 },
  ];

  // Datos de prueba para la tabla CRUD
  const [servicios, setServicios] = useState([
    { id: 1, nombre: 'Hotel Playa Blanca', tipo: 'Alojamiento', municipio: 'Coveñas', estado: 'Activo' },
    { id: 2, nombre: 'Tour Islas San Bernardo', tipo: 'Experiencia', municipio: 'Tolú', estado: 'Activo' },
    { id: 3, nombre: 'Restaurante El Pargo', tipo: 'Gastronomía', municipio: 'San Onofre', estado: 'Inactivo' },
  ]);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      {/* SIDEBAR (Barra lateral izquierda) */}
      <div className="bg-dark text-white p-4" style={{ width: '280px' }}>
        <h4 className="fw-bold mb-4 text-info"><i className="bi bi-shield-lock-fill"></i> Panel Admin</h4>
        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <a href="#" className="nav-link text-white bg-primary rounded"><i className="bi bi-speedometer2 me-2"></i> Dashboard</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white"><i className="bi bi-building me-2"></i> Alojamientos</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white"><i className="bi bi-cup-hot me-2"></i> Gastronomía</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white"><i className="bi bi-compass me-2"></i> Experiencias</a>
          </li>
        </ul>
        <div className="mt-auto pt-5">
          <hr className="border-secondary" />
          <div className="d-flex align-items-center">
            <i className="bi bi-person-circle fs-3 me-2 text-info"></i>
            <div>
              <strong className="d-block">Moisés Patrón</strong>
              <small className="text-muted">Scrum Master</small>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-grow-1 p-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Resumen General</h2>
          <button className="btn btn-success fw-bold"><i className="bi bi-plus-lg me-2"></i> Nuevo Registro</button>
        </div>

        {/* Tarjetas de Métricas */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 border-start border-primary border-5">
              <h6 className="text-muted fw-bold">Total Alojamientos</h6>
              <h2 className="fw-bold mb-0">124</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 border-start border-success border-5">
              <h6 className="text-muted fw-bold">Turistas Registrados</h6>
              <h2 className="fw-bold mb-0">8,432</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 border-start border-warning border-5">
              <h6 className="text-muted fw-bold">Reservas Activas</h6>
              <h2 className="fw-bold mb-0">56</h2>
            </div>
          </div>
        </div>

        {/* Gráfico y Tabla CRUD */}
        <div className="row g-4">
          {/* Gráfico de Recharts */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-4">Visitas por Municipio</h5>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosVisitas}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="municipio" />
                    <YAxis />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="visitas" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tabla CRUD */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-4">Gestión de Catálogo (CRUD)</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Ubicación</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicios.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-semibold">{item.nombre}</td>
                        <td>{item.tipo}</td>
                        <td>{item.municipio}</td>
                        <td>
                          <span className={`badge ${item.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                            {item.estado}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2"><i className="bi bi-pencil-square"></i></button>
                          <button className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};