import React, { useState } from 'react';
import api from '../api/axiosConfig'; 

export const FormularioAlojamiento = () => {
    const [formData, setFormData] = useState({
        nombre: '', municipio: '', tipo: '', descripcion: ''
    });
    const [imagen, setImagen] = useState(null);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setImagen(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('municipio', formData.municipio);
        data.append('tipo', formData.tipo);
        data.append('descripcion', formData.descripcion);
        if (imagen) data.append('imagen', imagen);

        const usuarioId = localStorage.getItem('usuario_id');
        if (usuarioId) {
            data.append('usuario_id', usuarioId);
        } else {
            setMensaje({ texto: 'Error: No hay sesión activa de usuario.', tipo: 'danger' });
            return;
        }

        try {
            await api.post('/alojamientos', data);
            setMensaje({ texto: '¡Alojamiento registrado con éxito y asignado a tu cuenta!', tipo: 'success' });
            setFormData({ nombre: '', municipio: '', tipo: '', descripcion: '' });
            setImagen(null);
            document.getElementById("imagen_alojamiento").value = ""; 
        } catch (error) {
            console.error(error);
            setMensaje({ texto: 'Error al registrar el alojamiento.', tipo: 'danger' });
        }
    };

    return (
        <div className="card shadow border-0 mb-4 rounded-4 bg-white overflow-hidden">
            {/* Encabezado sin el azul quemado, más limpio y elegante */}
            <div className="card-header bg-white border-bottom border-light py-4 px-4">
                <h4 className="fw-bold mb-0 text-caribe-sobrio">
                    <i className="bi bi-building me-2"></i> Registrar Nuevo Alojamiento
                </h4>
                <p className="text-muted small mb-0 mt-1">Completa la información para publicar tu establecimiento en el catálogo.</p>
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
                        <div className="col-md-12">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Nombre del Hotel/Hostal</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control form-control-lg bg-light border-0" placeholder="Ej: Hotel Las Gaviotas" required />
                        </div>
                        
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Municipio</label>
                            <select name="municipio" value={formData.municipio} onChange={handleChange} className="form-select form-select-lg bg-light border-0" required>
                                <option value="">Selecciona uno...</option>
                                <option value="Coveñas">Coveñas</option>
                                <option value="Santiago de Tolú">Santiago de Tolú</option>
                                <option value="San Onofre">San Onofre</option>
                                <option value="Sincelejo">Sincelejo</option>
                            </select>
                        </div>
                        
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Tipo de Alojamiento</label>
                            <select name="tipo" value={formData.tipo} onChange={handleChange} className="form-select form-select-lg bg-light border-0" required>
                                <option value="">Selecciona uno...</option>
                                <option value="Hotel">Hotel</option>
                                <option value="Hostal">Hostal</option>
                                <option value="Cabaña">Cabaña</option>
                                <option value="Resort">Resort</option>
                            </select>
                        </div>

                        <div className="col-md-12 mt-4">
                            <div className="p-4 border rounded-4 bg-light border-dashed text-center">
                                <label className="form-label fw-bold text-caribe-sobrio d-block mb-3 cursor-pointer">
                                    <i className="bi bi-cloud-arrow-up display-4 d-block mb-2"></i> 
                                    Subir Fotografía Principal (Portada)
                                </label>
                                <input type="file" id="imagen_alojamiento" accept="image/*" onChange={handleFileChange} className="form-control d-none" />
                                <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={() => document.getElementById('imagen_alojamiento').click()}>
                                    Explorar Archivos
                                </button>
                                {imagen && <p className="text-success mt-3 mb-0 fw-semibold"><i className="bi bi-check-lg me-1"></i> Archivo seleccionado: {imagen.name}</p>}
                            </div>
                        </div>

                        <div className="col-md-12 mt-3">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">Descripción general</label>
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control bg-light border-0" rows="5" placeholder="Describe los atractivos, la ubicación y qué hace especial a tu alojamiento..." required></textarea>
                        </div>

                        <div className="col-12 mt-5 text-end border-top pt-4">
                            <button type="button" className="btn btn-light me-3 rounded-pill px-4 fw-bold text-muted">Cancelar</button>
                            {/* Uso de la clase btn-caribe-sobrio */}
                            <button type="submit" className="btn btn-caribe-sobrio fw-bold px-5 py-2 shadow">
                                <i className="bi bi-save me-2"></i> Registrar Alojamiento
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};