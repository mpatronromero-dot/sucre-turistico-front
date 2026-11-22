import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig';

export const FormularioExperiencias = () => {
    const [experiencias, setExperiencias] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [experienciaIdEdit, setExperienciaIdEdit] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        municipio: 'Tolú',
        tipo: 'Náutico',
        costo_estimado: '',
        tipo_tarifa: 'Por persona',
        descripcion: ''
    });
    const [imagen, setImagen] = useState(null);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const inputFileRef = useRef(null);

    const cargarExperiencias = async () => {
        try {
            const res = await api.get('/experiencias');
            const lista = Array.isArray(res.data) ? res.data : (res.data.data || []);
            setExperiencias(lista);
        } catch (error) {
            console.error('Error al cargar experiencias:', error);
        }
    };

    useEffect(() => {
        cargarExperiencias();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setImagen(e.target.files[0]);

    const obtenerImagenUrl = (url) => {
        if (!url || typeof url !== 'string' || url.trim() === '') return null;
        const limpia = url.trim().replace(/\\/g, '/');
        if (limpia.startsWith('http://') || limpia.startsWith('https://')) return encodeURI(limpia);
        const rutaConBarra = limpia.startsWith('/') ? limpia : `/${limpia}`;
        return encodeURI(`http://localhost:3004${rutaConBarra}`);
    };

    const prepararEdicion = (exp) => {
        setModoEdicion(true);
        setExperienciaIdEdit(exp.id);
        setFormData({
            nombre: exp.nombre || '',
            municipio: exp.municipio || 'Tolú',
            tipo: exp.tipo || 'Náutico',
            costo_estimado: exp.costo_estimado || '',
            tipo_tarifa: exp.tipo_tarifa || 'Por persona',
            descripcion: exp.descripcion || ''
        });
        setImagen(null);
        if (inputFileRef.current) inputFileRef.current.value = "";

        document.getElementById('formulario-experiencias-scroll')?.scrollIntoView({ behavior: 'smooth' });
    };

    const cancelarEdicion = () => {
        setModoEdicion(false);
        setExperienciaIdEdit(null);
        setFormData({
            nombre: '',
            municipio: 'Tolú',
            tipo: 'Náutico',
            costo_estimado: '',
            tipo_tarifa: 'Por persona',
            descripcion: ''
        });
        setImagen(null);
        if (inputFileRef.current) inputFileRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });

        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('municipio', formData.municipio);
        data.append('tipo', formData.tipo);
        data.append('costo_estimado', formData.costo_estimado);
        data.append('tipo_tarifa', formData.tipo_tarifa);
        data.append('descripcion', formData.descripcion);
        if (imagen) data.append('imagen', imagen);

        try {
            if (modoEdicion) {
                await api.put(`/experiencias/${experienciaIdEdit}`, data);
                setMensaje({ texto: '¡Experiencia actualizada correctamente!', tipo: 'success' });
            } else {
                await api.post('/experiencias', data);
                setMensaje({ texto: '¡Experiencia registrada con éxito en el catálogo!', tipo: 'success' });
            }

            cancelarEdicion();
            cargarExperiencias();
        } catch (error) {
            console.error('Error al guardar experiencia:', error);
            setMensaje({ texto: 'Error al procesar la experiencia. Revisa el servidor.', tipo: 'danger' });
        }
    };

    const eliminarExperiencia = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta experiencia o tour del catálogo?")) {
            try {
                await api.delete(`/experiencias/${id}`);
                setMensaje({ texto: 'Experiencia eliminada del catálogo.', tipo: 'success' });
                cargarExperiencias();
            } catch (error) {
                console.error('Error al eliminar experiencia:', error);
                setMensaje({ texto: 'Error al eliminar la experiencia.', tipo: 'danger' });
            }
        }
    };

    return (
        <div className="d-flex flex-column gap-4">

            {/* SECCIÓN 1: TABLA DE EXPERIENCIAS REGISTRADAS */}
            <div className="card shadow-sm border-0 rounded-4 bg-white overflow-hidden">
                <div className="card-header bg-white border-bottom border-light py-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0 text-dark">
                        <i className="bi bi-list-check me-2 text-caribe-sobrio"></i> Catálogo General de Experiencias
                    </h5>
                </div>
                <div className="card-body p-0">
                    {experiencias.length === 0 ? (
                        <div className="p-5 text-center text-muted">
                            <i className="bi bi-compass display-4 d-block mb-3 opacity-50"></i>
                            <p className="mb-0">No hay experiencias registradas. Utiliza el formulario de abajo para crear la primera.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                    <tr>
                                        <th className="px-4 py-3 border-0">Foto</th>
                                        <th className="px-4 py-3 border-0">Experiencia / Tour</th>
                                        <th className="px-4 py-3 border-0">Ubicación</th>
                                        <th className="px-4 py-3 border-0 text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {experiencias.map(exp => {
                                        const foto = obtenerImagenUrl(exp.imagen_url);
                                        return (
                                            <tr key={exp.id}>
                                                <td className="px-4 py-3">
                                                    {foto ? (
                                                        <img src={foto} alt={exp.nombre} className="rounded object-fit-cover shadow-sm" style={{ width: '50px', height: '50px' }} />
                                                    ) : (
                                                        <div className="bg-light rounded text-center pt-2 text-muted" style={{ width: '50px', height: '50px' }}>
                                                            <i className="bi bi-image fs-5"></i>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="fw-bold text-dark">{exp.nombre}</div>
                                                    <small className="text-muted">
                                                        <span className="badge bg-light text-dark border me-2">{exp.tipo}</span>
                                                        $ {new Intl.NumberFormat('es-CO').format(exp.costo_estimado || 0)}
                                                    </small>
                                                </td>
                                                <td className="px-4 py-3 text-muted">{exp.municipio}</td>
                                                <td className="px-4 py-3 text-end">
                                                    <button onClick={() => prepararEdicion(exp)} className="btn btn-sm btn-light text-primary border me-2" title="Editar Experiencia">
                                                        <i className="bi bi-pencil-fill"></i>
                                                    </button>
                                                    <button onClick={() => eliminarExperiencia(exp.id)} className="btn btn-sm btn-light text-danger border" title="Eliminar Experiencia">
                                                        <i className="bi bi-trash-fill"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* SECCIÓN 2: FORMULARIO CREAR / EDITAR */}
            <div id="formulario-experiencias-scroll" className="card shadow border-0 mb-4 rounded-4 bg-white overflow-hidden">
                <div className="card-header bg-white border-bottom border-light py-4 px-4">
                    <h4 className={`fw-bold mb-0 ${modoEdicion ? 'text-warning' : 'text-caribe-sobrio'}`}>
                        <i className={`bi ${modoEdicion ? 'bi-pencil-square' : 'bi-compass'} me-2`}></i> 
                        {modoEdicion ? 'Editar Experiencia / Tour' : 'Registrar Nueva Experiencia'}
                    </h4>
                    <p className="text-muted small mb-0 mt-1">
                        {modoEdicion ? 'Actualiza la tarifa, ubicación o detalles de la actividad.' : 'Sube la información de tus tours y actividades turísticas al catálogo del Golfo.'}
                    </p>
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
                                <select name="municipio" value={formData.municipio} onChange={handleChange} className="form-select form-select-lg bg-light border-0" required>
                                    <option value="Tolú">Tolú</option>
                                    <option value="Coveñas">Coveñas</option>
                                    <option value="San Onofre">San Onofre</option>
                                    <option value="San Antero">San Antero</option>
                                    <option value="Toluviejo">Toluviejo</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold text-secondary small text-uppercase">Categoría</label>
                                <select name="tipo" value={formData.tipo} onChange={handleChange} className="form-select form-select-lg bg-light border-0" required>
                                    <option value="Náutico">Náutico</option>
                                    <option value="Ecológico">Ecológico</option>
                                    <option value="Cultural">Cultural</option>
                                </select>
                            </div>

                            <div className="col-12 mt-5">
                                <h6 className="fw-bold text-caribe-sobrio mb-3 pb-2 border-bottom border-light text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>
                                    2. Tarifas y Detalles
                                </h6>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold text-secondary small text-uppercase">Costo Estimado (COP)</label>
                                <input type="number" name="costo_estimado" value={formData.costo_estimado} onChange={handleChange} className="form-control form-control-lg bg-light border-0" placeholder="Ej. 120000" required />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold text-secondary small text-uppercase">Modalidad de Tarifa</label>
                                <select name="tipo_tarifa" value={formData.tipo_tarifa} onChange={handleChange} className="form-select form-select-lg bg-light border-0">
                                    <option value="Por persona">Por persona</option>
                                    <option value="Por pareja">Por pareja</option>
                                    <option value="Por grupo">Por grupo</option>
                                </select>
                            </div>

                            <div className="col-md-12 mt-4">
                                <div className="p-4 border rounded-4 bg-light border-dashed text-center">
                                    <label className="form-label fw-bold text-caribe-sobrio d-block mb-3 cursor-pointer">
                                        <i className="bi bi-cloud-arrow-up display-4 d-block mb-2"></i> 
                                        Subir Fotografía de la Actividad (.jpg, .png)
                                    </label>
                                    <input 
                                        type="file" 
                                        id="imagen_experiencia" 
                                        ref={inputFileRef}
                                        accept="image/*" 
                                        onChange={handleFileChange} 
                                        className="form-control d-none" 
                                    />
                                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => document.getElementById('imagen_experiencia').click()}>
                                        Explorar Archivos
                                    </button>
                                    {imagen && <p className="text-success mt-3 mb-0 fw-semibold"><i className="bi bi-check-lg me-1"></i> Archivo seleccionado: {imagen.name}</p>}
                                    {modoEdicion && !imagen && <p className="text-muted mt-3 mb-0 small fst-italic">Si no seleccionas foto, se mantendrá la imagen actual.</p>}
                                </div>
                            </div>

                            <div className="col-md-12 mt-3">
                                <label className="form-label fw-semibold text-secondary small text-uppercase">Descripción de la Experiencia</label>
                                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control bg-light border-0" rows="4" placeholder="Describe qué incluye el recorrido, horarios y recomendaciones..." required></textarea>
                            </div>

                            <div className="col-12 mt-5 text-end border-top pt-4">
                                <button type="button" onClick={cancelarEdicion} className="btn btn-light me-3 rounded-pill px-4 fw-bold text-muted">
                                    {modoEdicion ? 'Cancelar Edición' : 'Cancelar'}
                                </button>
                                <button type="submit" className={`btn fw-bold px-5 py-2 shadow rounded-pill ${modoEdicion ? 'btn-warning text-dark' : 'btn-caribe-sobrio'}`}>
                                    <i className={`bi ${modoEdicion ? 'bi-arrow-repeat' : 'bi-save'} me-2`}></i> 
                                    {modoEdicion ? 'Actualizar Experiencia' : 'Publicar Experiencia'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};