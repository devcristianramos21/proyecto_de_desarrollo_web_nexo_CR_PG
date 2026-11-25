import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import { useUsuario } from '../components/layout/usuarioContext';
import {
  crearSocketChat,
  enviarMensajeChat,
  listarConversacionesChat,
  listarMensajesChat,
} from '../services/chatService';
import './mensajes.css';

function obtenerId(valor) {
  return String(valor?._id ?? valor?.id ?? valor ?? '');
}

function obtenerIniciales(nombre = '') {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase() || 'NE';
}

function fechaValida(valor) {
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

function mostrarHora(valor) {
  const fecha = fechaValida(valor);
  return fecha
    ? new Intl.DateTimeFormat('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(fecha)
    : '';
}

function mostrarFechaConversacion(valor) {
  const fecha = fechaValida(valor);
  if (!fecha) return '';

  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);

  if (fecha.toDateString() === hoy.toDateString()) return mostrarHora(fecha);
  if (fecha.toDateString() === ayer.toDateString()) return 'Ayer';

  return new Intl.DateTimeFormat('es-CO', { weekday: 'short' }).format(fecha);
}

function etiquetaDia(valor) {
  const fecha = fechaValida(valor);
  if (!fecha) return 'Fecha no disponible';

  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);

  if (fecha.toDateString() === hoy.toDateString()) return 'Hoy';
  if (fecha.toDateString() === ayer.toDateString()) return 'Ayer';

  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(fecha);
}

function adaptarConversacion(conversacion, rolUsuario) {
  const esGrupo = conversacion.tipo === 'grupo';
  const otraPersona = conversacion.otroParticipante;
  const nombre = esGrupo
    ? conversacion.titulo
    : otraPersona?.nombre || conversacion.titulo;
  const monitoria = conversacion.monitoria;

  return {
    id: obtenerId(conversacion._id),
    tipo: conversacion.tipo,
    tipoPersona:
      String(rolUsuario).toLowerCase() === 'tutor' ? 'estudiante' : 'tutor',
    tutor: nombre || 'Conversación',
    tutorInfo: otraPersona
      ? {
          ...otraPersona,
          id: obtenerId(otraPersona._id),
          nombre: otraPersona.nombre,
          iniciales: obtenerIniciales(otraPersona.nombre),
        }
      : null,
    monitoriaInfo: monitoria
      ? {
          ...monitoria,
          id: obtenerId(monitoria._id),
          titulo: `${monitoria.materia || 'Monitoría'}${monitoria.grupo ? ` - Grupo ${monitoria.grupo}` : ''}`,
        }
      : null,
    iniciales: obtenerIniciales(nombre),
    hora: mostrarFechaConversacion(conversacion.ultimoMensaje?.fecha),
    ultimoMensaje: conversacion.ultimoMensaje?.texto || 'Sin mensajes todavía.',
    noLeidos: Number(conversacion.noLeidos) || 0,
    actualizada: conversacion.actualizada,
  };
}

function adaptarMensaje(mensaje, usuarioId) {
  const autorId = obtenerId(mensaje.autor);
  return {
    id: obtenerId(mensaje._id),
    texto: mensaje.texto,
    hora: mostrarHora(mensaje.createdAt),
    fecha: mensaje.createdAt,
    tipo: autorId === usuarioId ? 'enviado' : 'recibido',
  };
}

function unirMensajes(actuales, nuevos) {
  const porId = new Map(actuales.map((mensaje) => [mensaje.id, mensaje]));
  nuevos.forEach((mensaje) => porId.set(mensaje.id, mensaje));
  return [...porId.values()].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );
}

