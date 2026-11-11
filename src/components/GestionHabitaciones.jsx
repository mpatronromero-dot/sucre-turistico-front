import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // Usamos el API Gateway

export const GestionHabitaciones = () => {
    const [alojamientos, setAlojamientos] = useState([]);
    const [hotelSeleccionado, setHotelSeleccionado] = useState('');
    const [habitaciones, setHabitaciones] = useState([]);
    
    // Estado para el formulario (sirve para Crear y Editar)
    const [modoEdicion, setModoEdicion] = useState(false);
    const [habitacionIdEdit, setHabitacionIdEdit] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', precio: '', descripcion: '' });
    const [imagen, setImagen] = useState(null);

    // 1. Cargar SOLO los hoteles del usuario logueado
    useEffect(() => {
        const cargarMisHoteles = async () => {
            try {
                const usuarioId = localStorage.getItem('usuario_id');
                if (!usuarioId) {
                    console.error("No se encontró el ID del usuario en sesión.");
                    return;
                }
                
                // Llamamos a la nueva ruta filtrada por usuario
                const res = await api.get(`/alojamientos/mis-alojamientos/${usuarioId}`);
                const listaHoteles = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setAlojamientos(listaHoteles);
            } catch (err) {
                console.error("Error cargando los hoteles del usuario", err);
            }
        };
        cargarMisHoteles();
    }, []);

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
        window.scrollTo(0, 0); 
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
        if (!modoEdicion) data.append('alojamiento_id', hotelSeleccionado);
        if (imagen) data.append('imagen', imagen);

        try {
            if (modoEdicion) {
                await api.put(`/habitaciones/${habitacionIdEdit}`, data);
            } else {
                await api.post('/habitaciones', data);
            }
            cancelarEdicion();
            cargarHabitaciones(hotelSeleccionado); // Recargar la tabla
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
        <div className="container-fluid p-0">
            {/* Buscador del Hotel (Filtrado para el usuario actual) */}
            <div className="card shadow-sm border-0 mb-4 bg-primary text-white">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3"><i className="bi bi-buildings"></i> Gestión de Catálogo de Habitaciones</h5>
                    <select className="form-select form-select-lg" value={hotelSeleccionado} onChange={(e) => setHotelSeleccionado(e.target.value)}>
                        <option value="">-- Selecciona el Alojamiento a gestionar --</option>
                        {alojamientos.map(h => (
                            <option key={h.id} value={h.id}>{h.nombre} ({h.municipio})</option>
                        ))}
                    </select>
                    {alojamientos.length === 0 && (
                        <small className="d-block mt-2 text-warning"><i className="bi bi-info-circle"></i> Aún no has registrado ningún alojamiento.</small>
                    )}
                </div>
            </div>

            {hotelSeleccionado && (
                <div className="row g-4">
                    {/* FORMULARIO DE AGREGAR / EDITAR */}
                    <div className="col-lg-4">
                        <div className={`card shadow-sm border-0 border-top border-4 ${modoEdicion ? 'border-warning' : 'border-success'}`}>
                            <div className="card-body p-4">
                                <h5 className={`fw-bold ${modoEdicion ? 'text-warning' : 'text-success'} mb-4`}>
                                    {modoEdicion ? '✏️ Editar Habitación' : '➕ Nueva Habitación'}
                                </h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="fw-bold small">Nombre de Habitación</label>
                                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control" placeholder="Ej. Suite Presidencial" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="fw-bold small">Precio por Noche (COP)</label>
                                        <input type="number" name="precio" value={formData.precio} onChange={handleChange} className="form-control" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="fw-bold small">Características / Camas</label>
                                        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control" rows="2" required></textarea>
                                    </div>
                                    <div className="mb-4">
                                        <label className="fw-bold small text-primary">Foto de la Habitación</label>
                                        <input type="file" id="imagen_hab" accept="image/*" onChange={handleFileChange} className="form-control form-control-sm" />
                                        {modoEdicion && <small className="text-muted d-block mt-1">Si no seleccionas nada, se conservará la foto anterior.</small>}
                                    </div>
                                    
                                    <button type="submit" className={`btn w-100 fw-bold ${modoEdicion ? 'btn-warning' : 'btn-success'}`}>
                                        {modoEdicion ? 'Actualizar Habitación' : 'Guardar Habitación'}
                                    </button>
                                    {modoEdicion && (
                                        <button type="button" onClick={cancelarEdicion} className="btn btn-light w-100 mt-2 border">Cancelar</button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* TABLA DEL CATÁLOGO ACTUAL */}
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h5 className="fw-bold text-dark mb-4">Catálogo Actualizado</h5>
                                {habitaciones.length === 0 ? (
                                    <div className="alert alert-light text-center border p-4 text-muted">No hay habitaciones registradas para este hotel.</div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Foto</th>
                                                    <th>Habitación</th>
                                                    <th>Precio</th>
                                                    <th className="text-end">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {habitaciones.map(hab => (
                                                    <tr key={hab.id}>
                                                        <td>
                                                            {hab.imagen_url ? (
                                                                <img src={hab.imagen_url} alt="hab" className="rounded object-fit-cover shadow-sm" style={{ width: '60px', height: '60px' }} />
                                                            ) : (
                                                                <div className="bg-light rounded text-center pt-3 text-muted" style={{ width: '60px', height: '60px' }}><i className="bi bi-camera"></i></div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="fw-bold">{hab.nombre || 'Sin nombre'}</div>
                                                            <small className="text-muted">
                                                                {hab.descripcion ? `${hab.descripcion.substring(0, 40)}...` : 'Sin descripción'}
                                                            </small>
                                                        </td>
                                                        <td className="fw-semibold text-success">${hab.precio || 0}</td>
                                                        <td className="text-end">
                                                            <button onClick={() => prepararEdicion(hab)} className="btn btn-sm btn-outline-warning me-2" title="Editar">
                                                                <i className="bi bi-pencil-fill"></i>
                                                            </button>
                                                            <button onClick={() => eliminarHabitacion(hab.id)} className="btn btn-sm btn-outline-danger" title="Eliminar">
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
                    </div>
                </div>
            )}
        </div>
    );
};