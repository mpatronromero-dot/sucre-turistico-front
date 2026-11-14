import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; 

export const GestionHabitaciones = () => {
    const [alojamientos, setAlojamientos] = useState([]);
    const [hotelSeleccionado, setHotelSeleccionado] = useState('');
    const [habitaciones, setHabitaciones] = useState([]);
    
    // Estado para el formulario (Crear y Editar)
    const [modoEdicion, setModoEdicion] = useState(false);
    const [habitacionIdEdit, setHabitacionIdEdit] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', precio: '', descripcion: '' });
    const [imagen, setImagen] = useState(null);

    // 1. Cargar la lista de alojamientos con lógica de ROLES
    const cargarMisHoteles = async () => {
        try {
            const usuarioId = localStorage.getItem('usuario_id');
            const rolUsuario = localStorage.getItem('rol_usuario'); // Detectamos si eres tú (Modo Dios)
            if (!usuarioId) return;
            
            const url = rolUsuario === 'superadmin' 
                ? '/alojamientos' 
                : `/alojamientos/mis-alojamientos/${usuarioId}`;
                
            const res = await api.get(url);
            const listaHoteles = Array.isArray(res.data) ? res.data : (res.data.data || res.data.alojamientos || []);
            setAlojamientos(listaHoteles);
            
            // Si el hotel seleccionado ya no existe (porque se eliminó), limpiar selección
            if (hotelSeleccionado && !listaHoteles.some(h => h.id.toString() === hotelSeleccionado)) {
                setHotelSeleccionado('');
                setHabitaciones([]);
            }
        } catch (err) {
            console.error("Error cargando los hoteles del usuario", err);
        }
    };

    useEffect(() => {
        cargarMisHoteles();

        // ESCUCHADOR DE EVENTOS: Cuando el FormularioAlojamiento crea/elimina, este componente se actualiza automáticamente.
        window.addEventListener('alojamientosActualizados', cargarMisHoteles);
        return () => window.removeEventListener('alojamientosActualizados', cargarMisHoteles);
    }, [hotelSeleccionado]);

    // 2. Cargar habitaciones cuando se selecciona un hotel
    useEffect(() => {
        if (hotelSeleccionado) {
            cargarHabitaciones(hotelSeleccionado);
        } else {
            setHabitaciones([]);
        }
    }, [hotelSeleccionado]);

    const cargarHabitaciones = async (idAlojamiento) => {
        try {
            const res = await api.get(`/alojamientos/${idAlojamiento}/habitaciones`);
            setHabitaciones(Array.isArray(res.data) ? res.data : (res.data.data || []));
        } catch (error) {
            console.error("Error cargando habitaciones", error);
            setHabitaciones([]);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setImagen(e.target.files[0]);

    // 3. Preparar el formulario para Editar
    const prepararEdicion = (hab) => {
        setModoEdicion(true);
        setHabitacionIdEdit(hab.id);
        setFormData({ 
            nombre: hab.nombre || '', 
            precio: hab.precio || '', 
            descripcion: hab.descripcion || '' 
        });
        setImagen(null);
        const inputImg = document.getElementById("imagen_hab");
        if (inputImg) inputImg.value = ""; 
    };

    // 4. Cancelar Edición
    const cancelarEdicion = () => {
        setModoEdicion(false);
        setHabitacionIdEdit(null);
        setFormData({ nombre: '', precio: '', descripcion: '' });
        setImagen(null);
        const inputImg = document.getElementById("imagen_hab");
        if (inputImg) inputImg.value = ""; 
    };

    // 5. Guardar (Crear o Actualizar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hotelSeleccionado) return alert("Selecciona un alojamiento primero");

        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('precio', formData.precio);
        data.append('descripcion', formData.descripcion);
        if (imagen) data.append('imagen', imagen);

        try {
            if (modoEdicion) {
                // Si tienes una ruta específica para actualizar habitación, déjala o ajústala también
                await api.put(`/habitaciones/${habitacionIdEdit}`, data);
            } else {
                // --- CAMBIO AQUÍ: Usamos la ruta anidada del alojamiento ---
                await api.post(`/alojamientos/${hotelSeleccionado}/habitaciones`, data);
            }
            cancelarEdicion();
            cargarHabitaciones(hotelSeleccionado);
        } catch (error) {
            console.error("Error al guardar", error);
            alert("Error al guardar la habitación.");
        }
    };

    // 6. Eliminar Habitación
    const eliminarHabitacion = async (id) => {
        if(window.confirm("¿Seguro que deseas eliminar esta habitación del catálogo?")) {
            try {
                await api.delete(`/habitaciones/${id}`);
                cargarHabitaciones(hotelSeleccionado);
            } catch (error) {
                console.error("Error al eliminar", error);
            }
        }
    };

    return (
        <div className="card shadow-sm border-0 mb-4 rounded-4 bg-white overflow-hidden mt-2">
            <div className="card-header bg-white border-bottom border-light py-4 px-4">
                <h4 className="fw-bold mb-0 text-caribe-sobrio">
                    <i className="bi bi-door-open me-2"></i> Gestión de Habitaciones (Paso 2)
                </h4>
                <p className="text-muted small mb-0 mt-1">Selecciona un alojamiento para gestionar su inventario de habitaciones.</p>
            </div>

            <div className="card-body p-4 p-md-5">
                {/* Buscador del Hotel Integrado */}
                <div className="mb-5 p-4 bg-light rounded-4 border border-light">
                    <label className="form-label fw-bold text-dark mb-2 d-block fs-5">
                        {localStorage.getItem('rol_usuario') === 'superadmin' ? 'Todos los Establecimientos' : 'Tus Establecimientos Activos'}
                    </label>
                    <p className="text-muted small mb-4">Haz clic en uno de los alojamientos a continuación para gestionar sus habitaciones.</p>

                    {alojamientos.length === 0 ? (
                        <div className="alert border-0 shadow-sm fw-semibold" style={{ backgroundColor: '#fdf6b2', color: '#723b13' }}>
                            <i className="bi bi-info-circle me-2"></i> No hay alojamientos disponibles. ¡Registra el primero arriba!
                        </div>
                    ) : (
                        <div className="d-flex flex-wrap gap-3">
                            {alojamientos.map(h => (
                                <button
                                    key={h.id}
                                    type="button"
                                    onClick={() => setHotelSeleccionado(h.id.toString())}
                                    className={`btn rounded-pill px-4 py-2 fw-semibold shadow-sm border ${
                                        hotelSeleccionado === h.id.toString()
                                        ? 'btn-caribe-sobrio border-0 text-white' 
                                        : 'btn-white bg-white text-secondary'
                                    }`}
                                    style={{ 
                                        transition: 'all 0.2s ease',
                                        transform: hotelSeleccionado === h.id.toString() ? 'scale(1.03)' : 'none'
                                    }}
                                >
                                    <i className={`bi ${hotelSeleccionado === h.id.toString() ? 'bi-check2-circle' : 'bi-building'} me-2`}></i>
                                    {h.nombre}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {hotelSeleccionado && (
                    <div className="row g-5">
                        {/* FORMULARIO DE AGREGAR / EDITAR */}
                        <div className="col-lg-4">
                            <h5 className={`fw-bold mb-4 ${modoEdicion ? 'text-warning' : 'text-caribe-sobrio'}`}>
                                {modoEdicion ? <><i className="bi bi-pencil-square me-2"></i>Editar Habitación</> : <><i className="bi bi-plus-circle me-2"></i>Nueva Habitación</>}
                            </h5>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-secondary small text-uppercase">Nombre de Habitación</label>
                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control bg-light border-0" placeholder="Ej. Suite Presidencial" required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-secondary small text-uppercase">Precio por Noche (COP)</label>
                                    <input type="number" name="precio" value={formData.precio} onChange={handleChange} className="form-control bg-light border-0" placeholder="Ej. 150000" required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-secondary small text-uppercase">Características / Camas</label>
                                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control bg-light border-0" rows="3" placeholder="Ej. 1 Cama doble, vista al mar, aire acondicionado..." required></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-caribe-sobrio small text-uppercase"><i className="bi bi-camera me-1"></i> Foto de la Habitación</label>
                                    <input type="file" id="imagen_hab" accept="image/*" onChange={handleFileChange} className="form-control form-control-sm bg-light border-0" />
                                    {modoEdicion && <small className="text-muted d-block mt-2 fst-italic">Si no seleccionas nada, se conservará la foto anterior.</small>}
                                </div>
                                
                                <button type="submit" className={`btn w-100 fw-bold shadow-sm py-2 rounded-pill ${modoEdicion ? 'btn-warning text-dark' : 'btn-caribe-sobrio'}`}>
                                    {modoEdicion ? 'Actualizar Habitación' : 'Guardar Habitación'}
                                </button>
                                {modoEdicion && (
                                    <button type="button" onClick={cancelarEdicion} className="btn btn-light w-100 mt-2 fw-semibold text-muted rounded-pill">Cancelar Edición</button>
                                )}
                            </form>
                        </div>

                        {/* TABLA DEL CATÁLOGO ACTUAL */}
                        <div className="col-lg-8">
                            <h5 className="fw-bold text-dark mb-4 border-bottom pb-2">Inventario de Habitaciones</h5>
                            
                            {habitaciones.length === 0 ? (
                                <div className="alert alert-light text-center border-dashed rounded-4 p-5 text-muted">
                                    <i className="bi bi-inbox display-4 d-block mb-3 opacity-50"></i>
                                    Aún no hay habitaciones registradas en este alojamiento.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="bg-light text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                            <tr>
                                                <th className="border-0 rounded-start">Foto</th>
                                                <th className="border-0">Habitación</th>
                                                <th className="border-0">Precio</th>
                                                <th className="border-0 rounded-end text-end">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {habitaciones.map(hab => (
                                                <tr key={hab.id}>
                                                    <td className="py-3">
                                                        {hab.imagen_url ? (
                                                            <img src={hab.imagen_url} alt="hab" className="rounded object-fit-cover shadow-sm" style={{ width: '65px', height: '65px' }} />
                                                        ) : (
                                                            <div className="bg-light rounded text-center pt-3 text-muted" style={{ width: '65px', height: '65px' }}>
                                                                <i className="bi bi-camera fs-4"></i>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="fw-bold text-dark">{hab.nombre || 'Sin nombre'}</div>
                                                        <small className="text-muted">
                                                            {hab.descripcion ? `${hab.descripcion.substring(0, 45)}...` : 'Sin descripción'}
                                                        </small>
                                                    </td>
                                                    <td className="py-3 fw-bold text-caribe-sobrio">${hab.precio || 0}</td>
                                                    <td className="py-3 text-end">
                                                        <button onClick={() => prepararEdicion(hab)} className="btn btn-sm btn-light text-primary border me-2" title="Editar">
                                                            <i className="bi bi-pencil-fill"></i>
                                                        </button>
                                                        <button onClick={() => eliminarHabitacion(hab.id)} className="btn btn-sm btn-light text-danger border" title="Eliminar">
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
                )}
            </div>
        </div>
    );
};