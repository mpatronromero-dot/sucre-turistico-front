import React, { useState, useRef } from 'react';
import api from '../api/axiosConfig';

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
            const dataRestaurante = new FormData();
            dataRestaurante.append('nombre', formData.nombre);
            dataRestaurante.append('municipio', formData.municipio);
            dataRestaurante.append('tipo', formData.tipo);
            dataRestaurante.append('direccion', formData.direccion);
            dataRestaurante.append('descripcion', formData.descripcion);
            if (imagen) dataRestaurante.append('imagen_url', imagen);

            const resRestaurante = await api.post('/gastronomia', dataRestaurante);
            const restauranteId = resRestaurante.data.id || resRestaurante.data.insertId;

            if (restauranteId) {
                for (const plato of platos) {
                    if (plato.nombre.trim() !== '') {
                        const dataPlato = new FormData();
                        dataPlato.append('restaurante_id', restauranteId); 
                        dataPlato.append('nombre', plato.nombre);
                        dataPlato.append('precio', plato.precio);
                        dataPlato.append('descripcion', plato.descripcion); 
                        if (plato.foto) dataPlato.append('imagen_url', plato.foto);

                        await api.post('/gastronomia/platos', dataPlato);
                    }
                }
            }
            
            setMensaje({ texto: '¡Restaurante y menú registrados exitosamente en la base de datos!', tipo: 'success' });
            setFormData({ nombre: '', municipio: '', tipo: '', direccion: '', descripcion: '' });
            setImagen(null);
            setPlatos([{ nombre: '', precio: '', descripcion: '', foto: null }]);
            
            if (inputRestauranteRef.current) inputRestauranteRef.current.value = "";
            platosFileRefs.current.forEach(ref => { if (ref) ref.value = ""; });
            
        } catch (error) {
            console.error('Error al registrar:', error);
            setMensaje({ texto: 'Error al registrar los datos. Revisa la conexión o consola.', tipo: 'danger' });
        }
    };

    return (
        <div className="card shadow border-0 mb-4 rounded-4 bg-white overflow-hidden">
            
            {/* Encabezado corporativo estandarizado */}
            <div className="card-header bg-white border-bottom border-light py-4 px-4">
                <h4 className="fw-bold mb-0 text-caribe-sobrio">
                    <i className="bi bi-shop me-2"></i> Registrar Restaurante y Menú
                </h4>
                <p className="text-muted small mb-0 mt-1">Sube la información de tu establecimiento y los platos principales que ofreces.</p>
            </div>
            
            <div className="card-body p-4 p-md-5">
                {mensaje.texto && (
                    <div className={`alert alert-${mensaje.tipo} rounded-3 border-0 shadow-sm d-flex align-items-center`}>
                        <i className={`bi bi-${mensaje.tipo === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-2 fs-5`}></i>
                        {mensaje.texto}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    {/* SECCIÓN 1: DATOS DEL RESTAURANTE */}
                    <div className="row g-4">
                        <div className="col-12 mt-2">
                            <h6 className="fw-bold text-caribe-sobrio mb-3 pb-2 border-bottom border-light text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>
                                1. Datos del Establecimiento
                            </h6>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Nombre del Restaurante</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control form-control-lg bg-light border-0" placeholder="Ej. Restaurante El Pargo Real" required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Municipio</label>
                            <select name="municipio" value={formData.municipio} onChange={handleChange} className="form-select form-select-lg bg-light border-0" required>
                                <option value="">Selecciona un municipio...</option>
                                <option value="Coveñas">Coveñas</option>
                                <option value="Tolú">Tolú</option>
                                <option value="San Onofre">San Onofre</option>
                                <option value="Sincelejo">Sincelejo</option>
                                <option value="San Antero">San Antero</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Tipo de Comida</label>
                            <select className="form-select form-select-lg bg-light border-0" name="tipo" value={formData.tipo} onChange={handleChange} required>
                                <option value="">Seleccione una opción...</option>
                                <option value="Almuerzo / Corriente">Almuerzo / Corriente</option>
                                <option value="Mariscos y Pescados">Mariscos y Pescados</option>
                                <option value="Comida Tradicional / Típica">Comida Tradicional / Típica</option>
                                <option value="Comida Rápida">Comida Rápida</option>
                                <option value="Comida vegana">Comida Vegana</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Dirección</label>
                            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="form-control form-control-lg bg-light border-0" placeholder="Ej. Calle 1 #2-3 Playa Principal" required />
                        </div>

                        <div className="col-md-12 mt-4">
                            <div className="p-4 border rounded-4 bg-light border-dashed text-center">
                                <label className="form-label fw-bold text-caribe-sobrio d-block mb-3 cursor-pointer">
                                    <i className="bi bi-cloud-arrow-up display-4 d-block mb-2"></i> 
                                    Subir Imagen de Portada (.jpg, .png)
                                </label>
                                <input 
                                    type="file" 
                                    id="imagen_restaurante" 
                                    ref={inputRestauranteRef}
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    className="form-control d-none" 
                                />
                                <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => document.getElementById('imagen_restaurante').click()}>
                                    Explorar Archivos
                                </button>
                                {imagen && <p className="text-success mt-3 mb-0 fw-semibold"><i className="bi bi-check-lg me-1"></i> Archivo seleccionado: {imagen.name}</p>}
                            </div>
                        </div>

                        <div className="col-md-12 mt-3">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Descripción del Restaurante</label>
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control bg-light border-0" rows="3" placeholder="Cuéntanos sobre el ambiente, historia o especialidades del lugar..." required></textarea>
                        </div>
                    </div>

                    {/* SECCIÓN 2: DATOS DEL MENÚ / PLATOS */}
                    <div className="row g-4 mt-5">
                        <div className="col-12 mt-2">
                            <h6 className="fw-bold text-caribe-sobrio mb-3 pb-2 border-bottom border-light text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>
                                2. Configurar Menú
                            </h6>
                        </div>

                        {platos.map((plato, index) => (
                            <div key={index} className="col-12">
                                <div className="card bg-white border border-light shadow-sm rounded-4 p-4 position-relative">
                                    {platos.length > 1 && (
                                        <button 
                                            type="button" 
                                            className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-3 rounded-circle"
                                            onClick={() => eliminarPlato(index)}
                                            title="Eliminar plato"
                                            style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    )}
                                    
                                    <h6 className="text-muted fw-bold mb-4 text-uppercase small"><i className="bi bi-hash"></i> Plato {index + 1}</h6>
                                    
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold text-secondary small">Nombre del Plato</label>
                                            <input 
                                                type="text" 
                                                className="form-control bg-light border-0" 
                                                value={plato.nombre}
                                                onChange={(e) => handlePlatoChange(index, 'nombre', e.target.value)}
                                                placeholder="Ej. Mote de Queso Tradicional"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold text-secondary small">Precio (COP)</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0 text-muted">$</span>
                                                <input 
                                                    type="number" 
                                                    className="form-control bg-light border-0" 
                                                    value={plato.precio}
                                                    onChange={(e) => handlePlatoChange(index, 'precio', e.target.value)}
                                                    placeholder="Ej. 25000"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label fw-semibold text-secondary small">Descripción del Plato</label>
                                            <textarea 
                                                className="form-control bg-light border-0" 
                                                value={plato.descripcion}
                                                onChange={(e) => handlePlatoChange(index, 'descripcion', e.target.value)}
                                                rows="2"
                                                placeholder="Queso costeño, ñame, suero, ajo..."
                                            ></textarea>
                                        </div>
                                        <div className="col-md-12 mt-3">
                                            <label className="form-label fw-semibold text-caribe-sobrio small"><i className="bi bi-camera me-1"></i> Foto del Plato (Opcional)</label>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                ref={(el) => (platosFileRefs.current[index] = el)}
                                                onChange={(e) => handlePlatoFileChange(index, e.target.files[0])} 
                                                className="form-control form-control-sm bg-light border-0" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="col-12 mt-3">
                            <button type="button" className="btn btn-light fw-bold text-caribe-sobrio border-dashed w-100 py-3 rounded-4" onClick={agregarOtroPlato}>
                                <i className="bi bi-plus-circle-fill me-2"></i> Añadir otro plato al menú
                            </button>
                        </div>
                    </div>

                    <div className="col-12 mt-5 text-end border-top pt-4">
                        <button type="button" className="btn btn-light me-3 rounded-pill px-4 fw-bold text-muted">Cancelar</button>
                        <button type="submit" className="btn btn-caribe-sobrio fw-bold px-5 py-2 shadow rounded-pill">
                            <i className="bi bi-save me-2"></i> Guardar Restaurante y Menú
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};