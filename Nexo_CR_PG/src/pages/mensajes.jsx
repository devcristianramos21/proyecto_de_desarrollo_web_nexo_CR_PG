
import { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './mensajes.css';

export const conversacionesIniciales = [
  {
    id: 1,
    tutor: 'Nombre del tutor',
    hora: '10:03 AM',
    ultimoMensaje: 'Sí, nos vemos en el horario acordado.',
    noLeidos: true,
    mensajes: [
      {
        id: 1,
        texto: 'Hola, ¿podemos confirmar la tutoría para el jueves?',
        hora: '10:00 AM',
        tipo: 'recibido',
      },
      {
        id: 2,
        texto: '¡Hola! Sí, el jueves a las 3 PM me queda perfecto.',
        hora: '10:01 AM',
        tipo: 'enviado',
      },
      {
        id: 3,
        texto: 'Excelente. Nos conectamos por la plataforma que acordamos.',
        hora: '10:02 AM',
        tipo: 'recibido',
      },
      {
        id: 4,
        texto: 'Sí, nos vemos en el horario acordado.',
        hora: '10:03 AM',
        tipo: 'enviado',
      },
      {
        id: 5,
        texto: 'Perfecto, allí estaré puntual. ¿Tienes alguna duda específica que quieras que prepare?',
        hora: '10:04 AM',
        tipo: 'recibido',
      },
      {
        id: 6,
        texto: 'Sí, principalmente en integrales por partes y cambio de variable.',
        hora: '10:06 AM',
        tipo: 'enviado',
      },
      {
        id: 7,
        texto: 'Entendido, prepararé ejercicios de esos temas. ¡Hasta el jueves!',
        hora: '10:07 AM',
        tipo: 'recibido',
      },
    ],
  },
  {
    id: 2,
    tutor: 'Nombre del tutor',
    hora: 'Ayer',
    ultimoMensaje: '¿Tienes disponibilidad el viernes?',
    noLeidos: true,
    mensajes: [
      {
        id: 1,
        texto: 'Hola, ¿tienes disponibilidad el viernes?',
        hora: 'Ayer',
        tipo: 'recibido',
      },
    ],
  },
  {
    id: 3,
    tutor: 'Nombre del tutor',
    hora: 'Lun',
    ultimoMensaje: 'Muchas gracias por la sesión de hoy.',
    noLeidos: false,
    mensajes: [
      {
        id: 1,
        texto: 'Muchas gracias por la sesión de hoy.',
        hora: 'Lun',
        tipo: 'recibido',
      },
    ],
  },
  {
    id: 4,
    tutor: 'Nombre del tutor',
    hora: 'Sáb',
    ultimoMensaje: 'Perfecto, allí estaré puntual.',
    noLeidos: false,
    mensajes: [
      {
        id: 1,
        texto: 'Perfecto, allí estaré puntual.',
        hora: 'Sáb',
        tipo: 'recibido',
      },
    ],
  },
];

function obtenerHora() {
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date());
}

