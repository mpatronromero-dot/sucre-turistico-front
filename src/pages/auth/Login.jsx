import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Login = () => {
  const [esRegistro, setEsRegistro] = useState(false);
  const navigate = useNavigate();

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    const url = esRegistro 
      ? 'http://localhost:3005/api/auth/register' 
      : 'http://localhost:3005/api/auth/login';

    const body = esRegistro 
      ? { nombre_encargado: nombre, email, password }
      : { email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (response.ok) {
        if (esRegistro) {
          Swal.fire('¡Éxito!', result.message, 'success');
          setEsRegistro(false); // Lo mandamos a la vista de login
        } else {
          // LOGIN EXITOSO: Guardamos el carnet (token) en la memoria del navegador
          localStorage.setItem('token', result.token);
          localStorage.setItem('usuario', JSON.stringify(result.usuario));
          
          Swal.fire({
            title: '¡Bienvenido!',
            text: result.message,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          
          navigate('/admin'); // Lo enviamos a su panel
        }
      } else {
        Swal.fire('Error', result.message, 'error');
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        
        {/* Encabezado azul */}
        <div className="card-header bg-primary text-white text-center py-4 rounded-top-4 border-0">
          <h3 className="fw-bold mb-0">Sucre Turístico</h3>
          <p className="mb-0 small opacity-75">Portal para Socios y Hoteleros</p>
        </div>

        <div className="card-body p-4 p-md-5">
          <h4 className="fw-bold text-center mb-4 text-dark">
            {esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h4>

          <form onSubmit={handleSubmit}>
            {/* Campo Nombre (Solo aparece si es registro) */}
            {esRegistro && (
              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">Nombre del Encargado</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-person"></i></span>
                  <input type="text" className="form-control border-start-0 bg-light" placeholder="Ej. Juan Pérez" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label text-muted small fw-semibold">Correo Electrónico</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope"></i></span>
                <input type="email" className="form-control border-start-0 bg-light" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between">
                <label className="form-label text-muted small fw-semibold">Contraseña</label>
                {!esRegistro && <a href="#" className="small text-decoration-none text-primary">¿Olvidaste tu contraseña?</a>}
              </div>
              <div className="input-group">
  <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock"></i></span>
  
  <input 
    type={mostrarPassword ? "text" : "password"} 
    className="form-control border-start-0 border-end-0 bg-light" 
    placeholder="********" 
    value={password} 
    onChange={(e) => setPassword(e.target.value)} 
    required 
  />
  
  <span 
    className="input-group-text bg-light text-muted fw-bold" 
    onClick={() => setMostrarPassword(!mostrarPassword)} 
    style={{ cursor: 'pointer', fontSize: '1.1rem' }}
    title={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
  >
    {mostrarPassword ? "🙈" : "👁️"}
  </span>
</div>
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-bold rounded-pill py-2 shadow-sm" disabled={cargando}>
              {cargando ? 'Cargando...' : (esRegistro ? 'Registrarme' : 'Entrar al Panel')}
            </button>
          </form>

          {/* Botón para alternar entre Login y Registro */}
          <div className="text-center mt-4 pt-3 border-top">
            <span className="text-muted small">
              {esRegistro ? '¿Ya tienes cuenta?' : '¿Quieres publicar tu hotel?'}
            </span>
            <button className="btn btn-link fw-bold text-decoration-none p-0 ms-2" onClick={() => setEsRegistro(!esRegistro)}>
              {esRegistro ? 'Inicia sesión' : 'Regístrate aquí'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};