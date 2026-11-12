import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [tipoNegocio, setTipoNegocio] = useState('alojamiento');
  
  // Estados para los inputs del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Nuevos estados para el responsable del servicio
  const [nombreResponsable, setNombreResponsable] = useState('');
  const [telefono, setTelefono] = useState('');
  const [documento, setDocumento] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación estricta del SuperAdmin
    if (email.trim() === 'Admin@gmail.com' && password === 'Admin123') {
      localStorage.setItem('token', 'super-token-admin-real');
      localStorage.setItem('usuario_id', '999');
      localStorage.setItem('rol_usuario', 'superadmin');
    } else {
      // Registro o Login de socio/responsable de negocio
      localStorage.setItem('token', 'fake-jwt-token-123');
      localStorage.setItem('usuario_id', '1');
      localStorage.setItem('rol_usuario', tipoNegocio);
      
      // Si se está registrando, guardamos los datos del responsable localmente o los enviamos al back
      if (isRegister) {
        localStorage.setItem('nombre_responsable', nombreResponsable);
        localStorage.setItem('telefono_contacto', telefono);
      }
    }
    
    navigate('/admin');
    window.location.reload();
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', backgroundColor: '#fcfbf9' }}>
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden my-4" style={{ maxWidth: '600px', width: '100%' }}>
        
        {/* Encabezado Elegante */}
        <div className="bg-caribe-sobrio text-white text-center py-4 px-4">
          <Link to="/" className="text-white text-decoration-none d-inline-flex align-items-center mb-2">
            <i className="bi bi-water fs-3 me-2"></i>
            <span className="fw-bold fs-4" style={{ fontFamily: 'Playfair Display, serif' }}>Sucre Turístico</span>
          </Link>
          <p className="mb-0 opacity-75 small">Portal Oficial de Socios y Prestadores de Servicios</p>
        </div>

        <div className="card-body p-4 p-md-5 bg-white">
          <h4 className="fw-bold text-center text-dark mb-4">
            {isRegister ? 'Registro de Prestador de Servicio' : 'Iniciar Sesión'}
          </h4>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <div className="mb-4">
                  <label className="form-label fw-bold small text-muted text-uppercase mb-3 d-block text-center">
                    Selecciona el tipo de servicio a ofertar
                  </label>
                  <div className="row g-2">
                    <div className="col-6">
                      <button type="button" onClick={() => setTipoNegocio('alojamiento')} className={`btn w-100 py-3 border rounded-3 ${tipoNegocio === 'alojamiento' ? 'btn-caribe-sobrio border-0' : 'btn-light text-muted'}`}>
                        <i className="bi bi-building d-block fs-4 mb-1"></i> <small className="fw-bold">Hotel / Hostal</small>
                      </button>
                    </div>
                    <div className="col-6">
                      <button type="button" onClick={() => setTipoNegocio('gastronomia')} className={`btn w-100 py-3 border rounded-3 ${tipoNegocio === 'gastronomia' ? 'btn-caribe-sobrio border-0' : 'btn-light text-muted'}`}>
                        <i className="bi bi-cup-hot d-block fs-4 mb-1"></i> <small className="fw-bold">Restaurante</small>
                      </button>
                    </div>
                    <div className="col-6">
                      <button type="button" onClick={() => setTipoNegocio('experiencias')} className={`btn w-100 py-3 border rounded-3 ${tipoNegocio === 'experiencias' ? 'btn-caribe-sobrio border-0' : 'btn-light text-muted'}`}>
                        <i className="bi bi-compass d-block fs-4 mb-1"></i> <small className="fw-bold">Tour / Experiencia</small>
                      </button>
                    </div>
                    <div className="col-6">
                      <button type="button" onClick={() => setTipoNegocio('eventos')} className={`btn w-100 py-3 border rounded-3 ${tipoNegocio === 'eventos' ? 'btn-caribe-sobrio border-0' : 'btn-light text-muted'}`}>
                        <i className="bi bi-calendar-event d-block fs-4 mb-1"></i> <small className="fw-bold">Evento Cultural</small>
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="my-4 text-muted opacity-25" />

                <label className="form-label fw-bold small text-muted text-uppercase mb-3 d-block">
                  Datos del Responsable / Representante Legal
                </label>

                <div className="row g-3 mb-4">
                  <div className="col-md-12">
                    <label className="form-label fw-semibold small text-muted">Nombre Completo del Responsable</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-person text-muted"></i></span>
                      <input 
                        type="text" 
                        className="form-control bg-light border-start-0 py-2" 
                        placeholder="Ej. Carlos Mario Pérez" 
                        value={nombreResponsable}
                        onChange={(e) => setNombreResponsable(e.target.value)}
                        required={isRegister}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Cédula o NIT</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-card-text text-muted"></i></span>
                      <input 
                        type="text" 
                        className="form-control bg-light border-start-0 py-2" 
                        placeholder="Número de documento" 
                        value={documento}
                        onChange={(e) => setDocumento(e.target.value)}
                        required={isRegister}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Teléfono de Contacto / WhatsApp</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-whatsapp text-muted"></i></span>
                      <input 
                        type="tel" 
                        className="form-control bg-light border-start-0 py-2" 
                        placeholder="300 123 4567" 
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required={isRegister}
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-4 text-muted opacity-25" />
                <label className="form-label fw-bold small text-muted text-uppercase mb-3 d-block">
                  Credenciales de Acceso
                </label>
              </>
            )}

            <div className="mb-3">
              <label className="form-label fw-semibold small text-muted">Correo Electrónico Corporativo</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-muted"></i></span>
                <input 
                  type="email" 
                  className="form-control bg-light border-start-0 py-2" 
                  placeholder="tu@correo.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between">
                <label className="form-label fw-semibold small text-muted">Contraseña</label>
                {!isRegister && <a href="#" className="small text-caribe-sobrio text-decoration-none">¿Olvidaste tu contraseña?</a>}
              </div>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock text-muted"></i></span>
                <input 
                  type="password" 
                  className="form-control bg-light border-start-0 py-2" 
                  placeholder="********" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-caribe-sobrio w-100 py-2 fw-bold shadow-sm rounded-pill mb-3">
              {isRegister ? 'Completar Registro y Acceder' : 'Entrar al Panel'}
            </button>

            <div className="text-center mt-4">
              <p className="small text-muted mb-0">
                {isRegister ? '¿Ya tienes una cuenta?' : '¿Quieres registrar un servicio o negocio?'}
                <button type="button" onClick={() => setIsRegister(!isRegister)} className="btn btn-link text-caribe-sobrio fw-bold p-0 ms-1 text-decoration-none">
                  {isRegister ? 'Inicia sesión aquí' : 'Regístrate aquí'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};