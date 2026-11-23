
import { useEffect, useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import {
  crearTicketSoporte,
  listarMisTicketsSoporte,
} from '../services/modulosIntegrados';
import './centroSoporte.css';

const preguntasFrecuentes = [
  {
    id: 1,
    pregunta: '¿Cómo propongo un horario como tutor?',
    respuesta:
      'Desde la sección Mis tutorías puedes consultar tus monitorías y gestionar los horarios disponibles para tus estudiantes.',
  },
  {
    id: 2,
    pregunta: '¿Puedo cancelar una tutoría ya confirmada?',
    respuesta:
      'Puedes consultar tus tutorías confirmadas desde Mis tutorías. Si necesitas cancelar una sesión, revisa sus opciones de gestión y notifica al estudiante.',
  },
  {
    id: 3,
    pregunta: '¿Cuántas tutorías activas puedo tener?',
    respuesta:
      'La cantidad de tutorías activas depende de la disponibilidad y de las condiciones de tu cuenta. Puedes consultar tus sesiones en Mis tutorías.',
  },
  {
    id: 4,
    pregunta: '¿Cómo dejo una reseña de mi tutor?',
    respuesta:
      'Después de completar una tutoría, podrás acceder a la opción de dejar una reseña desde el detalle de la sesión.',
  },
];

function adaptarTicket(ticket) {
  const estados = {
    pendiente: 'Pendiente',
    en_revision: 'En revisión',
    resuelto: 'Resuelto',
  };
  const fechaActualizacion = new Date(ticket.updatedAt);
  return {
    id: ticket._id,
    numeroCaso: ticket.numeroCaso,
    tipo: ticket.categoria,
    asunto: ticket.asunto,
    descripcion: ticket.descripcion,
    fecha: new Date(ticket.createdAt).toLocaleDateString('es-CO'),
    ultimaActualizacion: fechaActualizacion.toLocaleString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
    estado: estados[ticket.estado] || ticket.estado,
    respuesta: ticket.respuesta || '',
  };
}

export default function CentroSoporte({ onNavegar }) {
  const [pestanaActiva, setPestanaActiva] = useState('nueva');
  const [tipoSituacion, setTipoSituacion] = useState('Problema técnico');
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudExpandida, setSolicitudExpandida] = useState(null);
  const [confirmacionEnviada, setConfirmacionEnviada] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    listarMisTicketsSoporte()
      .then((tickets) => {
        if (vigente) setSolicitudes(tickets.map(adaptarTicket));
      })
      .catch((errorApi) => {
        if (vigente) setError(errorApi.message);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, []);

  // ENVIAR SOLICITUD

  const enviarSolicitud = async (event) => {
    event.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const ticket = await crearTicketSoporte({
        categoria: tipoSituacion,
        asunto: asunto.trim(),
        descripcion: descripcion.trim(),
      });
      setSolicitudes((actuales) => [adaptarTicket(ticket), ...actuales]);
      setAsunto('');
      setDescripcion('');
      setTipoSituacion('Problema técnico');
      setSolicitudExpandida(null);
      setConfirmacionEnviada(true);
    } catch (errorApi) {
      setError(errorApi.message);
    } finally {
      setEnviando(false);
    }
  };

  // VER MIS SOLICITUDES

  const verMisSolicitudes = () => {
    setConfirmacionEnviada(false);
    setPestanaActiva('mis');
    setSolicitudExpandida(null);
  };

  // CREAR OTRA SOLICITUD

  const crearNuevaSolicitud = () => {
    setConfirmacionEnviada(false);
    setPestanaActiva('nueva');
    setSolicitudExpandida(null);
  };

  // EXPANDIR U OCULTAR DETALLE

  const cambiarDetalle = (id) => {
    setSolicitudExpandida((actual) =>
      actual === id ? null : id
    );
  };

  // PREGUNTAS FRECUENTES

  const cambiarPregunta = (id) => {
    setPreguntaAbierta((actual) =>
      actual === id ? null : id
    );
  };

  return (
    <div className="centro-soporte">

      <Sidebar
        paginaActiva="Soporte"
        onNavegar={onNavegar}
      />

      <main className="centro-soporte__principal">

        <Navbar titulo="Centro de soporte" onNavegar={onNavegar} />
        {error && <p className="centro-soporte__error" role="alert">{error}</p>}

        {confirmacionEnviada ? (

          /* ==================================
             CONFIRMACIÓN DE SOLICITUD ENVIADA
          ================================== */

          <section className="centro-soporte__confirmacion">

            <div className="centro-soporte__confirmacion-contenido">

              <div className="centro-soporte__confirmacion-icono">
                ✓
              </div>

              <h1>¡Solicitud enviada!</h1>

              <p>
                Recibimos tu solicitud.
                <br />
                Nuestro equipo la revisará en un plazo de 24–48 horas
                y te notificaremos por correo.
              </p>

              <div className="centro-soporte__confirmacion-acciones">

                <button
                  type="button"
                  className="centro-soporte__confirmacion-secundario"
                  onClick={verMisSolicitudes}
                >
                  Ver mis solicitudes
                </button>

                <button
                  type="button"
                  className="centro-soporte__confirmacion-primario"
                  onClick={crearNuevaSolicitud}
                >
                  Nueva solicitud
                </button>

              </div>

            </div>

          </section>

        ) : (

          /* ==================================
             CONTENIDO DEL CENTRO DE SOPORTE
          ================================== */

          <div className="centro-soporte__contenido">

            {/* ENCABEZADO */}

            <header className="centro-soporte__encabezado">
              <h1>Centro de soporte</h1>
              <p>Estamos aquí para ayudarte</p>
            </header>

            {/* PESTAÑAS */}

            <nav className="centro-soporte__pestanas">

              <button
                type="button"
                className={
                  pestanaActiva === 'nueva'
                    ? 'centro-soporte__pestana centro-soporte__pestana--activa'
                    : 'centro-soporte__pestana'
                }
                onClick={() => {
                  setPestanaActiva('nueva');
                  setSolicitudExpandida(null);
                }}
              >
                Nueva solicitud
              </button>

              <button
                type="button"
                className={
                  pestanaActiva === 'mis'
                    ? 'centro-soporte__pestana centro-soporte__pestana--activa'
                    : 'centro-soporte__pestana'
                }
                onClick={() => {
                  setPestanaActiva('mis');
                  setSolicitudExpandida(null);
                }}
              >
                Mis solicitudes
              </button>

            </nav>

            {/* NUEVA SOLICITUD */}

            {pestanaActiva === 'nueva' && (
              <section className="centro-soporte__formulario-card">

                <div className="centro-soporte__formulario-encabezado">
                  <h2>¿En qué podemos ayudarte?</h2>
                  <p>Completa el formulario y te respondemos pronto</p>
                </div>

                <form
                  className="centro-soporte__formulario"
                  onSubmit={enviarSolicitud}
                >

                  <div className="centro-soporte__campo">
                    <label htmlFor="tipo-situacion">
                      Tipo de situación
                    </label>

                    <select
                      id="tipo-situacion"
                      value={tipoSituacion}
                      onChange={(event) =>
                        setTipoSituacion(event.target.value)
                      }
                    >
                      <option>Problema técnico</option>
                      <option>Problema con una tutoría</option>
                      <option>Problema con una solicitud</option>
                      <option>Problema con mi cuenta</option>
                      <option>Otro</option>
                    </select>
                  </div>

                  <div className="centro-soporte__campo">
                    <label htmlFor="asunto">
                      Asunto
                    </label>

                    <input
                      id="asunto"
                      type="text"
                      maxLength={120}
                      value={asunto}
                      onChange={(event) =>
                        setAsunto(event.target.value)
                      }
                      placeholder="Describe brevemente el problema..."
                      required
                    />
                  </div>

                  <div className="centro-soporte__campo">
                    <label htmlFor="descripcion">
                      Descripción detallada
                    </label>

                    <textarea
                      id="descripcion"
                      value={descripcion}
                      maxLength={3000}
                      onChange={(event) =>
                        setDescripcion(event.target.value)
                      }
                      placeholder="Cuéntanos con detalle qué ocurrió, cuándo y qué intentaste hacer..."
                      required
                    />
                  </div>

                  <p className="centro-soporte__ayuda">
                    Cuanta más información proporciones, más rápido podremos ayudarte.
                  </p>

                  <button
                    type="submit"
                    className="centro-soporte__enviar"
                    disabled={enviando}
                  >
                    {enviando ? 'Enviando…' : 'Enviar solicitud'}
                  </button>

                </form>
              </section>
            )}

            {/* MIS SOLICITUDES */}

            {pestanaActiva === 'mis' && (
              <section className="centro-soporte__mis-solicitudes">

                <h2>Mis solicitudes</h2>

                {cargando ? (
                  <p role="status">Cargando tus solicitudes…</p>
                ) : solicitudes.length > 0 ? (

                  <div className="centro-soporte__solicitudes-lista">

                    {solicitudes.map((solicitud) => {
                      const estaExpandida =
                        solicitudExpandida === solicitud.id;

                      const estadoClase = solicitud.estado
                        .toLowerCase()
                        .replace(/\s+/g, '-');

                      return (
                        <article
                          className="centro-soporte__solicitud"
                          key={solicitud.id}
                        >

                          {/* INFORMACIÓN PRINCIPAL */}

                          <div className="centro-soporte__solicitud-superior">

                            <div className="centro-soporte__solicitud-info">

                              <h3>{solicitud.asunto}</h3>

                              <p>
                                {solicitud.tipo} · {solicitud.fecha}
                              </p>

                            </div>

                            <span
                              className={`centro-soporte__estado centro-soporte__estado--${estadoClase}`}
                            >
                              {solicitud.estado}
                            </span>

                          </div>

                          {/* DETALLE EXPANDIBLE */}

                          {estaExpandida && (
                            <div className="centro-soporte__detalle">

                              <div className="centro-soporte__detalle-titulo">
                                Detalle de la solicitud
                              </div>

                              {/* DATOS DEL CASO */}

                              <div className="centro-soporte__detalle-datos">

                                <div className="centro-soporte__detalle-dato">
                                  <span>Número de caso</span>
                                  <strong>{solicitud.numeroCaso}</strong>
                                </div>

                                <div className="centro-soporte__detalle-dato">
                                  <span>Última actualización</span>
                                  <strong>{solicitud.ultimaActualizacion}</strong>
                                </div>

                              </div>

                              {/* DESCRIPCIÓN */}

                              <p className="centro-soporte__detalle-descripcion">
                                {solicitud.descripcion}
                              </p>

                              {/* RESPUESTA DEL EQUIPO */}

                              <div
                                className={`centro-soporte__respuesta ${
                                  solicitud.respuesta
                                    ? 'centro-soporte__respuesta--respondida'
                                    : 'centro-soporte__respuesta--pendiente'
                                }`}
                              >

                                <div className="centro-soporte__respuesta-titulo">

                                  <span className="centro-soporte__respuesta-icono">
                                    <svg
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8v.5Z"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </span>

                                  <strong>
                                    Respuesta del equipo de soporte
                                  </strong>

                                </div>

                                <p>
                                  {solicitud.respuesta ||
                                    'Tu solicitud aún no tiene respuesta. El equipo de soporte la revisará y publicará aquí cualquier actualización.'}
                                </p>

                              </div>

                              {/* OCULTAR DETALLE */}

                              <button
                                type="button"
                                className="centro-soporte__ocultar-detalle"
                                onClick={() =>
                                  cambiarDetalle(solicitud.id)
                                }
                              >
                                Ocultar detalle
                              </button>

                            </div>
                          )}

                          {/* VER DETALLE */}

                          {!estaExpandida && (
                            <button
                              type="button"
                              className="centro-soporte__ver-detalle"
                              onClick={() =>
                                cambiarDetalle(solicitud.id)
                              }
                            >
                              Ver detalle
                            </button>
                          )}

                        </article>
                      );
                    })}

                  </div>

                ) : (

                  <div className="centro-soporte__sin-solicitudes">

                    <p>
                      Aún no has enviado solicitudes de soporte.
                    </p>

                    <button
                      type="button"
                      onClick={() => setPestanaActiva('nueva')}
                    >
                      Crear nueva solicitud
                    </button>

                  </div>

                )}

              </section>
            )}

            {/* PREGUNTAS FRECUENTES */}

            <section className="centro-soporte__faq">

              <h2>PREGUNTAS FRECUENTES</h2>

              <div className="centro-soporte__faq-card">

                {preguntasFrecuentes.map((item) => (
                  <article
                    className="centro-soporte__faq-item"
                    key={item.id}
                  >

                    <button
                      type="button"
                      className="centro-soporte__faq-pregunta"
                      aria-expanded={preguntaAbierta === item.id}
                      onClick={() => cambiarPregunta(item.id)}
                    >

                      <span>{item.pregunta}</span>

                      <span
                        className={`centro-soporte__chevron ${
                          preguntaAbierta === item.id
                            ? 'centro-soporte__chevron--abierto'
                            : ''
                        }`}
                      >
                        ›
                      </span>

                    </button>

                    {preguntaAbierta === item.id && (
                      <div className="centro-soporte__faq-respuesta">
                        {item.respuesta}
                      </div>
                    )}

                  </article>
                ))}

              </div>

            </section>

          </div>
        )}

      </main>
    </div>
  );
}