function Mensajes({
  onNavegar,
  conversaciones,
  setConversaciones,
  conversacionActiva,
  setConversacionActiva,
  tutorias = [],
  onVerPerfilTutor,
  onVerDetalleTutoria,
  onVerMonitoriaTutor,
}) {
  const [busqueda, setBusqueda] = useState('');
  const [mensajeNuevo, setMensajeNuevo] = useState('');

  const chatActivo = conversaciones.find(
    (conversacion) => conversacion.id === conversacionActiva
  );

  const conversacionesFiltradas = conversaciones.filter((conversacion) => {
    const texto = `${conversacion.tutor} ${conversacion.ultimoMensaje}`;
    return texto.toLowerCase().includes(busqueda.toLowerCase());
  });

  const seleccionarConversacion = (id) => {
    setConversacionActiva(id);

    setConversaciones((actuales) =>
      actuales.map((conversacion) =>
        conversacion.id === id
          ? { ...conversacion, noLeidos: false }
          : conversacion
      )
    );
  };

  const enviarMensaje = (evento) => {
    evento.preventDefault();

    const texto = mensajeNuevo.trim();

    if (!texto || !chatActivo) return;

    const hora = obtenerHora();

    setConversaciones((actuales) =>
      actuales.map((conversacion) =>
        conversacion.id === conversacionActiva
          ? {
              ...conversacion,
              hora,
              ultimoMensaje: texto,
              mensajes: [
                ...conversacion.mensajes,
                {
                  id: Date.now(),
                  texto,
                  hora,
                  tipo: 'enviado',
                },
              ],
            }
          : conversacion
      )
    );

    setMensajeNuevo('');
  };

  const verPerfilTutor = () => {
    if (!chatActivo || chatActivo.tipo === 'estudiante' || chatActivo.tipo === 'monitoria') {
      return;
    }

    onVerPerfilTutor?.(
      chatActivo.tutorInfo || {
        nombre: chatActivo.tutor,
        iniciales: 'NT',
      }
    );
  };

  const verTutoria = () => {
    if (!chatActivo) return;

    if (chatActivo.tipo === 'monitoria') {
      onVerMonitoriaTutor?.(chatActivo.monitoriaInfo);
      return;
    }

    if (chatActivo.tipo === 'estudiante') return;

    const tutorId = chatActivo.tutorInfo?.id;
    const tutoriasCoincidentes = tutorId != null
      ? tutorias.filter((item) => item.tutorId === tutorId)
      : tutorias.filter((item) => item.tutor === chatActivo.tutor);
    const tutoria = tutoriasCoincidentes.length === 1
      ? tutoriasCoincidentes[0]
      : null;

    if (tutoria) {
      onVerDetalleTutoria?.(tutoria);
      return;
    }

    onNavegar?.('Mis monitorias');
  };

  return (
    <div className="mensajes-layout">
      <Sidebar paginaActiva="Mensajes" onNavegar={onNavegar} />

      <div className="mensajes-contenido">
        <Navbar titulo="Mensajes" onNavegar={onNavegar} />

        <main className="mensajes-main">
          {/* Panel de conversaciones */}
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

            <div className="mensajes__conversaciones">
              {conversacionesFiltradas.map((conversacion) => (
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
                    {conversacion.iniciales || conversacion.tutorInfo?.iniciales || 'NT'}
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

                  {conversacion.noLeidos && (
                    <span className="mensajes__no-leido" />
                  )}
                </button>
              ))}

              {conversacionesFiltradas.length === 0 && (
                <p className="mensajes__sin-resultados">
                  No se encontraron conversaciones.
                </p>
              )}
            </div>
          </aside>

          {/* Panel del chat */}
          <section className="mensajes__chat">
            {chatActivo && (
              <>
                <header className="mensajes__chat-encabezado">
                  <div className="mensajes__tutor">
                    <span className="mensajes__avatar">
                      {chatActivo.iniciales || chatActivo.tutorInfo?.iniciales || 'NT'}
                    </span>

                    <div>
                      <h2>{chatActivo.tutor}</h2>
                      <span className="mensajes__en-linea">
                        <span />
                        En línea
                      </span>
                    </div>
                  </div>

                  <div className="mensajes__chat-acciones">
                    {chatActivo.tipo === 'monitoria' ? (
                      <button type="button" onClick={verTutoria}>
                        Ver monitoría
                      </button>
                    ) : chatActivo.tipo !== 'estudiante' && (
                      <>
                        <button
                          type="button"
                          onClick={verPerfilTutor}
                        >
                          Ver perfil
                        </button>

                        <button
                          type="button"
                          onClick={verTutoria}
                        >
                          Ver tutoría
                        </button>
                      </>
                    )}
                  </div>
                </header>

                <div className="mensajes__chat-cuerpo">
                  <div className="mensajes__dia">Hoy</div>

                  {chatActivo.mensajes.map((mensaje) => (
                    <div
                      key={mensaje.id}
                      className={`mensajes__fila mensajes__fila--${mensaje.tipo}`}
                    >
                      <div
                        className={`mensajes__burbuja mensajes__burbuja--${mensaje.tipo}`}
                      >
                        <p>{mensaje.texto}</p>

                        <span>
                          {mensaje.hora}
                          {mensaje.tipo === 'enviado' && (
                            <span className="mensajes__checks"> ✓✓</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  className="mensajes__envio"
                  onSubmit={enviarMensaje}
                >
                  <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={mensajeNuevo}
                    onChange={(evento) => setMensajeNuevo(evento.target.value)}
                  />

                  <button
                    type="submit"
                    aria-label="Enviar mensaje"
                    disabled={!mensajeNuevo.trim()}
                  >
                    <span aria-hidden="true">➤</span>
                  </button>
                </form>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Mensajes;
