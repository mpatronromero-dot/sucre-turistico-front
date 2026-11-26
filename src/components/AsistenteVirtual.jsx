import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig';

export const AsistenteVirtual = () => {
  const [abierto, setAbierto] = useState(false);
  const [catalogo, setCatalogo] = useState({
    alojamientos: [],
    gastronomia: [],
    experiencias: []
  });

  const [paso, setPaso] = useState('destino'); // destino | dias | personas | presupuesto | resultado
  const [preferencias, setPreferencias] = useState({
    destino: '',
    dias: 2,
    personas: 2,
    nivel: 'Estándar'
  });

  const [mensajes, setMensajes] = useState([
    {
      emisor: 'bot',
      texto: '¡Hola! Soy el Guía Virtual de Sucre Turístico. Te ayudo a armar tu itinerario y presupuesto al instante. ¿Qué destino quieres visitar?'
    }
  ]);

  const chatEndRef = useRef(null);

  // Cargar datos reales de MySQL al abrir el chat
  useEffect(() => {
    if (!abierto) return;
    const cargarDatos = async () => {
      try {
        const [resAloj, resGast, resExp] = await Promise.allSettled([
          api.get('/alojamientos'),
          api.get('/gastronomia'),
          api.get('/experiencias')
        ]);

        const extraerLista = (res) => {
          if (res.status !== 'fulfilled') return [];
          const d = res.value.data;
          return Array.isArray(d) ? d : (d.data || d.alojamientos || []);
        };

        setCatalogo({
          alojamientos: extraerLista(resAloj),
          gastronomia: extraerLista(resGast),
          experiencias: extraerLista(resExp)
        });
      } catch (error) {
        console.error('Error cargando catálogo para el asistente:', error);
      }
    };
    cargarDatos();
  }, [abierto]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, abierto]);

  const formatoCOP = (valor) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);

  const generarPlanYPresupuesto = (prefsFinales) => {
    const { destino, dias, personas, nivel } = prefsFinales;
    const filtro = destino.toLowerCase();

    // Filtrar opciones reales del catálogo según el municipio elegido
    const hotelesZona = catalogo.alojamientos.filter(a => a.municipio?.toLowerCase().includes(filtro));
    const restZona = catalogo.gastronomia.filter(g => g.municipio?.toLowerCase().includes(filtro));
    const toursZona = catalogo.experiencias.filter(e => e.municipio?.toLowerCase().includes(filtro));

    const hotelSugerido = (hotelesZona[0] || catalogo.alojamientos[0])?.nombre || `Hotel recomendado en ${destino}`;
    const restSugerido = (restZona[0] || catalogo.gastronomia[0])?.nombre || `Restaurante típico en ${destino}`;
    const tour1 = toursZona[0] || catalogo.experiencias[0];
    const tour2 = toursZona[1] || catalogo.experiencias[1];

    // Tarifas base por nivel (COP)
    const tarifas = {
      Económico: { noche: 90000, comidaDia: 45000, tourBase: 60000 },
      Estándar: { noche: 180000, comidaDia: 85000, tourBase: 110000 },
      VIP: { noche: 350000, comidaDia: 150000, tourBase: 180000 }
    };
    const tarifa = tarifas[nivel] || tarifas.Estándar;

    const noches = Math.max(0, dias - 1);
    const habitaciones = Math.ceil(personas / 2);

    const costoAlojamiento = noches * habitaciones * tarifa.noche;
    const costoAlimentacion = dias * personas * tarifa.comidaDia;
    const precioTourUnitario = tour1?.costo_estimado ? Number(tour1.costo_estimado) : tarifa.tourBase;
    const costoExperiencias = personas * precioTourUnitario * (dias >= 3 ? 2 : 1);
    const total = costoAlojamiento + costoAlimentacion + costoExperiencias;

    // Construcción del itinerario día por día
    const lineasItinerario = [];
    lineasItinerario.push(`📍 Día 1: Llegada a ${destino}${noches > 0 ? `, check-in en ${hotelSugerido}` : ''} y almuerzo marino en ${restSugerido}. Tarde de playa y recorrido local.`);
    if (dias >= 2) {
      lineasItinerario.push(`🚤 Día 2: Mañana de actividad con "${tour1?.nombre || 'Tour náutico por el Golfo'}" y tarde libre de descanso.`);
    }
    if (dias >= 3) {
      lineasItinerario.push(`🌴 Día 3: Experiencia "${tour2?.nombre || 'Ruta ecológica y artesanal'}", compra de artesanías y retorno.`);
    }

    return [
      `✨ PLAN ${nivel.toUpperCase()} EN ${destino.toUpperCase()} (${dias} ${dias === 1 ? 'día' : 'días'} / ${personas} ${personas === 1 ? 'persona' : 'personas'})`,
      '',
      '🗓️ ITINERARIO SUGERIDO:',
      ...lineasItinerario,
      '',
      '💰 PRESUPUESTO ESTIMADO:',
      `• Hospedaje (${noches} ${noches === 1 ? 'noche' : 'noches'}): ${formatoCOP(costoAlojamiento)}`,
      `• Alimentación (${dias} ${dias === 1 ? 'día' : 'días'}): ${formatoCOP(costoAlimentacion)}`,
      `• Tours y experiencias: ${formatoCOP(costoExperiencias)}`,
      `👉 TOTAL ESTIMADO: ${formatoCOP(total)}`
    ].join('\n');
  };

  const seleccionarOpcion = (valor) => {
    const nuevosMensajes = [...mensajes, { emisor: 'user', texto: String(valor) }];

    if (paso === 'destino') {
      setPreferencias({ ...preferencias, destino: valor });
      setPaso('dias');
      nuevosMensajes.push({
        emisor: 'bot',
        texto: `Excelente elección, ${valor} tiene planes increíbles. ¿Cuántos días dura el viaje?`
      });
    } else if (paso === 'dias') {
      const numDias = parseInt(valor, 10);
      setPreferencias({ ...preferencias, dias: numDias });
      setPaso('personas');
      nuevosMensajes.push({
        emisor: 'bot',
        texto: '¿Para cuántas personas armamos el presupuesto?'
      });
    } else if (paso === 'personas') {
      const numPersonas = parseInt(valor, 10);
      setPreferencias({ ...preferencias, personas: numPersonas });
      setPaso('presupuesto');
      nuevosMensajes.push({
        emisor: 'bot',
        texto: '¿Qué estilo de presupuesto prefieres?'
      });
    } else if (paso === 'presupuesto') {
      const prefsFinales = { ...preferencias, nivel: valor };
      setPreferencias(prefsFinales);
      setPaso('resultado');
      const resumen = generarPlanYPresupuesto(prefsFinales);
      nuevosMensajes.push({
        emisor: 'bot',
        texto: resumen
      });
    }

    setMensajes(nuevosMensajes);
  };

  const reiniciarAsistente = () => {
    setPaso('destino');
    setMensajes([
      {
        emisor: 'bot',
        texto: '¡Listo! Armemos otro plan. ¿Qué destino de Sucre quieres explorar ahora?'
      }
    ]);
  };

  return (
    <div className="position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1050 }}>
      {/* Ventana del Chat */}
      {abierto && (
        <div
          className="card shadow-lg border-0 rounded-4 overflow-hidden mb-3"
          style={{ width: '360px', maxWidth: '90vw' }}
        >
          {/* Cabecera */}
          <div
            className="text-white p-3 d-flex justify-content-between align-items-center"
            style={{ backgroundColor: '#1a2e3b' }}
          >
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', backgroundColor: '#0f766e' }}
              >
                <i className="bi bi-robot fs-5"></i>
              </div>
              <div>
                <h6 className="mb-0 fw-bold">Asistente Sucre Turístico</h6>
                <small className="opacity-75" style={{ fontSize: '0.75rem' }}>
                  Itinerarios y Presupuestos
                </small>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm text-white opacity-75"
              onClick={() => setAbierto(false)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Cuerpo de mensajes */}
          <div
            className="card-body p-3 overflow-auto d-flex flex-column gap-2"
            style={{ height: '330px', backgroundColor: '#fcfbf9' }}
          >
            {mensajes.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-4 shadow-sm small ${
                  msg.emisor === 'user'
                    ? 'text-white align-self-end'
                    : 'bg-white text-dark border align-self-start'
                }`}
                style={{
                  maxWidth: '88%',
                  backgroundColor: msg.emisor === 'user' ? '#0f766e' : undefined,
                  whiteSpace: 'pre-line'
                }}
              >
                {msg.texto}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Opciones rápidas según el paso */}
          <div className="card-footer bg-white border-top p-3">
            {paso === 'destino' && (
              <div className="d-flex flex-wrap gap-2">
                {['Tolú', 'Coveñas', 'San Onofre', 'Sincelejo'].map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    className="btn btn-sm btn-outline-success rounded-pill fw-semibold"
                    onClick={() => seleccionarOpcion(dest)}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            )}

            {paso === 'dias' && (
              <div className="d-flex flex-wrap gap-2">
                {[
                  { label: '1 día (Pasadía)', val: 1 },
                  { label: '2 días / 1 noche', val: 2 },
                  { label: '3 días / 2 noches', val: 3 }
                ].map((op) => (
                  <button
                    key={op.val}
                    type="button"
                    className="btn btn-sm btn-outline-success rounded-pill fw-semibold"
                    onClick={() => seleccionarOpcion(op.val)}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            )}

            {paso === 'personas' && (
              <div className="d-flex flex-wrap gap-2">
                {[
                  { label: '1 persona', val: 1 },
                  { label: '2 personas (Pareja)', val: 2 },
                  { label: '4 personas (Familia)', val: 4 }
                ].map((op) => (
                  <button
                    key={op.val}
                    type="button"
                    className="btn btn-sm btn-outline-success rounded-pill fw-semibold"
                    onClick={() => seleccionarOpcion(op.val)}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            )}

            {paso === 'presupuesto' && (
              <div className="d-flex flex-wrap gap-2">
                {['Económico', 'Estándar', 'VIP'].map((nivel) => (
                  <button
                    key={nivel}
                    type="button"
                    className="btn btn-sm btn-outline-success rounded-pill fw-semibold"
                    onClick={() => seleccionarOpcion(nivel)}
                  >
                    {nivel}
                  </button>
                ))}
              </div>
            )}

            {paso === 'resultado' && (
              <button
                type="button"
                className="btn btn-sm w-100 text-white fw-bold rounded-pill py-2"
                style={{ backgroundColor: '#1a2e3b' }}
                onClick={reiniciarAsistente}
              >
                <i className="bi bi-arrow-repeat me-1"></i> Armar otro plan o presupuesto
              </button>
            )}
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <div className="text-end">
        <button
          type="button"
          onClick={() => setAbierto(!abierto)}
          className="btn text-white shadow-lg rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center gap-2"
          style={{ backgroundColor: '#0f766e' }}
        >
          <i className={`bi ${abierto ? 'bi-x-lg' : 'bi-chat-dots-fill'} fs-5`}></i>
          <span>{abierto ? 'Cerrar Guía' : 'Planear mi Viaje'}</span>
        </button>
      </div>
    </div>
  );
};