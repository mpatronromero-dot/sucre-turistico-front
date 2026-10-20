import React, { useState } from 'react';

export const FormularioAlojamiento = () => {
  // 1. Estados básicos
  const [nombre, setNombre] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');

  // 2. Estado de habitaciones
  const [habitaciones, setHabitaciones] = useState([
    { tipo_habitacion: '', descripcion_camas: '', capacidad_personas: '', precio_noche: '' }
  ]);

  // 3. NUEVO: Estado para la galería de fotos (Arreglo de strings)
  const [galeria, setGaleria] = useState(['']); // Empieza con un espacio para URL vacío

  // Funciones para HABITACIONES
  const agregarHabitacion = () => setHabitaciones([...habitaciones, { tipo_habitacion: '', descripcion_camas: '', capacidad_personas: '', precio_noche: '' }]);
  const eliminarHabitacion = (index) => setHabitaciones(habitaciones.filter((_, i) => i !== index));
  const handleChangeHabitacion = (index, campo, valor) => {
    const nuevasHabitaciones = [...habitaciones];
    nuevasHabitaciones[index][campo] = valor;
    setHabitaciones(nuevasHabitaciones);
  };

  // NUEVO: Funciones para la GALERÍA
  const agregarFotoGaleria = () => setGaleria([...galeria, '']);
  const eliminarFotoGaleria = (index) => setGaleria(galeria.filter((_, i) => i !== index));
  const handleChangeFotoGaleria = (index, valor) => {
    const nuevaGaleria = [...galeria];
    nuevaGaleria[index] = valor;
    setGaleria(nuevaGaleria);
  };

  // Función Guardar Todo
  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosAlojamiento = {
      nombre,
      municipio,
      tipo,
      descripcion,
      imagen_url: imagenUrl,
      habitaciones,
      galeria // Enviamos la galería al Back-End
    };

    try {
      const response = await fetch('http://localhost:3005/api/alojamientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAlojamiento)
      });

      const result = await response.json();
      if (result.status === 'success') {
        alert('¡Alojamiento, habitaciones y galería guardados con éxito!');
        // Limpiamos todo
        setNombre(''); setMunicipio(''); setTipo(''); setDescripcion(''); setImagenUrl('');
        setHabitaciones([{ tipo_habitacion: '', descripcion_camas: '', capacidad_personas: '', precio_noche: '' }]);
        setGaleria(['']); // Limpiamos galería
      } else {
        alert('Error al guardar: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4 mb-4 rounded-4">
      <h3 className="fw-bold mb-4 text-primary">Registrar Nuevo Alojamiento</h3>
      
      <form onSubmit={handleSubmit}>
        {/* ======================= DATOS DEL HOTEL ======================= */}
        <div className="mb-3">
          <label className="fw-semibold form-label">Nombre del Hotel/Hostal</label>
          <input type="text" className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} required />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="fw-semibold form-label">Municipio</label>
            <select className="form-select" value={municipio} onChange={e => setMunicipio(e.target.value)} required>
              <option value="">Selecciona uno...</option>
              <option value="Sincelejo">Sincelejo</option>
              <option value="Coveñas">Coveñas</option>
              <option value="Santiago de Tolú">Santiago de Tolú</option>
              <option value="San Onofre">San Onofre</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="fw-semibold form-label">Tipo de Alojamiento</label>
            <select className="form-select" value={tipo} onChange={e => setTipo(e.target.value)} required>
              <option value="">Selecciona uno...</option>
              <option value="Hotel">Hotel</option>
              <option value="Cabaña">Cabaña</option>
              <option value="Hostal">Hostal</option>
            </select>
          </div>
        </div>

        {/* FOTO PRINCIPAL */}
        <div className="mb-3">
          <label className="fw-semibold form-label">URL de la Imagen Principal (Portada)</label>
          <input type="url" className="form-control" placeholder="https://ejemplo.com/portada.jpg" value={imagenUrl} onChange={e => setImagenUrl(e.target.value)} />
        </div>

        <div className="mb-4">
          <label className="fw-semibold form-label">Descripción general</label>
          <textarea className="form-control" rows="3" value={descripcion} onChange={e => setDescripcion(e.target.value)} required></textarea>
        </div>

        <hr className="my-4" />

        {/* ======================= GALERÍA DE FOTOS ADICIONALES ======================= */}
        <h4 className="fw-bold mb-3 text-success">Galería de Fotos del Hotel</h4>
        <p className="text-muted small">Añade enlaces de imágenes para mostrar las instalaciones (piscinas, restaurantes, fachadas).</p>
        
        {galeria.map((url, index) => (
          <div key={index} className="d-flex gap-2 mb-2 align-items-center">
             <input 
                type="url" 
                className="form-control" 
                placeholder="https://ejemplo.com/foto-piscina.jpg" 
                value={url} 
                onChange={e => handleChangeFotoGaleria(index, e.target.value)} 
             />
             {galeria.length > 1 && (
                <button type="button" className="btn btn-outline-danger" onClick={() => eliminarFotoGaleria(index)}>
                  <i className="bi bi-trash-fill"></i>
                </button>
             )}
          </div>
        ))}

        <button type="button" className="btn btn-outline-success mb-4 btn-sm fw-bold border-dashed mt-2" onClick={agregarFotoGaleria}>
          <i className="bi bi-image"></i> + Añadir otra foto a la galería
        </button>

        <hr className="my-4" />

        {/* ======================= SECCIÓN DE HABITACIONES ======================= */}
        <h4 className="fw-bold mb-3 text-secondary">Catálogo de Habitaciones</h4>
        
        {habitaciones.map((hab, index) => (
          <div key={index} className="p-3 mb-3 border rounded-3 bg-light position-relative">
            {habitaciones.length > 1 && (
              <button type="button" className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2" onClick={() => eliminarHabitacion(index)}>
                <i className="bi bi-trash-fill"></i> Borrar
              </button>
            )}

            <h6 className="fw-bold text-dark mb-3">Habitación #{index + 1}</h6>
            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label small text-muted mb-1">Nombre/Tipo (Ej. Doble Deluxe)</label>
                <input type="text" className="form-control form-control-sm" value={hab.tipo_habitacion} onChange={e => handleChangeHabitacion(index, 'tipo_habitacion', e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted mb-1">Camas (Ej. 1 cama doble y 1 sofá)</label>
                <input type="text" className="form-control form-control-sm" value={hab.descripcion_camas} onChange={e => handleChangeHabitacion(index, 'descripcion_camas', e.target.value)} required />
              </div>
              <div className="col-md-6 mt-2">
                <label className="form-label small text-muted mb-1">Capacidad Máxima</label>
                <input type="number" className="form-control form-control-sm" value={hab.capacidad_personas} onChange={e => handleChangeHabitacion(index, 'capacidad_personas', e.target.value)} required />
              </div>
              <div className="col-md-6 mt-2">
                <label className="form-label small text-muted mb-1">Precio por Noche (COP)</label>
                <input type="number" className="form-control form-control-sm" value={hab.precio_noche} onChange={e => handleChangeHabitacion(index, 'precio_noche', e.target.value)} required />
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-outline-primary mb-4 w-100 fw-bold border-dashed" onClick={agregarHabitacion}>
          <i className="bi bi-plus-circle"></i> + Agregar otra habitación
        </button>

        <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm">
          <i className="bi bi-save-fill"></i> Guardar Hotel Completo
        </button>
      </form>
    </div>
  );
};