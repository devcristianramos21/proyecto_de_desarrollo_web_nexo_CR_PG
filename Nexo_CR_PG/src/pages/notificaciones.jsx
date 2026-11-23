
import { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './notificaciones.css';

const notificacionesIniciales = [
  {
    id: 1,
    tipo: 'recordatorio',
    titulo: 'Recordatorio de tutoría',
    descripcion: 'Tu tutoría de Cálculo diferencial empieza en 30 minutos.',
    tiempo: 'Hace 5 min',
    accion: 'Ver tutoría',
    destino: 'Mis monitorias',
    leida: false,
  },
  {
    id: 2,
    tipo: 'aceptada',
    titulo: 'Solicitud aceptada',
    descripcion: 'Tu solicitud de tutoría de Programación I fue aceptada por el tutor.',
    tiempo: 'Hace 2 h',
    accion: 'Ver solicitud',
    destino: 'Mis solicitudes',
    leida: false,
  },
  {
    id: 3,
    tipo: 'propuesta',
    titulo: 'Propuesta por confirmar',
    descripcion: 'Tienes un horario propuesto que vence en 2 horas. Responde pronto.',
    tiempo: 'Hace 3 h',
    accion: 'Ver propuesta',
    destino: 'Mis solicitudes',
    leida: false,
  },
  {
    id: 4,
    tipo: 'mensaje',
    titulo: 'Nuevo mensaje',
    descripcion: 'Nombre del tutor te envió un mensaje sobre la tutoría del jueves.',
    tiempo: 'Hace 5 h',
    accion: 'Abrir chat',
    destino: 'Mensajes',
    leida: true,
  },
  {
    id: 5,
    tipo: 'completada',
    titulo: 'Tutoría completada',
    descripcion: 'Tu sesión de Álgebra lineal fue completada. ¿Cómo estuvo la experiencia?',
    tiempo: 'Ayer',
    accion: 'Dejar reseña',
    destino: 'Mis monitorias',
    leida: true,
  },
  {
    id: 6,
    tipo: 'rechazada',
    titulo: 'Solicitud rechazada',
    descripcion: 'Tu solicitud de tutoría de Estadística fue rechazada por el tutor.',
    tiempo: 'Hace 2 días',
    accion: 'Buscar otro tutor',
    destino: 'Buscar tutores',
    leida: true,
  },
  {
    id: 7,
    tipo: 'coincidencia',
    titulo: 'Nueva coincidencia',
    descripcion: 'Encontramos 3 tutores disponibles para Física I que coinciden con tu horario.',
    tiempo: 'Hace 3 días',
    accion: 'Ver tutores',
    destino: 'Buscar tutores',
    leida: true,
  },
];

const iconos = {
  recordatorio: '◷',
  aceptada: '✓',
  propuesta: '⚠',
  mensaje: '▱',
  completada: '✓',
  rechazada: '×',
  coincidencia: '☆',
};

export default function Notificaciones({ onNavegar }) {
  const [notificaciones, setNotificaciones] = useState(
    notificacionesIniciales
  );

  const noLeidas = notificaciones.filter(
    (notificacion) => !notificacion.leida
  );

  const anteriores = notificaciones.filter(
    (notificacion) => notificacion.leida
  );

  const marcarTodasComoLeidas = () => {
    setNotificaciones((actuales) =>
      actuales.map((notificacion) => ({
        ...notificacion,
        leida: true,
      }))
    );
  };

  const abrirNotificacion = (notificacion) => {
    setNotificaciones((actuales) =>
      actuales.map((actual) =>
        actual.id === notificacion.id
          ? { ...actual, leida: true }
          : actual
      )
    );

    if (notificacion.destino) {
      onNavegar?.(notificacion.destino);
    }
  };

  const renderNotificacion = (notificacion) => (
    <article
      className={`notificacion-item ${
        notificacion.leida
          ? 'notificacion-item--leida'
          : 'notificacion-item--no-leida'
      }`}
      key={notificacion.id}
    >
      <div
        className={`notificacion-icono notificacion-icono--${notificacion.tipo}`}
      >
        {iconos[notificacion.tipo]}
      </div>

      <div className="notificacion-informacion">
        <h3>{notificacion.titulo}</h3>
        <p>{notificacion.descripcion}</p>

        <div className="notificacion-meta">
          <span>{notificacion.tiempo}</span>

          <button
            type="button"
            onClick={() => abrirNotificacion(notificacion)}
          >
            {notificacion.accion} <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {!notificacion.leida && (
        <span
          className="notificacion-punto"
          aria-label="Notificación sin leer"
        />
      )}
    </article>
  );

  return (
    <div className="notificaciones-page">
      <Sidebar
        paginaActiva="Notificaciones"
        onNavegar={onNavegar}
      />

      <main className="notificaciones-principal">
        <Navbar titulo="Notificaciones" onNavegar={onNavegar} />

        <div className="notificaciones-contenido">

          {/* ENCABEZADO */}

          <header className="notificaciones-encabezado">
            <div>
              <h1>Notificaciones</h1>
              <p>{noLeidas.length} sin leer</p>
            </div>

            <button
              type="button"
              className="notificaciones-marcar"
              onClick={marcarTodasComoLeidas}
              disabled={noLeidas.length === 0}
            >
              Marcar todo como leído
            </button>
          </header>

          {/* SIN LEER */}

          {noLeidas.length > 0 && (
            <section className="notificaciones-seccion">
              <h2>SIN LEER</h2>

              <div className="notificaciones-lista notificaciones-lista--no-leidas">
                {noLeidas.map(renderNotificacion)}
              </div>
            </section>
          )}

          {/* ANTERIORES */}

          <section className="notificaciones-seccion notificaciones-seccion--anteriores">
            <h2>ANTERIORES</h2>

            {anteriores.length > 0 ? (
              <div className="notificaciones-lista notificaciones-lista--anteriores">
                {anteriores.map(renderNotificacion)}
              </div>
            ) : (
              <div className="notificaciones-vacias">
                Todavía no tienes notificaciones anteriores.
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
