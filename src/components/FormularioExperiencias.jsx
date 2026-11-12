import React, { useState, useRef } from 'react';
import api from '../api/axiosConfig';

export const FormularioExperiencias = () => {
    // 1. Estado inicial del formulario
    const [formData, setFormData] = useState({
        nombre: '', municipio: 'Tolú', tipo: 'Náutico', descripcion: '', 
        costo_estimado: '', tipo_tarifa: 'Por persona'
    });
    const [imagen, setImagen] = useState(null);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    // Referencia para limpiar el input file visualmente
    const inputFileRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImagen(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });
        
        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('municipio', formData.municipio);
        data.append('tipo', formData.tipo);
        data.append('descripcion', formData.descripcion);
        data.append('costo_estimado', formData.costo_estimado);
        data.append('tipo_tarifa', formData.tipo_tarifa);
        
        if (imagen) {
            data.append('imagen', imagen); 
        }

        try {
            // Petición a través del API Gateway
            await api.post('/experiencias', data);
            
            setMensaje({ texto: '¡Experiencia turística registrada y publicada con éxito!', tipo: 'success' });
            
            // Limpiamos todo al terminar
            setFormData({ nombre: '', municipio: 'Tolú', tipo: 'Náutico', descripcion: '', costo_estimado: '', tipo_tarifa: 'Por persona' });
            setImagen(null);
            
            if (inputFileRef.current) {
                inputFileRef.current.value = "";
            }
            
        } catch (error) {
            console.error("Error al registrar experiencia:", error);
            setMensaje({ texto: 'Error al registrar la experiencia. Verifica la conexión con el servidor.', tipo: 'danger' });
        }
    };

    return (
        <div className="card shadow border-0 mb-4 rounded-4 bg-white overflow-hidden">
            
            {/* Encabezado limpio y corporativo */}
            <div className="card-header bg-white border-bottom border-light py-4 px-4">
                <h4 className="fw-bold mb-0 text-caribe-sobrio">
                    <i className="bi bi-compass me-2"></i> Registrar Nueva Experiencia
                </h4>
                <p className="text-muted small mb-0 mt-1">Sube la información de tus tours y actividades turísticas al catálogo del Golfo.</p>
            </div>
            
            <div className="card-body p-4 p-md-5">
                {mensaje.texto && (
                    <div className={`alert alert-${mensaje.tipo} rounded-3 border-0 shadow-sm d-flex align-items-center`}>
                        <i className={`bi bi-${mensaje.tipo === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-2 fs-5`}></i>
                        {mensaje.texto}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        
                        <div className="col-12 mt-2">
                            <h6 className="fw-bold text-caribe-sobrio mb-3 pb-2 border-bottom border-light text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>
                                1. Información de la Actividad
                            </h6>
                        </div>
                        
                        <div className="col-md-12">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Nombre de la Experiencia / Tour</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control form-control-lg bg-light border-0" placeholder="Ej: Paseo en Lancha por las Islas de San Bernardo" required />
                        </div>
                        
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Municipio de Salida</label>
                            <select name="municipio" value={formData.municipio} onChange={handleChange} className="form-select form-select-lg bg-light border-0">
                                <option value="Coveñas">Coveñas</option>
                                <option value="Tolú">Tolú</option>
                                <option value="San Onofre">San Onofre</option>
                                <option value="San Antero">San Antero</option>
                                <option value="Toluviejo">Toluviejo</option>
                            </select>
                        </div>
                        
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Categoría</label>
                            <select name="tipo" value={formData.tipo} onChange={handleChange} className="form-select form-select-lg bg-light border-0">
                                <option value="Náutico">Náutico (Playas, Islas)</option>
                                <option value="Ecológico">Ecológico (Manglares, Senderismo)</option>
                                <option value="Cultural">Cultural (Historia, Tradición)</option>
                            </select>
                        </div>

                        <div className="col-12 mt-5">
                            <h6 className="fw-bold text-caribe-sobrio mb-3 pb-2 border-bottom border-light text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>
                                2. Tarifas y Detalles
                            </h6>
                        </div>
                        
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Costo Estimado (COP)</label>
                            <div className="input-group input-group-lg">
                                <span className="input-group-text bg-light border-0 text-muted">$</span>
                                <input type="number" name="costo_estimado" value={formData.costo_estimado} onChange={handleChange} className="form-control bg-light border-0" placeholder="Ej: 80000" required />
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Tipo de Tarifa</label>
                            <select name="tipo_tarifa" value={formData.tipo_tarifa} onChange={handleChange} className="form-select form-select-lg bg-light border-0">
                                <option value="Por persona">Por Persona</option>
                                <option value="Por pareja">Por Pareja</option>
                                <option value="Por grupo">Por Grupo (Lancha completa)</option>
                            </select>
                        </div>

                        <div className="col-md-12 mt-4">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Descripción Completa del Recorrido</label>
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control bg-light border-0" rows="4" placeholder="Describe qué incluye el tour, el itinerario y las recomendaciones para el turista..." required></textarea>
                        </div>

                        <div className="col-12 mt-5">
                            <h6 className="fw-bold text-caribe-sobrio mb-3 pb-2 border-bottom border-light text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>
                                3. Contenido Multimedia
                            </h6>
                        </div>
                        
                        <div className="col-md-12">
                            <div className="p-4 border rounded-4 bg-light border-dashed text-center">
                                <label className="form-label fw-bold text-caribe-sobrio d-block mb-3 cursor-pointer">
                                    <i className="bi bi-cloud-arrow-up display-4 d-block mb-2"></i> 
                                    Subir Fotografía Representativa
                                </label>
                                <input 
                                    type="file" 
                                    id="archivo_imagen_exp" 
                                    ref={inputFileRef}
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    className="form-control d-none" 
                                />
                                <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => document.getElementById('archivo_imagen_exp').click()}>
                                    Explorar Archivos
                                </button>
                                {imagen && <p className="text-success mt-3 mb-0 fw-semibold"><i className="bi bi-check-lg me-1"></i> Archivo seleccionado: {imagen.name}</p>}
                            </div>
                        </div>

                        <div className="col-12 mt-5 text-end border-top pt-4">
                            <button type="button" className="btn btn-light me-3 rounded-pill px-4 fw-bold text-muted">Cancelar</button>
                            {/* Uso de la clase corporativa btn-caribe-sobrio */}
                            <button type="submit" className="btn btn-caribe-sobrio fw-bold px-5 py-2 shadow rounded-pill">
                                <i className="bi bi-send-fill me-2"></i> Publicar Experiencia
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};