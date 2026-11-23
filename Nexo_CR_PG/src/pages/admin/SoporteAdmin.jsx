import { useState } from 'react';
import AdminShell from './AdminShell';
import './soporteAdmin.css';

export default function SoporteAdmin({
  onNavegar,
  tickets = [],
  onActualizarTicket,
}) {
  const [ticketDetalle, setTicketDetalle] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const pendientes = tickets.filter((ticket) => ticket.estado === 'Pendiente').length;
  const enRevision = tickets.filter((ticket) => ticket.estado === 'En revisión').length;

  const actualizarEstado = (ticket, estado) => {
    onActualizarTicket?.({ ...ticket, estado });
    setMensaje(`El caso «${ticket.titulo}» está ${estado.toLowerCase()}.`);
    window.setTimeout(() => setMensaje(''), 3500);
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
          <article className="admin-card admin-kpi admin-kpi--orange"><strong>2</strong><span>Pendientes</span></article>
          <article className="admin-card admin-kpi admin-kpi--blue"><strong>{enRevision}</strong><span>En revisión</span></article>
          <article className="admin-card admin-kpi admin-kpi--green"><strong>1</strong><span>Resueltos este mes</span></article>
          <article className="admin-card admin-kpi"><strong>1.2</strong><span>Días promedio<br />respuesta</span></article>
        </section>

        <section className="soporte-admin__lista" aria-live="polite">
          {tickets.map((ticket) => (
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
                <button type="button" className="admin-secondary-button" onClick={() => setTicketDetalle(ticket)}>Ver</button>
                {ticket.estado === 'Pendiente' && (
                  <button type="button" className="admin-primary-button" onClick={() => actualizarEstado(ticket, 'En revisión')}>Tomar caso</button>
                )}
                {ticket.estado === 'En revisión' && (
                  <button type="button" className="admin-text-button" onClick={() => actualizarEstado(ticket, 'Resuelto')}>Resolver</button>
                )}
              </div>
            </article>
          ))}
          {tickets.length === 0 && <p className="soporte-admin__vacio">No hay solicitudes de soporte pendientes.</p>}
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
            </dl>
            <button type="button" className="admin-primary-button" onClick={() => setTicketDetalle(null)}>Cerrar</button>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
