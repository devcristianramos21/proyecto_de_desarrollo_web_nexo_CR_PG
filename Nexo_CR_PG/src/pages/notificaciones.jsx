
import { useEffect, useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import {
  listarNotificaciones,
  marcarNotificacionLeida,
  marcarTodasLasNotificacionesLeidas,
} from '../services/modulosIntegrados';
import './notificaciones.css';

const iconos = {
  recordatorio: '◷',
  aceptada: '✓',
  propuesta: '⚠',
  mensaje: '▱',
  completada: '✓',
  rechazada: '×',
  coincidencia: '☆',
  alerta: '⚠',
  confirmacion: '✓',
};

function tiempoRelativo(fecha) {
  const minutos = Math.max(0, Math.floor((Date.now() - new Date(fecha).getTime()) / 60000));
  if (minutos < 1) return 'Ahora';
  if (minutos < 60) return `Hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  return dias === 1 ? 'Ayer' : `Hace ${dias} días`;
}

export default function Notificaciones({ onNavegar }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    listarNotificaciones()
      .then((resultado) => {
        if (vigente) {
          setNotificaciones(resultado.map((notificacion) => ({
            ...notificacion,
            id: notificacion._id,
            tiempo: tiempoRelativo(notificacion.createdAt),
          })));
        }
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

  const noLeidas = notificaciones.filter(
    (notificacion) => !notificacion.leida
  );

  const anteriores = notificaciones.filter(
    (notificacion) => notificacion.leida
  );

  const marcarTodasComoLeidas = async () => {
    setError('');
    try {
      await marcarTodasLasNotificacionesLeidas();
      setNotificaciones((actuales) => actuales.map((notificacion) => ({
        ...notificacion,
        leida: true,
      })));
    } catch (errorApi) {
      setError(errorApi.message);
    }
  };

  const abrirNotificacion = async (notificacion) => {
    if (!notificacion.leida) {
      setError('');
      try {
        await marcarNotificacionLeida(notificacion.id);
        setNotificaciones((actuales) => actuales.map((actual) =>
          actual.id === notificacion.id ? { ...actual, leida: true } : actual
        ));
      } catch (errorApi) {
        setError(errorApi.message);
        return;
      }
    }

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
          {error && <p role="alert">{error}</p>}

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

          {cargando ? (
            <p role="status">Cargando notificaciones…</p>
          ) : noLeidas.length > 0 && (
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
