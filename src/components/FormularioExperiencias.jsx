import React, { useState } from 'react';
import axios from 'axios';

export const FormularioExperiencias = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        municipio: 'Tolú',
        tipo: 'Náutico',
        descripcion: '',
        costo_estimado: '',
        tipo_tarifa: 'Por persona',
        imagen_url: '',
        video_url: ''
    });
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Asegúrate de que el puerto (3004) coincida con tu backend
            await axios.post('http://localhost:3004/api/experiencias', formData);
            setMensaje({ texto: '¡Experiencia registrada con éxito!', tipo: 'success' });
            setFormData({ 
                nombre: '', municipio: 'Tolú', tipo: 'Náutico', descripcion: '', 
                costo_estimado: '', tipo_tarifa: 'Por persona', imagen_url: '', video_url: '' 
            });
        } catch (error) {
            console.error(error);
            setMensaje({ texto: 'Error al registrar la experiencia.', tipo: 'danger' });
        }
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-warning text-dark fw-bold py-3 fs-5">
                <i className="bi bi-compass"></i> Registrar Nueva Experiencia Turística
            </div>
            <div className="card-body p-4 bg-white">
                {mensaje.texto && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        
                        {/* 1. Información Básica */}
                        <div className="col-12">
                            <h6 className="fw-bold text-primary mb-3 border-bottom pb-2">Información Básica</h6>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label fw-bold text-dark">Nombre de la Experiencia</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control bg-light" placeholder="Ej. Paseo en Lancha Islas de San Bernardo" required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-dark">Municipio / Ubicación</label>
                            <select name="municipio" value={formData.municipio} onChange={handleChange} className="form-select bg-light" required>
                                <option value="Coveñas">Coveñas</option>
                                <option value="Tolú">Tolú</option>
                                <option value="San Onofre">San Onofre</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-dark">Categoría</label>
                            <select name="tipo" value={formData.tipo} onChange={handleChange} className="form-select bg-light" required>
                                <option value="Náutico">Náutico (Bote, Playa, Buceo)</option>
                                <option value="Ecológico">Ecológico (Naturaleza, Senderismo)</option>
                                <option value="Cultural">Cultural / Histórico</option>
                            </select>
                        </div>

                        {/* 2. Precios y Tarifas */}
                        <div className="col-12 mt-4">
                            <h6 className="fw-bold text-primary mb-3 border-bottom pb-2">Tarifas y Costos</h6>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-dark">Costo Estimado (COP)</label>
                            <input type="number" name="costo_estimado" value={formData.costo_estimado} onChange={handleChange} className="form-control bg-light" placeholder="Ej. 120000" required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-dark">Tipo de Tarifa</label>
                            <select name="tipo_tarifa" value={formData.tipo_tarifa} onChange={handleChange} className="form-select bg-light" required>
                                <option value="Por persona">Por Persona</option>
                                <option value="Por pareja">Por Pareja</option>
                                <option value="Por grupo">Por Grupo / Lancha completa</option>
                            </select>
                        </div>

                        {/* 3. Multimedia y Detalles */}
                        <div className="col-12 mt-4">
                            <h6 className="fw-bold text-primary mb-3 border-bottom pb-2">Multimedia y Descripción</h6>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-dark">Enlace a Fotografía (URL)</label>
                            <input type="url" name="imagen_url" value={formData.imagen_url} onChange={handleChange} className="form-control bg-light" placeholder="https://..." />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-dark">Enlace a Video / YouTube (URL)</label>
                            <input type="url" name="video_url" value={formData.video_url} onChange={handleChange} className="form-control bg-light" placeholder="https://youtube.com/..." />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label fw-bold text-dark">Descripción Completa</label>
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control bg-light" rows="4" placeholder="Describe qué incluye la experiencia, horarios de salida, recomendaciones..." required></textarea>
                        </div>

                        {/* Botón de Envío */}
                        <div className="col-12 mt-4 text-center">
                            <button type="submit" className="btn btn-warning fw-bold px-5 py-2 w-100 shadow-sm">
                                <i className="bi bi-save me-2"></i> Guardar Experiencia
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
};