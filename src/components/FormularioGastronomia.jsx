import React, { useState } from 'react';
import Swal from 'sweetalert2';

export const FormularioGastronomia = () => {
  const [datosRestaurante, setDatosRestaurante] = useState({
    nombre: '',
    municipio: '',
    tipo_comida: '',
    descripcion: '',
    direccion: '',
    imagen_portada: ''
  });

  const [cargando, setCargando] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosRestaurante({ ...datosRestaurante, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    // 1. Extraer el token de seguridad
    const token = localStorage.getItem('token');

    try {
      // 2. Enviar los datos al Back-End
      // Nota: Asegúrate de que la URL apunte al puerto 3003 (tu microservicio) o al Gateway (3005)
      const response = await fetch('http://localhost:3003/api/restaurantes', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ¡El guardián SaaS!
        },
        body: JSON.stringify(datosRestaurante)
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        Swal.fire('¡Éxito!', 'Restaurante registrado correctamente', 'success');
        // Limpiar el formulario
        setDatosRestaurante({
          nombre: '', municipio: '', tipo_comida: '', descripcion: '', direccion: '', imagen_portada: ''
        });
      } else {
        Swal.fire('Error', data.message || 'Hubo un problema al registrar', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4">
      <h4 className="fw-bold mb-4 text-primary"><i className="bi bi-shop me-2"></i>Registrar Nuevo Restaurante</h4>
      
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Nombre del Restaurante</label>
            <input type="text" className="form-control" name="nombre" value={datosRestaurante.nombre} onChange={handleInputChange} required placeholder="Ej. El Buen Sabor" />
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Municipio</label>
            <select className="form-select" name="municipio" value={datosRestaurante.municipio} onChange={handleInputChange} required>
              <option value="">Selecciona un municipio...</option>
              <option value="Sincelejo">Sincelejo</option>
              <option value="Corozal">Corozal</option>
              <option value="Tolú">Tolú</option>
              <option value="Coveñas">Coveñas</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Tipo de Comida</label>
            <input type="text" className="form-control" name="tipo_comida" value={datosRestaurante.tipo_comida} onChange={handleInputChange} required placeholder="Ej. Típica, Mariscos, Internacional" />
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Dirección</label>
            <input type="text" className="form-control" name="direccion" value={datosRestaurante.direccion} onChange={handleInputChange} required placeholder="Ej. Calle 20 #15-30" />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Descripción del Restaurante</label>
          <textarea className="form-control" name="descripcion" rows="3" value={datosRestaurante.descripcion} onChange={handleInputChange} required placeholder="Describe brevemente el ambiente y especialidad..."></textarea>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">URL de Imagen de Portada</label>
          <input type="url" className="form-control" name="imagen_portada" value={datosRestaurante.imagen_portada} onChange={handleInputChange} placeholder="https://ejemplo.com/foto-restaurante.jpg" />
          <div className="form-text text-muted small">Pega el enlace directo de una imagen de internet.</div>
        </div>

        <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Registrar Restaurante'}
        </button>
      </form>
    </div>
  );
};