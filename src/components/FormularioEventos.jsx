import React, { useState } from 'react';
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
            
            setMensaje({ texto: '¡Evento cultural registrado con éxito!', tipo: 'success' });
            setFormData({ nombre: '', fecha_inicio: '', fecha_fin: '', municipio: 'Sincelejo', descripcion: '' });
            setImagen(null);
            document.getElementById("archivo_afiche").value = ""; 
        } catch (error) {
            console.error(error);
            setMensaje({ texto: 'Error al registrar el evento.', tipo: 'danger' });
        }
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-info text-white fw-bold py-3 fs-5">
                <i className="bi bi-calendar-event"></i> Registrar Nuevo Evento o Festividad
            </div>
            <div className="card-body p-4 bg-white">
                {mensaje.texto && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        <div className="col-12"><h6 className="fw-bold text-primary mb-3 border-bottom pb-2">Información del Evento</h6></div>
                        
                        <div className="col-md-12">
                            <label className="form-label fw-bold">Nombre del Evento / Festividad</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control" placeholder="Ej. Festival Nacional de la Gaita" required />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Fecha de Inicio</label>
                            <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} className="form-control" required />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Fecha de Finalización</label>
                            <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} className="form-control" />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label fw-bold">Municipio</label>
                            <select name="municipio" value={formData.municipio} onChange={handleChange} className="form-select">
                                <option value="Sincelejo">Sincelejo</option>
                                <option value="Tolú">Santiago de Tolú</option>
                                <option value="Coveñas">Coveñas</option>
                                <option value="San Onofre">San Onofre</option>
                                <option value="Ovejas">Ovejas</option>
                            </select>
                        </div>

                        <div className="col-12 mt-4"><h6 className="fw-bold text-primary mb-3 border-bottom pb-2">Afiche y Descripción</h6></div>
                        
                        <div className="col-md-12">
                            <label className="form-label fw-bold text-danger"><i className="bi bi-file-earmark-image"></i> Subir Afiche Promocional (.jpg, .png)</label>
                            <input type="file" id="archivo_afiche" accept="image/*" onChange={handleFileChange} className="form-control" />
                        </div>

                        <div className="col-md-12 mt-3">
                            <label className="form-label fw-bold">Descripción de la Festividad</label>
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control" rows="3" placeholder="Detalles, desfiles, conciertos, programación principal..." required></textarea>
                        </div>

                        <div className="col-12 mt-4 text-center">
                            <button type="submit" className="btn btn-info text-white fw-bold px-5 py-2 w-100 shadow-sm">Guardar Evento Cultural</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};