function Mensajes({
  onNavegar,
  conversacionActiva,
  setConversacionActiva,
  tutorias = [],
  onVerPerfilTutor,
  onVerDetalleTutoria,
  onVerMonitoriaTutor,
}) {
  const { usuario } = useUsuario();
  const usuarioId = obtenerId(usuario?._id || usuario?.id);
  const [conversaciones, setConversaciones] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mensajeNuevo, setMensajeNuevo] = useState('');
  const [cargandoConversaciones, setCargandoConversaciones] = useState(true);
  const [cargandoMensajes, setCargandoMensajes] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [errorConversaciones, setErrorConversaciones] = useState('');
  const [errorMensajes, setErrorMensajes] = useState('');
  const [errorTiempoReal, setErrorTiempoReal] = useState('');
  const [socketConectado, setSocketConectado] = useState(false);
  const [escribiendo, setEscribiendo] = useState('');
  const [hayMasMensajes, setHayMasMensajes] = useState(false);
  const [cargandoAnteriores, setCargandoAnteriores] = useState(false);
  const cuerpoChatRef = useRef(null);
  const socketRef = useRef(null);
  const conversacionActivaRef = useRef(conversacionActiva);
  const usuarioIdRef = useRef(usuarioId);
  const conversacionesRef = useRef(conversaciones);
  const temporizadorEscribiendoRef = useRef(null);

  const chatActivo = conversaciones.find(
    (conversacion) => conversacion.id === conversacionActiva
  );
  const conversacionesFiltradas = conversaciones.filter((conversacion) =>
    `${conversacion.tutor} ${conversacion.ultimoMensaje}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  useEffect(() => {
    conversacionActivaRef.current = conversacionActiva;
  }, [conversacionActiva]);

  useEffect(() => {
    usuarioIdRef.current = usuarioId;
  }, [usuarioId]);

  useEffect(() => {
    conversacionesRef.current = conversaciones;
  }, [conversaciones]);

  useEffect(() => {
    let vigente = true;

    listarConversacionesChat()
      .then((resultado) => {
        if (!vigente) return;
        const lista = resultado.map((conversacion) =>
          adaptarConversacion(conversacion, usuario.rol)
        );
        setConversaciones(lista);
        setErrorConversaciones('');
      })
      .catch((error) => {
        if (vigente) setErrorConversaciones(error.message);
      })
      .finally(() => {
        if (vigente) setCargandoConversaciones(false);
      });

    return () => {
      vigente = false;
    };
  }, [usuario.rol]);

  useEffect(() => {
    if (!conversacionActiva) {
      return undefined;
    }

    let vigente = true;

    listarMensajesChat(conversacionActiva)
      .then((resultado) => {
        if (!vigente) return;
        setMensajes(
          resultado.mensajes.map((mensaje) => adaptarMensaje(mensaje, usuarioId))
        );
        setHayMasMensajes(resultado.hayMas);
        setConversaciones((actuales) =>
          actuales.map((conversacion) =>
            conversacion.id === conversacionActiva
              ? { ...conversacion, noLeidos: 0 }
              : conversacion
          )
        );
      })
      .catch((error) => {
        if (vigente) setErrorMensajes(error.message);
      })
      .finally(() => {
        if (vigente) setCargandoMensajes(false);
      });

    return () => {
      vigente = false;
    };
  }, [conversacionActiva, usuarioId]);

  useEffect(() => {
    const socket = crearSocketChat();
    socketRef.current = socket;
    const manejarMensajeNuevo = ({ conversacion, mensaje } = {}) => {
      const conversacionId = obtenerId(conversacion);
      if (!conversacionId || !mensaje) return;

      const mensajeAdaptado = adaptarMensaje(mensaje, usuarioIdRef.current);
      const esConversacionActiva =
        conversacionId === conversacionActivaRef.current;

      if (!conversacionesRef.current.some((item) => item.id === conversacionId)) {
        listarConversacionesChat()
          .then((resultado) =>
            setConversaciones(
              resultado.map((item) => adaptarConversacion(item, usuario.rol))
            )
          )
          .catch((error) => setErrorConversaciones(error.message));
        return;
      }

      setConversaciones((actuales) =>
        actuales
          .map((item) =>
            item.id === conversacionId
              ? {
                  ...item,
                  ultimoMensaje: mensaje.texto,
                  hora: mostrarFechaConversacion(mensaje.createdAt),
                  actualizada: mensaje.createdAt,
                  noLeidos:
                    !esConversacionActiva &&
                    mensajeAdaptado.tipo === 'recibido'
                      ? item.noLeidos + 1
                      : item.noLeidos,
                }
              : item
          )
          .sort(
            (a, b) =>
              new Date(b.actualizada || 0).getTime() -
              new Date(a.actualizada || 0).getTime()
          )
      );

      if (esConversacionActiva) {
        setMensajes((actuales) => unirMensajes(actuales, [mensajeAdaptado]));
        if (mensajeAdaptado.tipo === 'recibido') {
          listarMensajesChat(conversacionId)
            .then((resultado) =>
              setMensajes(
                resultado.mensajes.map((item) =>
                  adaptarMensaje(item, usuarioIdRef.current)
                )
              )
            )
            .catch((error) => setErrorMensajes(error.message));
        }
      }
    };
    const manejarEscribiendo = ({ conversacion, usuario: autor } = {}) => {
      if (
        obtenerId(conversacion) !== conversacionActivaRef.current ||
        obtenerId(autor) === usuarioIdRef.current
      ) {
        return;
      }

      setEscribiendo(autor?.nombre || 'Alguien');
      window.clearTimeout(temporizadorEscribiendoRef.current);
      temporizadorEscribiendoRef.current = window.setTimeout(
        () => setEscribiendo(''),
        2000
      );
    };

    socket.on('connect', () => {
      setSocketConectado(true);
      setErrorTiempoReal('');
    });
    socket.on('disconnect', () => setSocketConectado(false));
    socket.on('connect_error', (error) => {
      setSocketConectado(false);
      setErrorTiempoReal(error.message);
    });
    socket.on('mensaje:nuevo', manejarMensajeNuevo);
    socket.on('conversacion:escribiendo', manejarEscribiendo);
    socket.connect();

    return () => {
      socket.off('mensaje:nuevo', manejarMensajeNuevo);
      socket.off('conversacion:escribiendo', manejarEscribiendo);
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      window.clearTimeout(temporizadorEscribiendoRef.current);
    };
  }, [usuario.rol]);

  useEffect(() => {
    const cuerpo = cuerpoChatRef.current;
    if (cuerpo) cuerpo.scrollTop = cuerpo.scrollHeight;
  }, [mensajes, conversacionActiva]);

  const seleccionarConversacion = (id) => {
    setErrorMensajes('');
    setEscribiendo('');
    setCargandoMensajes(true);
    setMensajes([]);
    setHayMasMensajes(false);
    setConversacionActiva(id);
  };

  const verPerfilTutor = () => {
    if (!chatActivo?.tutorInfo || chatActivo.tipoPersona !== 'tutor') return;
    onVerPerfilTutor?.(chatActivo.tutorInfo);
  };

  const verTutoria = () => {
    if (!chatActivo) return;

    if (chatActivo.tipo === 'grupo') {
      onVerMonitoriaTutor?.(chatActivo.monitoriaInfo);
      return;
    }

    if (chatActivo.tipoPersona !== 'tutor') return;

    const tutorId = chatActivo.tutorInfo?.id;
    const tutoriasCoincidentes = tutorId != null
      ? tutorias.filter((item) => String(item.tutorId) === String(tutorId))
      : [];
    if (tutoriasCoincidentes.length === 1) {
      onVerDetalleTutoria?.(tutoriasCoincidentes[0]);
      return;
    }

    onNavegar?.('Mis monitorias');
  };

  const notificarEscribiendo = () => {
    if (socketConectado && conversacionActiva && socketRef.current?.connected) {
      socketRef.current.emit('conversacion:escribiendo', {
        conversacion: conversacionActiva,
      });
    }
  };

  const cargarMensajesAnteriores = async () => {
    const primerMensaje = mensajes[0];
    if (!conversacionActiva || !primerMensaje || cargandoAnteriores) return;

    const cuerpo = cuerpoChatRef.current;
    const alturaAnterior = cuerpo?.scrollHeight || 0;
    const posicionAnterior = cuerpo?.scrollTop || 0;
    setCargandoAnteriores(true);

    try {
      const resultado = await listarMensajesChat(conversacionActiva, {
        antes: primerMensaje.fecha,
      });
      const anteriores = resultado.mensajes.map((mensaje) =>
        adaptarMensaje(mensaje, usuarioId)
      );
      setMensajes((actuales) => unirMensajes(anteriores, actuales));
      setHayMasMensajes(resultado.hayMas);
      requestAnimationFrame(() => {
        const contenedor = cuerpoChatRef.current;
        if (contenedor) {
          contenedor.scrollTop =
            posicionAnterior + contenedor.scrollHeight - alturaAnterior;
        }
      });
    } catch (error) {
      setErrorMensajes(error.message);
    } finally {
      setCargandoAnteriores(false);
    }
  };

  const enviarMensaje = async (evento) => {
    evento.preventDefault();
    const texto = mensajeNuevo.trim();
    if (!texto || !conversacionActiva || enviando) return;

    setEnviando(true);
    setErrorMensajes('');

    try {
      let mensaje;
      if (socketConectado && socketRef.current?.connected) {
        mensaje = await new Promise((resolve, reject) => {
          socketRef.current
            .timeout(10000)
            .emit(
              'mensaje:enviar',
              { conversacion: conversacionActiva, texto },
              (error, respuesta) => {
                if (error) {
                  reject(new Error('El servidor no confirmó el envío del mensaje.'));
                } else if (!respuesta?.ok) {
                  reject(new Error(respuesta?.error || 'No se pudo enviar el mensaje.'));
                } else {
                  resolve(respuesta.mensaje);
                }
              }
            );
        });
      } else {
        mensaje = await enviarMensajeChat(conversacionActiva, texto);
      }

      const mensajeAdaptado = adaptarMensaje(mensaje, usuarioId);
      setMensajes((actuales) => unirMensajes(actuales, [mensajeAdaptado]));
      setConversaciones((actuales) =>
        actuales.map((item) =>
          item.id === conversacionActiva
            ? {
                ...item,
                ultimoMensaje: mensaje.texto,
                hora: mostrarFechaConversacion(mensaje.createdAt),
                actualizada: mensaje.createdAt,
                noLeidos: 0,
              }
            : item
        )
      );
      setMensajeNuevo('');
    } catch (error) {
      setErrorMensajes(error.message);
    } finally {
      setEnviando(false);
    }
  };

  const renderizarMensajes = () => {
    let ultimaEtiqueta = '';

    return mensajes.map((mensaje) => {
      const etiqueta = etiquetaDia(mensaje.fecha);
      const mostrarSeparador = etiqueta !== ultimaEtiqueta;
      ultimaEtiqueta = etiqueta;

      return (
        <div key={mensaje.id}>
          {mostrarSeparador && <div className="mensajes__dia">{etiqueta}</div>}
          <div className={`mensajes__fila mensajes__fila--${mensaje.tipo}`}>
            <div className={`mensajes__burbuja mensajes__burbuja--${mensaje.tipo}`}>
              <p>{mensaje.texto}</p>
              <span>
                {mensaje.hora}
                {mensaje.tipo === 'enviado' && (
                  <span className="mensajes__checks"> ✓✓</span>
                )}
              </span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="mensajes-layout">
      <Sidebar paginaActiva="Mensajes" onNavegar={onNavegar} />

      <div className="mensajes-contenido">
        <Navbar titulo="Mensajes" onNavegar={onNavegar} />

        <main className="mensajes-main">
          <aside className="mensajes__panel">
            <div className="mensajes__panel-encabezado">
              <h1>Mensajes</h1>

              <div className="mensajes__buscador">
                <span aria-hidden="true">⌕</span>
                <input
                  type="text"
                  placeholder="Buscar conversación..."
                  value={busqueda}
                  onChange={(evento) => setBusqueda(evento.target.value)}
                />
              </div>
            </div>

            <div className="mensajes__conversaciones" aria-live="polite">
              {cargandoConversaciones ? (
                <p className="mensajes__sin-resultados" role="status">
                  Cargando conversaciones…
                </p>
              ) : errorConversaciones ? (
                <p className="mensajes__estado-error" role="alert">
                  {errorConversaciones}
                </p>
              ) : conversacionesFiltradas.length ? (
                conversacionesFiltradas.map((conversacion) => (
                  <button
                    type="button"
                    key={conversacion.id}
                    className={`mensajes__conversacion ${
                      conversacionActiva === conversacion.id
                        ? 'mensajes__conversacion--activa'
                        : ''
                    }`}
                    onClick={() => seleccionarConversacion(conversacion.id)}
                  >
                    <span className="mensajes__avatar">
                      {conversacion.iniciales}
                    </span>

                    <span className="mensajes__resumen">
                      <span className="mensajes__resumen-superior">
                        <strong>{conversacion.tutor}</strong>
                        <span>{conversacion.hora}</span>
                      </span>
                      <span className="mensajes__ultimo">
                        {conversacion.ultimoMensaje}
                      </span>
                    </span>

                    {conversacion.noLeidos > 0 && (
                      <span
                        className="mensajes__no-leido"
                        aria-label={`${conversacion.noLeidos} mensajes sin leer`}
                      />
                    )}
                  </button>
                ))
              ) : (
                <p className="mensajes__sin-resultados">
                  {busqueda
                    ? 'No se encontraron conversaciones.'
                    : 'Todavía no tienes conversaciones.'}
                </p>
              )}
            </div>
          </aside>

          <section className="mensajes__chat">
            {chatActivo ? (
              <>
                <header className="mensajes__chat-encabezado">
                  <div className="mensajes__tutor">
                    <span className="mensajes__avatar">
                      {chatActivo.iniciales}
                    </span>
                    <div>
                      <h2>{chatActivo.tutor}</h2>
                      <span
                        className={`mensajes__en-linea ${
                          socketConectado
                            ? ''
                            : 'mensajes__estado-conexion--desconectado'
                        }`}
                        aria-live="polite"
                      >
                        <span />
                        {socketConectado
                          ? 'Conectado'
                          : 'Sin conexión en tiempo real'}
                      </span>
                    </div>
                  </div>

                  <div className="mensajes__chat-acciones">
                    {chatActivo.tipo === 'grupo' ? (
                      <button type="button" onClick={verTutoria}>
                        Ver monitoría
                      </button>
                    ) : chatActivo.tipoPersona === 'tutor' ? (
                      <>
                        <button type="button" onClick={verPerfilTutor}>
                          Ver perfil
                        </button>
                        <button type="button" onClick={verTutoria}>
                          Ver tutoría
                        </button>
                      </>
                    ) : null}
                  </div>
                </header>

                {errorTiempoReal && (
                  <p
                    className="mensajes__alerta-conexion"
                    role="status"
                    title={errorTiempoReal}
                  >
                    El chat en tiempo real no está disponible. Los mensajes se
                    enviarán mediante el servidor.
                  </p>
                )}

                <div
                  className="mensajes__chat-cuerpo"
                  ref={cuerpoChatRef}
                  aria-live="polite"
                >
                  {hayMasMensajes && (
                    <button
                      type="button"
                      className="mensajes__cargar-anteriores"
                      onClick={cargarMensajesAnteriores}
                      disabled={cargandoAnteriores}
                    >
                      {cargandoAnteriores
                        ? 'Cargando…'
                        : 'Cargar mensajes anteriores'}
                    </button>
                  )}
                  {cargandoMensajes ? (
                    <p className="mensajes__estado-chat" role="status">
                      Cargando mensajes…
                    </p>
                  ) : errorMensajes ? (
                    <p className="mensajes__estado-chat mensajes__estado-error" role="alert">
                      {errorMensajes}
                    </p>
                  ) : mensajes.length ? (
                    renderizarMensajes()
                  ) : (
                    <p className="mensajes__estado-chat">
                      Todavía no hay mensajes en esta conversación.
                    </p>
                  )}
                  {escribiendo && (
                    <p className="mensajes__escribiendo" role="status">
                      {escribiendo} está escribiendo…
                    </p>
                  )}
                </div>

                <form className="mensajes__envio" onSubmit={enviarMensaje}>
                  <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={mensajeNuevo}
                    onChange={(evento) => {
                      setMensajeNuevo(evento.target.value);
                      notificarEscribiendo();
                    }}
                    maxLength={2000}
                    aria-label="Escribe un mensaje"
                  />
                  <button
                    type="submit"
                    aria-label="Enviar mensaje"
                    disabled={!mensajeNuevo.trim() || enviando || cargandoMensajes}
                  >
                    <span aria-hidden="true">➤</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="mensajes__estado-chat">
                {cargandoConversaciones
                  ? 'Cargando conversaciones…'
                  : 'Selecciona una conversación para ver los mensajes.'}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Mensajes;
