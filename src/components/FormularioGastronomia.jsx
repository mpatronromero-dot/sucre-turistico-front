import React, { useState } from 'react';
import axios from 'axios';

export const FormularioGastronomia = () => {
    const [formData, setFormData] = useState({
        nombre: '', municipio: '', tipo_comida: '', direccion: '', descripcion: ''
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
        data.append('tipo_comida', formData.tipo_comida);
        data.append('direccion', formData.direccion);
        data.append('descripcion', formData.descripcion);
        if (imagen) data.append('imagen', imagen);

        try {
            // El microservicio de gastronomía suele correr en el puerto 3003
            await axios.post('http://localhost:3003/api/gastronomia', data);
            
            setMensaje({ texto: '¡Restaurante registrado con éxito!', tipo: 'success' });
            setFormData({ nombre: '', municipio: '', tipo_comida: '', direccion: '', descripcion: '' });
            setImagen(null);
            document.getElementById("imagen_restaurante").value = ""; 
        } catch (error) {
            console.error(error);
            setMensaje({ texto: 'Error al registrar el restaurante.', tipo: 'danger' });
        }
    };

    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-primary text-white fw-bold py-3 fs-5">
                <i className="bi bi-shop"></i> Registrar Nuevo Restaurante
            </div>
            <div className="card-body p-4 bg-white">
                {mensaje.texto && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
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
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Tipo de Comida</label>
                            <input type="text" name="tipo_comida" value={formData.tipo_comida} onChange={handleChange} className="form-control" placeholder="Ej. Típica, Mariscos..." required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Dirección</label>
                            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="form-control" required />
                        </div>

                        {/* Campo de subida de archivo */}
                        <div className="col-md-12 mt-4">
                            <label className="form-label fw-bold text-primary"><i className="bi bi-file-earmark-image"></i> Subir Imagen de Portada (.jpg, .png)</label>
                            <input type="file" id="imagen_restaurante" accept="image/*" onChange={handleFileChange} className="form-control" />
                        </div>

                        <div className="col-md-12 mt-3">
                            <label className="form-label fw-bold">Descripción del Restaurante</label>
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control" rows="3" required></textarea>
                        </div>

                        <div className="col-12 mt-4">
                            <button type="submit" className="btn btn-primary fw-bold px-5 py-2 w-100 shadow-sm">Registrar Restaurante</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};