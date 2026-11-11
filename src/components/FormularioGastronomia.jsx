import React, { useState, useRef } from 'react';
import api from '../api/axiosConfig'; // Usa la instancia centralizada del API Gateway (puerto 3005)

export const FormularioGastronomia = () => {
    // 1. Estado del Restaurante
    const [formData, setFormData] = useState({
        nombre: '', municipio: '', tipo: '', direccion: '', descripcion: ''
    });
    const [imagen, setImagen] = useState(null);

    // 2. Estado Dinámico de Platos
    const [platos, setPlatos] = useState([
        { nombre: '', precio: '', descripcion: '', foto: null }
    ]);

    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const inputRestauranteRef = useRef(null);
    const platosFileRefs = useRef([]);

    // Manejadores del Restaurante
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setImagen(e.target.files[0]);

    // Manejadores de los Platos
    const handlePlatoChange = (index, campo, valor) => {
        const nuevosPlatos = [...platos];
        nuevosPlatos[index][campo] = valor;
        setPlatos(nuevosPlatos);
    };

    const handlePlatoFileChange = (index, archivo) => {
        const nuevosPlatos = [...platos];
        nuevosPlatos[index].foto = archivo;
        setPlatos(nuevosPlatos);
    };

    const agregarOtroPlato = () => {
        setPlatos([...platos, { nombre: '', precio: '', descripcion: '', foto: null }]);
    };

    const eliminarPlato = (index) => {
        const nuevosPlatos = platos.filter((_, i) => i !== index);
        setPlatos(nuevosPlatos);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });
        
        try {
            // PASO 1: Guardar el Restaurante con las columnas exactas de MySQL
            const dataRestaurante = new FormData();
            dataRestaurante.append('nombre', formData.nombre);
            dataRestaurante.append('municipio', formData.municipio);
            dataRestaurante.append('tipo', formData.tipo); // Coincide con la columna 'tipo'
            dataRestaurante.append('direccion', formData.direccion);
            dataRestaurante.append('descripcion', formData.descripcion);
            if (imagen) dataRestaurante.append('imagen_url', imagen); // Coincide con 'imagen_url'

            // Petición enviada a través del API Gateway (/api/gastronomia)
            const resRestaurante = await api.post('/gastronomia', dataRestaurante);
            
            const restauranteId = resRestaurante.data.id || resRestaurante.data.insertId;

            // PASO 2: Guardar los Platos asociados
            if (restauranteId) {
                for (const plato of platos) {
                    if (plato.nombre.trim() !== '') {
                        const dataPlato = new FormData();
                        dataPlato.append('restaurante_id', restauranteId); 
                        dataPlato.append('nombre', plato.nombre);
                        dataPlato.append('precio', plato.precio);
                        dataPlato.append('descripcion', plato.descripcion); // Coincide con 'descripcion'
                        if (plato.foto) dataPlato.append('imagen_url', plato.foto); // Coincide con 'imagen_url'

                        await api.post('/gastronomia/platos', dataPlato);
                    }
                }
            }
            
            // Limpieza
            setMensaje({ texto: '¡Restaurante y menú registrados exitosamente en la base de datos!', tipo: 'success' });
            setFormData({ nombre: '', municipio: '', tipo: '', direccion: '', descripcion: '' });
            setImagen(null);
            setPlatos([{ nombre: '', precio: '', descripcion: '', foto: null }]);
            
            if (inputRestauranteRef.current) inputRestauranteRef.current.value = "";
            platosFileRefs.current.forEach(ref => { if (ref) ref.value = ""; });
            
        } catch (error) {
            console.error('Error al registrar:', error);
            setMensaje({ texto: 'Error al registrar los datos. Revisa la consola o asegúrate de que MySQL y los microservicios estén encendidos.', tipo: 'danger' });
        }
    };

    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-primary text-white fw-bold py-3 fs-5">
                <i className="bi bi-shop"></i> Registrar Nuevo Restaurante y Menú
            </div>
            <div className="card-body p-4 bg-white">
                {mensaje.texto && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}
                
                <form onSubmit={handleSubmit}>
                    {/* SECCIÓN 1: DATOS DEL RESTAURANTE */}
                    <div className="row g-4">
                        <div className="col-md-12 mb-2 border-bottom pb-2">
                            <h5 className="text-secondary fw-bold">1. Datos del Establecimiento</h5>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Nombre del Restaurante</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control" required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Municipio</label>
                            <select name="municipio" value={formData.municipio} onChange={handleChange} className="form-control" required>
                                <option value="">Selecciona un municipio...</option>
                                <option value="Coveñas">Coveñas</option>
                                <option value="Tolú">Tolú</option>
                                <option value="San Onofre">San Onofre</option>
                                <option value="Sincelejo">Sincelejo</option>
                                <option value="San Antero">San Antero</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Tipo de Comida</label>
                            <select className="form-select" name="tipo" value={formData.tipo} onChange={handleChange} required>
                                <option value="">Seleccione una opción...</option>
                                <option value="Almuerzo / Corriente">Almuerzo / Corriente</option>
                                <option value="Mariscos y Pescados">Mariscos y Pescados</option>
                                <option value="Comida Tradicional / Típica">Comida Tradicional / Típica</option>
                                <option value="Comida Rápida">Comida Rápida</option>
                                <option value="Comida vegana">Comida Vegana</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Dirección</label>
                            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="form-control" required />
                        </div>

                        <div className="col-md-12 mt-4">
                            <label className="form-label fw-bold text-primary"><i className="bi bi-file-earmark-image"></i> Subir Imagen de Portada (.jpg, .png)</label>
                            <input 
                                type="file" 
                                id="imagen_restaurante" 
                                ref={inputRestauranteRef}
                                accept="image/*" 
                                onChange={handleFileChange} 
                                className="form-control" 
                            />
                        </div>

                        <div className="col-md-12 mt-3">
                            <label className="form-label fw-bold">Descripción del Restaurante</label>
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control" rows="3" required></textarea>
                        </div>
                    </div>

                    {/* SECCIÓN 2: DATOS DEL MENÚ / PLATOS */}
                    <div className="row g-4 mt-4">
                        <div className="col-md-12 mb-2 border-bottom pb-2">
                            <h5 className="text-success fw-bold">2. Agregar Platos al Menú</h5>
                            <small className="text-muted">Añade los platos principales que ofrecerá este restaurante.</small>
                        </div>

                        {platos.map((plato, index) => (
                            <div key={index} className="col-12">
                                <div className="card bg-light border-success bg-opacity-10 p-3 position-relative">
                                    {platos.length > 1 && (
                                        <button 
                                            type="button" 
                                            className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2"
                                            onClick={() => eliminarPlato(index)}
                                        >
                                            <i className="bi bi-trash"></i> Eliminar
                                        </button>
                                    )}
                                    
                                    <h6 className="text-success fw-bold mb-3">Plato #{index + 1}</h6>
                                    
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Nombre del Plato</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={plato.nombre}
                                                onChange={(e) => handlePlatoChange(index, 'nombre', e.target.value)}
                                                placeholder="Ej. Mote de Queso"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Precio (COP)</label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                value={plato.precio}
                                                onChange={(e) => handlePlatoChange(index, 'precio', e.target.value)}
                                                placeholder="Ej. 25000"
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label">Descripción del Plato</label>
                                            <textarea 
                                                className="form-control" 
                                                value={plato.descripcion}
                                                onChange={(e) => handlePlatoChange(index, 'descripcion', e.target.value)}
                                                rows="2"
                                                placeholder="Queso costeño, ñame, suero..."
                                            ></textarea>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label"><i className="bi bi-image"></i> Foto del Plato (Opcional)</label>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                ref={(el) => (platosFileRefs.current[index] = el)}
                                                onChange={(e) => handlePlatoFileChange(index, e.target.files[0])} 
                                                className="form-control" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="col-12 mt-3">
                            <button type="button" className="btn btn-outline-success fw-bold" onClick={agregarOtroPlato}>
                                <i className="bi bi-plus-circle"></i> Agregar otro plato
                            </button>
                        </div>
                    </div>

                    <div className="col-12 mt-5">
                        <button type="submit" className="btn btn-primary fw-bold px-5 py-3 w-100 shadow-sm fs-5">
                            <i className="bi bi-save"></i> Guardar Restaurante y Menú
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};