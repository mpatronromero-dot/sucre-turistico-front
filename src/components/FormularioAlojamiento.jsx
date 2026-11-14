import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig'; 

export const FormularioAlojamiento = () => {
    const [alojamientos, setAlojamientos] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [alojamientoIdEdit, setAlojamientoIdEdit] = useState(null);
    
    const [formData, setFormData] = useState({
        nombre: '', municipio: '', tipo: '', descripcion: ''
    });
    const [imagen, setImagen] = useState(null);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    
    const inputImagenRef = useRef(null);

    // 1. Cargar la lista de alojamientos con lógica de ROLES
    const cargarMisAlojamientos = async () => {
        const usuarioId = localStorage.getItem('usuario_id');
        const rolUsuario = localStorage.getItem('rol_usuario'); // Detectamos si eres tú (Modo Dios)
        if (!usuarioId) return;

        try {
            // Si es superadmin, pedimos todo. Si no, solo los suyos.
            const url = rolUsuario === 'superadmin' 
                ? '/alojamientos' 
                : `/alojamientos/mis-alojamientos/${usuarioId}`;
                
            const res = await api.get(url);
            const lista = Array.isArray(res.data) ? res.data : (res.data.data || res.data.alojamientos || []);
            setAlojamientos(lista);
            
        } catch (error) {
            console.error("Error al cargar alojamientos:", error);
        }
    };

    useEffect(() => {
        cargarMisAlojamientos();
    }, []);

    // 2. Manejadores de inputs
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setImagen(e.target.files[0]);

    // 3. Preparar Modo Edición
    const prepararEdicion = (hotel) => {
        setModoEdicion(true);
        setAlojamientoIdEdit(hotel.id);
        setFormData({
            nombre: hotel.nombre || '',
            municipio: hotel.municipio || '',
            tipo: hotel.tipo || '',
            descripcion: hotel.descripcion || ''
        });
        setImagen(null);
        if (inputImagenRef.current) inputImagenRef.current.value = "";
        
        // Hacer scroll suave hacia el formulario
        document.getElementById('formulario-alojamiento-scroll').scrollIntoView({ behavior: 'smooth' });
    };

    const cancelarEdicion = () => {
        setModoEdicion(false);
        setAlojamientoIdEdit(null);
        setFormData({ nombre: '', municipio: '', tipo: '', descripcion: '' });
        setImagen(null);
        if (inputImagenRef.current) inputImagenRef.current.value = "";
    };

    // 4. Guardar o Actualizar
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });
        
        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('municipio', formData.municipio);
        data.append('tipo', formData.tipo);
        data.append('descripcion', formData.descripcion);
        if (imagen) data.append('imagen', imagen);

        const usuarioId = localStorage.getItem('usuario_id');
        if (!usuarioId) {
            setMensaje({ texto: 'Error: No hay sesión activa de usuario.', tipo: 'danger' });
            return;
        }
        data.append('usuario_id', usuarioId);

        try {
            if (modoEdicion) {
                // Petición PUT para actualizar
                await api.put(`/alojamientos/${alojamientoIdEdit}`, data);
                setMensaje({ texto: '¡Alojamiento actualizado correctamente!', tipo: 'success' });
            } else {
                // Petición POST para crear
                await api.post('/alojamientos', data);
                setMensaje({ texto: '¡Alojamiento registrado con éxito en el catálogo!', tipo: 'success' });
            }
            
            cancelarEdicion();
            cargarMisAlojamientos();
            
            // ¡MAGIA! Avisamos a toda la app que los hoteles cambiaron para que el Gestor de Habitaciones se actualice solo
            window.dispatchEvent(new CustomEvent('alojamientosActualizados'));
            
        } catch (error) {
            console.error(error);
            setMensaje({ texto: 'Error al procesar la solicitud del alojamiento.', tipo: 'danger' });
        }
    };

    // 5. Eliminar Alojamiento
    const eliminarAlojamiento = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este alojamiento? Se borrarán también todas sus habitaciones de forma permanente.")) {
            try {
                await api.delete(`/alojamientos/${id}`);
                setMensaje({ texto: 'Alojamiento eliminado del catálogo.', tipo: 'success' });
                cargarMisAlojamientos();
                window.dispatchEvent(new CustomEvent('alojamientosActualizados'));
            } catch (error) {
                console.error("Error al eliminar", error);
                setMensaje({ texto: 'Error al eliminar el alojamiento.', tipo: 'danger' });
            }
        }
    };

    return (
        <div className="d-flex flex-column gap-4">
            
            {/* SECCIÓN 1: TABLA DE MIS ALOJAMIENTOS */}
            <div className="card shadow-sm border-0 rounded-4 bg-white overflow-hidden">
                <div className="card-header bg-white border-bottom border-light py-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0 text-dark">
                        <i className="bi bi-list-check me-2 text-caribe-sobrio"></i> {localStorage.getItem('rol_usuario') === 'superadmin' ? 'Catálogo General de Establecimientos' : 'Mis Establecimientos'}
                    </h5>
                </div>
                <div className="card-body p-0">
                    {alojamientos.length === 0 ? (
                        <div className="p-5 text-center text-muted">
                            <i className="bi bi-building-x display-4 d-block mb-3 opacity-50"></i>
                            <p className="mb-0">No hay alojamientos registrados. Utiliza el formulario de abajo para crear el primero.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                    <tr>
                                        <th className="px-4 py-3 border-0">Foto</th>
                                        <th className="px-4 py-3 border-0">Establecimiento</th>
                                        <th className="px-4 py-3 border-0">Ubicación</th>
                                        <th className="px-4 py-3 border-0 text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alojamientos.map(hotel => (
                                        <tr key={hotel.id}>
                                            <td className="px-4 py-3">
                                                {hotel.imagen_url ? (
                                                    <img src={hotel.imagen_url} alt="Hotel" className="rounded object-fit-cover shadow-sm" style={{ width: '50px', height: '50px' }} />
                                                ) : (
                                                    <div className="bg-light rounded text-center pt-2 text-muted" style={{ width: '50px', height: '50px' }}>
                                                        <i className="bi bi-image fs-5"></i>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="fw-bold text-dark">{hotel.nombre}</div>
                                                <small className="text-muted"><span className="badge bg-light text-dark border">{hotel.tipo}</span></small>
                                            </td>
                                            <td className="px-4 py-3 text-muted">{hotel.municipio}</td>
                                            <td className="px-4 py-3 text-end">
                                                <button onClick={() => prepararEdicion(hotel)} className="btn btn-sm btn-light text-primary border me-2" title="Editar Información">
                                                    <i className="bi bi-pencil-fill"></i>
                                                </button>
                                                <button onClick={() => eliminarAlojamiento(hotel.id)} className="btn btn-sm btn-light text-danger border" title="Eliminar Establecimiento">
                                                    <i className="bi bi-trash-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* SECCIÓN 2: FORMULARIO CREAR / EDITAR */}
            <div id="formulario-alojamiento-scroll" className="card shadow border-0 rounded-4 bg-white overflow-hidden">
                <div className="card-header bg-white border-bottom border-light py-4 px-4">
                    <h4 className={`fw-bold mb-0 ${modoEdicion ? 'text-warning' : 'text-caribe-sobrio'}`}>
                        <i className={`bi ${modoEdicion ? 'bi-pencil-square' : 'bi-building-add'} me-2`}></i> 
                        {modoEdicion ? 'Editar Información del Alojamiento' : 'Registrar Nuevo Alojamiento'}
                    </h4>
                    <p className="text-muted small mb-0 mt-1">
                        {modoEdicion ? 'Modifica los datos del establecimiento y guarda los cambios.' : 'Completa la información para publicar el establecimiento en el catálogo.'}
                    </p>
                </div>
                
                <div className="card-body p-4 p-md-5">
                    {mensaje.texto && (
                        <div className={`alert alert-${mensaje.tipo} rounded-3 border-0 shadow-sm d-flex align-items-center mb-4`}>
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
                                    <input type="file" id="imagen_alojamiento" ref={inputImagenRef} accept="image/*" onChange={handleFileChange} className="form-control d-none" />
                                    <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={() => document.getElementById('imagen_alojamiento').click()}>
                                        Explorar Archivos
                                    </button>
                                    {imagen && <p className="text-success mt-3 mb-0 fw-semibold"><i className="bi bi-check-lg me-1"></i> Archivo seleccionado: {imagen.name}</p>}
                                    {modoEdicion && !imagen && <p className="text-muted mt-3 mb-0 small fst-italic">Si no seleccionas foto, se mantendrá la imagen actual del establecimiento.</p>}
                                </div>
                            </div>

                            <div className="col-md-12 mt-3">
                                <label className="form-label fw-semibold text-secondary small text-uppercase">Descripción general</label>
                                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control bg-light border-0" rows="4" placeholder="Describe los atractivos, la ubicación y qué hace especial a tu alojamiento..." required></textarea>
                            </div>

                            <div className="col-12 mt-4 text-end border-top pt-4">
                                {modoEdicion && (
                                    <button type="button" onClick={cancelarEdicion} className="btn btn-light me-3 rounded-pill px-4 fw-bold text-muted shadow-sm">
                                        Cancelar Edición
                                    </button>
                                )}
                                <button type="submit" className={`btn fw-bold px-5 py-2 shadow-sm rounded-pill ${modoEdicion ? 'btn-warning text-dark' : 'btn-caribe-sobrio'}`}>
                                    <i className={`bi ${modoEdicion ? 'bi-arrow-repeat' : 'bi-save'} me-2`}></i> 
                                    {modoEdicion ? 'Actualizar Información' : 'Registrar Alojamiento'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};