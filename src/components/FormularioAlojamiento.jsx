import React, { useState } from 'react';

export const FormularioAlojamiento = () => {
  // Creamos el "paquete" (estado) vacío para guardar lo que el usuario escriba
  const [formData, setFormData] = useState({
    nombre: '',
    municipio: '',
    tipo: '',
    descripcion: ''
  });

  // Función para actualizar el paquete cada vez que el usuario teclea algo
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función que se dispara al hacer clic en "Guardar"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar

    try {
      // Hacemos el envío (petición POST) al Back-End. 
      // Nota: Uso el puerto 3005 asumiendo que es tu API Gateway. Si no funciona, cámbialo al 3002 (directo al servicio)
      const response = await fetch('http://localhost:3005/api/alojamientos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Le decimos al Back-End que le enviamos un JSON
        },
        body: JSON.stringify(formData) // Convertimos nuestro paquete a texto JSON
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert('¡Alojamiento guardado con éxito en la nube!');
        // Limpiamos el formulario para que quede en blanco de nuevo
        setFormData({ nombre: '', municipio: '', tipo: '', descripcion: '' });
      } else {
        alert('Hubo un problema al guardar el alojamiento.');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0 p-4 max-w-md mx-auto">
        <h3 className="text-primary mb-4 fw-bold">Agregar Nuevo Alojamiento</h3>
        
        <form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <div className="mb-3">
            <label className="form-label fw-bold">Nombre del Hotel/Hostal</label>
            <input 
              type="text" 
              className="form-control" 
              name="nombre" // ESTO DEBE COINCIDIR EXACTAMENTE CON EL BACK-END
              value={formData.nombre} 
              onChange={handleChange} 
              required 
              placeholder="Ej: Hotel Playa Blanca"
            />
          </div>

          {/* Campo Municipio */}
          <div className="mb-3">
            <label className="form-label fw-bold">Municipio</label>
            <select 
              className="form-select" 
              name="municipio" 
              value={formData.municipio} 
              onChange={handleChange} 
              required
            >
              <option value="">Selecciona un municipio...</option>
              <option value="Coveñas">Coveñas</option>
              <option value="Tolú">Santiago de Tolú</option>
              <option value="San Onofre">San Onofre</option>
              <option value="Sincelejo">Sincelejo</option>
            </select>
          </div>

          {/* Campo Tipo */}
          <div className="mb-3">
            <label className="form-label fw-bold">Tipo de Alojamiento</label>
            <input 
              type="text" 
              className="form-control" 
              name="tipo" 
              value={formData.tipo} 
              onChange={handleChange} 
              required 
              placeholder="Ej: Cabaña, Hostal, Hotel Resort"
            />
          </div>

          {/* Campo Descripción */}
          <div className="mb-4">
            <label className="form-label fw-bold">Descripción</label>
            <textarea 
              className="form-control" 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleChange} 
              rows="3" 
              required 
              placeholder="Describe las amenidades y atractivos del lugar..."
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold">
            Guardar Alojamiento
          </button>
        </form>
      </div>
    </div>
  );
};