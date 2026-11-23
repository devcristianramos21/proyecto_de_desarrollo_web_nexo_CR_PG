import { useEffect, useState } from 'react';
import AdminShell from './AdminShell';
import {
  listarNotificaciones,
  marcarNotificacionLeida,
  marcarTodasLasNotificacionesLeidas,
} from '../../services/modulosIntegrados';
import infoOutlineIcon from './assets/notification-info-outline.svg';
import infoMarkIcon from './assets/notification-info-mark.svg';
import infoDotIcon from './assets/notification-info-dot.svg';
import successIcon from './assets/notification-success.svg';
import warningIcon from './assets/notification-warning.svg';
import './notificacionesAdmin.css';

function iconoNotificacion(tipo) {
  if (tipo === 'reporte') {
    return (
      <span className="notificaciones-admin__reporte-icono">
        <span className="notificaciones-admin__reporte-icono-parte notificaciones-admin__reporte-icono-parte--borde">
          <img src={infoOutlineIcon} alt="" />
        </span>
        <span className="notificaciones-admin__reporte-icono-parte notificaciones-admin__reporte-icono-parte--marca">
          <img src={infoMarkIcon} alt="" />
        </span>
        <span className="notificaciones-admin__reporte-icono-parte notificaciones-admin__reporte-icono-parte--punto">
          <img src={infoDotIcon} alt="" />
        </span>
      </span>
    );
  }

  if (tipo === 'confirmacion') return <img className="notificaciones-admin__icono-imagen" src={successIcon} alt="" />;
  if (tipo === 'alerta') return <img className="notificaciones-admin__icono-imagen notificaciones-admin__icono-imagen--alerta" src={warningIcon} alt="" />;
  return null;
}

export default function NotificacionesAdmin({
  onNavegar,
}) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const noLeidas = notificaciones.filter((notificacion) => !notificacion.leida).length;
  const grupos = ['Sin leer', 'Anteriores'];

  useEffect(() => {
    let vigente = true;
    listarNotificaciones()
      .then((resultado) => {
        if (vigente) {
          setNotificaciones(resultado.map((notificacion) => ({
            ...notificacion,
            id: notificacion._id,
            tiempo: new Date(notificacion.createdAt).toLocaleString('es-CO', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
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

  const marcarTodasLeidas = async () => {
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
    if (notificacion.destino) onNavegar?.(notificacion.destino);
  };

  return (
    <AdminShell titulo="Notificaciones" paginaActiva="Notificaciones Admin" onNavegar={onNavegar}>
      <div className="notificaciones-admin">
        {error && <p role="alert">{error}</p>}
        <header className="notificaciones-admin__encabezado">
          <div>
            <h1>Notificaciones</h1>
            <p>{noLeidas} sin leer</p>
          </div>
          <button type="button" className="admin-text-button" disabled={noLeidas === 0 || cargando} onClick={marcarTodasLeidas}>
            Marcar todo como leído
          </button>
        </header>

        {cargando && <p role="status">Cargando notificaciones…</p>}
        {grupos.map((grupo) => {
          const items = notificaciones.filter((notificacion) =>
            grupo === 'Sin leer' ? !notificacion.leida : notificacion.leida
          );
          if (items.length === 0) return null;

          return (
            <section className="notificaciones-admin__grupo" key={grupo}>
              <h2>{grupo.toUpperCase()}</h2>
              <div className={grupo === 'Sin leer' ? 'notificaciones-admin__lista notificaciones-admin__lista--no-leidas' : 'notificaciones-admin__lista'}>
                {items.map((notificacion) => (
                  <article className="notificaciones-admin__fila" key={notificacion.id}>
                    <span className={`notificaciones-admin__icono notificaciones-admin__icono--${notificacion.tipo}`} aria-hidden="true">
                      {iconoNotificacion(notificacion.tipo)}
                    </span>
                    <button
                      type="button"
                      className="notificaciones-admin__contenido"
                      onClick={() => abrirNotificacion(notificacion)}
                    >
                      <strong>{notificacion.titulo}</strong>
                      <span>{notificacion.descripcion}</span>
                      <small>{notificacion.tiempo}</small>
                      {notificacion.accion && <b>{notificacion.accion} →</b>}
                    </button>
                    {!notificacion.leida && <i className="notificaciones-admin__punto" aria-label="No leída" />}
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AdminShell>
  );
}
