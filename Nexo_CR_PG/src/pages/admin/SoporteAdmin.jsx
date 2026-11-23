import { useEffect, useState } from 'react';
import AdminShell from './AdminShell';
import {
  actualizarTicketSoporte,
  listarTicketsSoporte,
} from '../../services/modulosIntegrados';
import './soporteAdmin.css';

const ESTADOS_TICKET = {
  pendiente: 'Pendiente',
  en_revision: 'En revisión',
  resuelto: 'Resuelto',
};

function adaptarTicket(ticket) {
  return {
    id: ticket._id,
    numeroCaso: ticket.numeroCaso,
    titulo: ticket.asunto,
    usuario: ticket.solicitante?.nombre || 'Usuario',
    rol: ticket.solicitante?.rol === 'tutor' ? 'Tutor' : 'Estudiante',
    categoria: ticket.categoria,
    descripcion: ticket.descripcion,
    respuesta: ticket.respuesta || '',
    fecha: new Date(ticket.createdAt).toLocaleDateString('es-CO'),
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    estado: ESTADOS_TICKET[ticket.estado] || ticket.estado,
    estadoApi: ticket.estado,
  };
}

export default function SoporteAdmin({ onNavegar }) {
  const [tickets, setTickets] = useState([]);
  const [ticketDetalle, setTicketDetalle] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [hoy] = useState(() => new Date());
  const pendientes = tickets.filter((ticket) => ticket.estado === 'Pendiente').length;
  const enRevision = tickets.filter((ticket) => ticket.estado === 'En revisión').length;
  const resueltosEsteMes = tickets.filter((ticket) => {
    const fechaActualizacion = new Date(ticket.updatedAt);
    return ticket.estado === 'Resuelto'
      && fechaActualizacion.getMonth() === hoy.getMonth()
      && fechaActualizacion.getFullYear() === hoy.getFullYear();
  }).length;
  const tiemposRespuesta = tickets
    .filter((ticket) => ticket.estado === 'Resuelto')
    .map((ticket) => (
      (new Date(ticket.updatedAt) - new Date(ticket.createdAt)) / 86400000
    ))
    .filter((dias) => Number.isFinite(dias) && dias >= 0);
  const promedioRespuesta = tiemposRespuesta.length
    ? (tiemposRespuesta.reduce((total, dias) => total + dias, 0) / tiemposRespuesta.length).toFixed(1)
    : '—';

  useEffect(() => {
    let vigente = true;
    listarTicketsSoporte()
      .then((resultado) => {
        if (vigente) setTickets(resultado.map(adaptarTicket));
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

  const guardarCambios = async (ticket, cambios) => {
    setError('');
    setActualizando(true);
    try {
      const actualizado = adaptarTicket(
        await actualizarTicketSoporte(ticket.id, cambios)
      );
      setTickets((actuales) => actuales.map((actual) =>
        actual.id === actualizado.id ? actualizado : actual
      ));
      setTicketDetalle(actualizado);
      setRespuesta(actualizado.respuesta);
      setMensaje(`El caso «${actualizado.titulo}» se actualizó.`);
      window.setTimeout(() => setMensaje(''), 3500);
    } catch (errorApi) {
      setError(errorApi.message);
    } finally {
      setActualizando(false);
    }
  };

  const actualizarEstado = (ticket, estado) => {
    const estadoApi = {
      'En revisión': 'en_revision',
      Resuelto: 'resuelto',
    }[estado];
    if (estadoApi) guardarCambios(ticket, { estado: estadoApi });
  };

  const enviarRespuesta = (event) => {
    event.preventDefault();
    if (!ticketDetalle || !respuesta.trim()) return;
    guardarCambios(ticketDetalle, {
      estado: ticketDetalle.estado === 'Pendiente' ? 'en_revision' : ticketDetalle.estadoApi,
      respuesta: respuesta.trim(),
    });
  };

  return (
    <AdminShell titulo="Soporte" paginaActiva="Soporte admin" onNavegar={onNavegar}>
      <div className="soporte-admin">
        <header className="admin-page-header">
          <div>
            <h1>Centro de soporte</h1>
            <p>Gestión de solicitudes de soporte de estudiantes y tutores</p>
          </div>
        </header>

        <section className="admin-kpis soporte-admin__kpis" aria-label="Resumen de soporte">
          <article className="admin-card admin-kpi admin-kpi--orange"><strong>{pendientes}</strong><span>Pendientes</span></article>
          <article className="admin-card admin-kpi admin-kpi--blue"><strong>{enRevision}</strong><span>En revisión</span></article>
          <article className="admin-card admin-kpi admin-kpi--green"><strong>{resueltosEsteMes}</strong><span>Resueltos este mes</span></article>
          <article className="admin-card admin-kpi"><strong>{promedioRespuesta}</strong><span>Días promedio<br />respuesta</span></article>
        </section>

        {error && <p className="soporte-admin__error" role="alert">{error}</p>}
        <section className="soporte-admin__lista" aria-live="polite">
          {cargando ? <p role="status">Cargando solicitudes de soporte…</p> : tickets.map((ticket) => (
            <article className="soporte-admin__caso admin-card" key={ticket.id}>
              <div className="soporte-admin__resumen">
                <strong>{ticket.titulo}</strong>
                <div>
                  <span>{ticket.usuario}</span>
                  <span className="soporte-admin__rol">{ticket.rol}</span>
                  <span>· {ticket.categoria} · {ticket.fecha}</span>
                </div>
              </div>
              <span className={`soporte-admin__estado soporte-admin__estado--${ticket.estado.toLowerCase().replace(' ', '-')}`}>
                {ticket.estado}
              </span>
              <div className="soporte-admin__acciones">
                <button type="button" className="admin-secondary-button" onClick={() => {
                  setTicketDetalle(ticket);
                  setRespuesta(ticket.respuesta);
                }}>Ver</button>
                {ticket.estado === 'Pendiente' && (
                  <button type="button" className="admin-primary-button" onClick={() => actualizarEstado(ticket, 'En revisión')}>Tomar caso</button>
                )}
                {ticket.estado === 'En revisión' && (
                  <button type="button" className="admin-text-button" onClick={() => actualizarEstado(ticket, 'Resuelto')}>Resolver</button>
                )}
              </div>
            </article>
          ))}
          {!cargando && tickets.length === 0 && <p className="soporte-admin__vacio">No hay solicitudes de soporte pendientes.</p>}
        </section>
        {pendientes > 0 && <span className="visually-hidden">{pendientes} casos pendientes</span>}
        {mensaje && <div className="admin-toast" role="status">{mensaje}</div>}
      </div>

      {ticketDetalle && (
        <div className="soporte-admin__overlay" onMouseDown={(evento) => evento.target === evento.currentTarget && setTicketDetalle(null)}>
          <section className="soporte-admin__modal admin-card" role="dialog" aria-modal="true" aria-labelledby="soporte-admin-detalle-titulo">
            <button type="button" className="soporte-admin__cerrar" aria-label="Cerrar detalle" onClick={() => setTicketDetalle(null)}>×</button>
            <h2 id="soporte-admin-detalle-titulo">{ticketDetalle.titulo}</h2>
            <dl>
              <div><dt>Solicitante</dt><dd>{ticketDetalle.usuario} · {ticketDetalle.rol}</dd></div>
              <div><dt>Categoría</dt><dd>{ticketDetalle.categoria}</dd></div>
              <div><dt>Fecha</dt><dd>{ticketDetalle.fecha}</dd></div>
              <div><dt>Estado</dt><dd>{ticketDetalle.estado}</dd></div>
              <div><dt>Descripción</dt><dd>{ticketDetalle.descripcion}</dd></div>
            </dl>
            <form className="soporte-admin__respuesta" onSubmit={enviarRespuesta}>
              <label htmlFor="soporte-admin-respuesta">Respuesta para el solicitante</label>
              <textarea
                id="soporte-admin-respuesta"
                value={respuesta}
                onChange={(event) => setRespuesta(event.target.value)}
                maxLength={2000}
                rows={4}
              />
              <div>
                <button type="button" className="admin-secondary-button" onClick={() => setTicketDetalle(null)}>Cerrar</button>
                <button type="submit" className="admin-primary-button" disabled={actualizando || !respuesta.trim()}>
                  {actualizando ? 'Enviando…' : 'Enviar respuesta'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
