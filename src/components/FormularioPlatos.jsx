import React, { useState } from 'react';
import axios from 'axios';

export const FormularioPlatos = () => {
    const [formData, setFormData] = useState({
        restaurante_id: '', nombre_plato: '', precio: '', descripcion: ''
    });
    const [imagen, setImagen] = useState(null);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setImagen(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('restaurante_id', formData.restaurante_id);
        data.append('nombre_plato', formData.nombre_plato);
        data.append('precio', formData.precio);
        data.append('descripcion', formData.descripcion);
        if (imagen) data.append('imagen', imagen);

        try {
            // Asegúrate de que la ruta y el puerto coincidan con tu backend de gastronomía para guardar platos
            await axios.post('http://localhost:3003/api/platos', data);
            
            setMensaje({ texto: '¡Plato registrado con éxito!', tipo: 'success' });
            setFormData({ restaurante_id: '', nombre_plato: '', precio: '', descripcion: '' });
            setImagen(null);
            document.getElementById("imagen_plato").value = ""; 
        } catch (error) {
            console.error(error);
            setMensaje({ texto: 'Error al registrar el plato.', tipo: 'danger' });
        }
    };

    return (
        <div className="card shadow-sm border-0 mb-4 border-top border-success border-4">
            <div className="card-header bg-white text-success fw-bold py-3 fs-5 border-bottom-0">
                <i className="bi bi-egg-fried me-2"></i> Agregar Plato al Menú
            </div>
            <div className="card-body p-4 bg-white pt-0">
                {mensaje.texto && <div className={`alert alert-${mensaje.tipo} mt-3`}>{mensaje.texto}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="row g-4 mt-1">
                        <div className="col-md-12">
                            <label className="form-label fw-bold text-dark">¿A qué restaurante pertenece este plato?</label>
                            <select name="restaurante_id" value={formData.restaurante_id} onChange={handleChange} className="form-select bg-light" required>
                                <option value="">Selecciona un restaurante...</option>
                                {/* Aquí deberías cargar dinámicamente los restaurantes desde tu base de datos */}
                                <option value="1">Restaurante 1 (Ejemplo)</option> 
                                <option value="2">Restaurante 2 (Ejemplo)</option>
                            </select>
                        </div>
                        <div className="col-md-8">
                            <label className="form-label fw-bold text-dark">Nombre del Plato</label>
                            <input type="text" name="nombre_plato" value={formData.nombre_plato} onChange={handleChange} className="form-control bg-light" placeholder="Ej. Mote de Queso Tradicional" required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold text-dark">Precio (COP)</label>
                            <input type="number" name="precio" value={formData.precio} onChange={handleChange} className="form-control bg-light" placeholder="Ej. 25000" required />
                        </div>

                        <div className="col-md-12 mt-3">
                            <label className="form-label fw-bold text-dark">Ingredientes / Descripción</label>
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control bg-light" rows="2" placeholder="Queso costeño, ñame, suero, ajo..." required></textarea>
                        </div>

                        {/* Nuevo campo de subida de archivo para el plato */}
                        <div className="col-md-12 mt-4">
                            <label className="form-label fw-bold text-success"><i className="bi bi-image me-2"></i> Subir Foto del Plato (.jpg, .png)</label>
                            <input type="file" id="imagen_plato" accept="image/*" onChange={handleFileChange} className="form-control bg-light border-success border-opacity-25" />
                        </div>

                        <div className="col-12 mt-4">
                            <button type="submit" className="btn btn-success fw-bold px-5 py-2 w-100 shadow-sm text-white">Guardar Plato</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};