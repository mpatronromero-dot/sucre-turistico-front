import React, { useState } from 'react';
import axios from 'axios';

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

        try {
            // El microservicio de alojamientos suele correr en el puerto 3002
            await axios.post('http://localhost:3002/api/alojamientos', data);
            
            setMensaje({ texto: '¡Alojamiento registrado con éxito!', tipo: 'success' });
            setFormData({ nombre: '', municipio: '', tipo: '', descripcion: '' });
            setImagen(null);
            document.getElementById("imagen_alojamiento").value = ""; 
        } catch (error) {
            console.error(error);
            setMensaje({ texto: 'Error al registrar el alojamiento.', tipo: 'danger' });
        }
    };

    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-primary text-white fw-bold py-3 fs-5">
                <i className="bi bi-building"></i> Registrar Nuevo Alojamiento
            </div>
            <div className="card-body p-4 bg-white">
                {mensaje.texto && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        <div className="col-md-12">
                            <label className="form-label fw-bold">Nombre del Hotel/Hostal</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control" required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Municipio</label>
                            <select name="municipio" value={formData.municipio} onChange={handleChange} className="form-select" required>
                                <option value="">Selecciona uno...</option>
                                <option value="Coveñas">Coveñas</option>
                                <option value="Tolú">Tolú</option>
                                <option value="San Onofre">San Onofre</option>
                                <option value="Sincelejo">Sincelejo</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Tipo de Alojamiento</label>
                            <select name="tipo" value={formData.tipo} onChange={handleChange} className="form-select" required>
                                <option value="">Selecciona uno...</option>
                                <option value="Hotel">Hotel</option>
                                <option value="Hostal">Hostal</option>
                                <option value="Cabaña">Cabaña</option>
                                <option value="Resort">Resort</option>
                            </select>
                        </div>

                        {/* Campo de subida de archivo */}
                        <div className="col-md-12 mt-4">
                            <label className="form-label fw-bold text-primary"><i className="bi bi-file-earmark-image"></i> Subir Imagen Principal (Portada)</label>
                            <input type="file" id="imagen_alojamiento" accept="image/*" onChange={handleFileChange} className="form-control" />
                        </div>

                        <div className="col-md-12 mt-3">
                            <label className="form-label fw-bold">Descripción general</label>
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control" rows="4" required></textarea>
                        </div>

                        <div className="col-12 mt-4">
                            <button type="submit" className="btn btn-primary fw-bold px-5 py-2 w-100 shadow-sm">Registrar Alojamiento</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};