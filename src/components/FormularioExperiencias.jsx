import React, { useState } from 'react';
import axios from 'axios';

export const FormularioExperiencias = () => {
    // 1. Estado inicial sin el video
    const [formData, setFormData] = useState({
        nombre: '', municipio: 'Tolú', tipo: 'Náutico', descripcion: '', 
        costo_estimado: '', tipo_tarifa: 'Por persona'
    });
    const [imagen, setImagen] = useState(null);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImagen(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
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
            await axios.post('http://localhost:3004/api/experiencias', data);
            
            setMensaje({ texto: '¡Experiencia registrada con éxito!', tipo: 'success' });
            
            // Limpiamos todo al terminar
            setFormData({ nombre: '', municipio: 'Tolú', tipo: 'Náutico', descripcion: '', costo_estimado: '', tipo_tarifa: 'Por persona' });
            setImagen(null);
            document.getElementById("archivo_imagen").value = ""; 
            
        } catch (error) {
            console.error(error);
            setMensaje({ texto: 'Error al registrar la experiencia.', tipo: 'danger' });
        }
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-warning text-dark fw-bold py-3 fs-5">
                <i className="bi bi-compass"></i> Registrar Nueva Experiencia
            </div>
            <div className="card-body p-4 bg-white">
                {mensaje.texto && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        <div className="col-12"><h6 className="fw-bold text-primary mb-3 border-bottom pb-2">Información Básica</h6></div>
                        <div className="col-md-12">
                            <label className="form-label fw-bold">Nombre</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control" required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Municipio</label>
                            <select name="municipio" value={formData.municipio} onChange={handleChange} className="form-select">
                                <option value="Coveñas">Coveñas</option><option value="Tolú">Tolú</option><option value="San Onofre">San Onofre</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Categoría</label>
                            <select name="tipo" value={formData.tipo} onChange={handleChange} className="form-select">
                                <option value="Náutico">Náutico</option><option value="Ecológico">Ecológico</option><option value="Cultural">Cultural</option>
                            </select>
                        </div>

                        <div className="col-12 mt-4"><h6 className="fw-bold text-primary mb-3 border-bottom pb-2">Tarifas y Costos</h6></div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Costo Estimado (COP)</label>
                            <input type="number" name="costo_estimado" value={formData.costo_estimado} onChange={handleChange} className="form-control" required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Tipo de Tarifa</label>
                            <select name="tipo_tarifa" value={formData.tipo_tarifa} onChange={handleChange} className="form-select">
                                <option value="Por persona">Por Persona</option><option value="Por pareja">Por Pareja</option><option value="Por grupo">Por Grupo</option>
                            </select>
                        </div>

                        <div className="col-12 mt-4"><h6 className="fw-bold text-primary mb-3 border-bottom pb-2">Fotografía y Descripción</h6></div>
                        
                        {/* La caja de la foto ahora ocupa todo el ancho visualmente */}
                        <div className="col-md-12">
                            <label className="form-label fw-bold text-danger"><i className="bi bi-file-earmark-image"></i> Subir Fotografía (.jpg, .png)</label>
                            <input type="file" id="archivo_imagen" accept="image/*" onChange={handleFileChange} className="form-control" />
                        </div>
                        
                        <div className="col-md-12 mt-3">
                            <label className="form-label fw-bold">Descripción Completa</label>
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control" rows="3" required></textarea>
                        </div>

                        <div className="col-12 mt-4 text-center">
                            <button type="submit" className="btn btn-warning fw-bold px-5 py-2 w-100 shadow-sm">Guardar Experiencia</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};