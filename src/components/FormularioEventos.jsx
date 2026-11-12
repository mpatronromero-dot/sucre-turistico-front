import React, { useState, useRef } from 'react';
import axios from 'axios';

export const FormularioEventos = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        fecha_inicio: '',
        fecha_fin: '',
        municipio: 'Sincelejo',
        descripcion: ''
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
        data.append('fecha_inicio', formData.fecha_inicio);
        data.append('fecha_fin', formData.fecha_fin);
        data.append('municipio', formData.municipio);
        data.append('descripcion', formData.descripcion);
        
        if (imagen) {
            data.append('imagen', imagen); 
        }

        try {
            // El microservicio de eventos corre en el puerto 3006
            await axios.post('http://localhost:3006/api/eventos', data);
            
            setMensaje({ texto: '¡Evento cultural registrado y publicado con éxito!', tipo: 'success' });
            
            // Limpiamos el formulario
            setFormData({ nombre: '', fecha_inicio: '', fecha_fin: '', municipio: 'Sincelejo', descripcion: '' });
            setImagen(null);
            
            if (inputFileRef.current) {
                inputFileRef.current.value = "";
            }
        } catch (error) {
            console.error(error);
            setMensaje({ texto: 'Error al registrar el evento. Verifica la conexión con el servidor.', tipo: 'danger' });
        }
    };

    return (
        <div className="card shadow border-0 mb-4 rounded-4 bg-white overflow-hidden">
            
            {/* Encabezado limpio y corporativo */}
            <div className="card-header bg-white border-bottom border-light py-4 px-4">
                <h4 className="fw-bold mb-0 text-caribe-sobrio">
                    <i className="bi bi-calendar-event me-2"></i> Registrar Nuevo Evento o Festividad
                </h4>
                <p className="text-muted small mb-0 mt-1">Sube la información de las fiestas y eventos culturales que enriquecen al Golfo.</p>
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
                                1. Información del Evento
                            </h6>
                        </div>
                        
                        <div className="col-md-12">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Nombre del Evento / Festividad</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control form-control-lg bg-light border-0" placeholder="Ej. Festival Nacional de la Gaita" required />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Fecha de Inicio</label>
                            <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} className="form-control form-control-lg bg-light border-0 text-muted" required />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Fecha de Finalización</label>
                            <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} className="form-control form-control-lg bg-light border-0 text-muted" />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Municipio</label>
                            <select name="municipio" value={formData.municipio} onChange={handleChange} className="form-select form-select-lg bg-light border-0">
                                <option value="Sincelejo">Sincelejo</option>
                                <option value="Tolú">Santiago de Tolú</option>
                                <option value="Coveñas">Coveñas</option>
                                <option value="San Onofre">San Onofre</option>
                            </select>
                        </div>

                        <div className="col-12 mt-5">
                            <h6 className="fw-bold text-caribe-sobrio mb-3 pb-2 border-bottom border-light text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>
                                2. Promoción y Detalles
                            </h6>
                        </div>
                        
                        <div className="col-md-12">
                            <div className="p-4 border rounded-4 bg-light border-dashed text-center">
                                <label className="form-label fw-bold text-caribe-sobrio d-block mb-3 cursor-pointer">
                                    <i className="bi bi-file-earmark-image display-4 d-block mb-2"></i> 
                                    Subir Afiche Promocional (.jpg, .png)
                                </label>
                                <input 
                                    type="file" 
                                    id="archivo_afiche_evento" 
                                    ref={inputFileRef}
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    className="form-control d-none" 
                                />
                                <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => document.getElementById('archivo_afiche_evento').click()}>
                                    Explorar Archivos
                                </button>
                                {imagen && <p className="text-success mt-3 mb-0 fw-semibold"><i className="bi bi-check-lg me-1"></i> Archivo seleccionado: {imagen.name}</p>}
                            </div>
                        </div>

                        <div className="col-md-12 mt-3">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Descripción de la Festividad</label>
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control bg-light border-0" rows="4" placeholder="Detalles, desfiles, conciertos, programación principal y por qué no deben perdérselo..." required></textarea>
                        </div>

                        <div className="col-12 mt-5 text-end border-top pt-4">
                            <button type="button" className="btn btn-light me-3 rounded-pill px-4 fw-bold text-muted">Cancelar</button>
                            <button type="submit" className="btn btn-caribe-sobrio fw-bold px-5 py-2 shadow rounded-pill">
                                <i className="bi bi-calendar-check me-2"></i> Publicar Evento Cultural
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};