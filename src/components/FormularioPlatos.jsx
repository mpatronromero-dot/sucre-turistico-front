import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export const FormularioPlatos = () => {
  const [restaurantes, setRestaurantes] = useState([]);
  const [datosPlato, setDatosPlato] = useState({
    restaurante_id: '',
    nombre_plato: '',
    descripcion: '',
    precio: '',
    foto_url: ''
  });
  const [cargando, setCargando] = useState(false);

  // Cargar la lista de restaurantes para el menú desplegable
  useEffect(() => {
    fetch('http://localhost:3003/api/restaurantes')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setRestaurantes(data.data);
        }
      })
      .catch(err => console.error("Error cargando restaurantes:", err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosPlato({ ...datosPlato, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3003/api/platos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosPlato)
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        Swal.fire('¡Plato Agregado!', 'El plato ya está en la carta del restaurante.', 'success');
        // Limpiamos el formulario pero dejamos el restaurante seleccionado por si quiere agregar más platos
        setDatosPlato({ ...datosPlato, nombre_plato: '', descripcion: '', precio: '', foto_url: '' });
      } else {
        Swal.fire('Error', data.message || 'Hubo un problema al guardar', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4 mt-4 border-top border-success border-4">
      <h4 className="fw-bold mb-4 text-success"><i className="bi bi-egg-fried me-2"></i>Agregar Plato al Menú</h4>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">¿A qué restaurante pertenece este plato?</label>
          <select className="form-select" name="restaurante_id" value={datosPlato.restaurante_id} onChange={handleInputChange} required>
            <option value="">Selecciona un restaurante...</option>
            {restaurantes.map(rest => (
              <option key={rest.id} value={rest.id}>{rest.nombre} ({rest.municipio})</option>
            ))}
          </select>
        </div>

        <div className="row">
          <div className="col-md-8 mb-3">
            <label className="form-label fw-semibold">Nombre del Plato</label>
            <input type="text" className="form-control" name="nombre_plato" value={datosPlato.nombre_plato} onChange={handleInputChange} required placeholder="Ej. Mote de Queso Tradicional" />
          </div>
          
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Precio (COP)</label>
            <input type="number" className="form-control" name="precio" value={datosPlato.precio} onChange={handleInputChange} required placeholder="Ej. 25000" />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Ingredientes / Descripción</label>
          <textarea className="form-control" name="descripcion" rows="2" value={datosPlato.descripcion} onChange={handleInputChange} required placeholder="Queso costeño, ñame, suero, ajo..."></textarea>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Foto del Plato (URL)</label>
          <input type="url" className="form-control" name="foto_url" value={datosPlato.foto_url} onChange={handleInputChange} placeholder="https://ejemplo.com/foto-plato.jpg" />
        </div>

        <button type="submit" className="btn btn-success w-100 fw-bold py-2" disabled={cargando || restaurantes.length === 0}>
          {cargando ? 'Guardando...' : 'Guardar Plato'}
        </button>
      </form>
    </div>
  );
};