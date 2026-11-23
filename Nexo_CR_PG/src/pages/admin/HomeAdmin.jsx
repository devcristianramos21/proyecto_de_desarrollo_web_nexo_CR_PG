import AdminShell from './AdminShell';
import warningIcon from './assets/warning.svg';
import bookIcon from './assets/book.svg';
import calendarIcon from './assets/calendar.svg';
import './homeAdmin.css';

const alertas = [
  {
    icono: 'alerta',
    texto: 'La monitoría de Cálculo Diferencial (pre-parcial) tiene solo 3 inscritos de 10 requeridos. Parcial en 5 días.',
    accion: 'Ver detalle',
    destino: 'Monitorias admin',
  },
  {
    icono: 'solicitud',
    texto: '3 tutores nuevos esperan validación institucional.',
    accion: 'Ver detalle',
    destino: 'Tutores admin',
  },
  {
    icono: 'calendario',
    texto: 'Faltan 2 semanas para los parciales de Semana 8. ¿Deseas crear monitorías pre-examen?',
    accion: 'Ver detalle',
    destino: 'Calendario Admin',
  },
];

export default function HomeAdmin({ onNavegar }) {
  return (
    <AdminShell
      titulo="Inicio"
      paginaActiva="Home Admin"
      onNavegar={onNavegar}
      mostrarRegreso={false}
    >
      <div className="home-admin">
        <section className="home-admin__bienvenida admin-card">
          <div>
            <span className="home-admin__eyebrow">PANEL INSTITUCIONAL</span>
            <h1>Bienvenido, Administrador</h1>
            <p>Semestre 2026-2 · Universidad del Rosario</p>
          </div>
          <div className="home-admin__acciones">
            <button type="button" className="admin-primary-button" onClick={() => onNavegar?.('Registrar tutor admin')}>
              + Registrar tutor
            </button>
            <button type="button" className="admin-primary-button" onClick={() => onNavegar?.('Crear monitoria admin')}>
              + Nueva monitoría
            </button>
            <button type="button" className="admin-primary-button" onClick={() => onNavegar?.('Agregar parcial Admin')}>
              + Agregar parcial
            </button>
          </div>
        </section>

        <section className="admin-kpis home-admin__kpis" aria-label="Resumen institucional">
          <article className="admin-card admin-kpi">
            <strong>47</strong>
            <span>Tutores activos</span>
          </article>
          <article className="admin-card admin-kpi admin-kpi--gold">
            <strong>12</strong>
            <span>Monitorías activas</span>
          </article>
          <article className="admin-card admin-kpi admin-kpi--orange">
            <strong>8</strong>
            <span>Solicitudes pendientes</span>
          </article>
          <article className="admin-card admin-kpi admin-kpi--green">
            <strong>1.284</strong>
            <span>Estudiantes registrados</span>
          </article>
        </section>

        <div className="home-admin__paneles">
          <section className="home-admin__alertas">
            <h2 className="admin-section-label">ALERTAS QUE REQUIEREN ATENCIÓN</h2>
            {alertas.map((alerta) => (
              <article
                className={`home-admin__alerta home-admin__alerta--${alerta.icono}`}
                key={alerta.texto}
              >
                <span className="home-admin__alerta-icono" aria-hidden="true">
                  <img
                    src={alerta.icono === 'alerta' ? warningIcon : alerta.icono === 'solicitud' ? bookIcon : calendarIcon}
                    alt=""
                  />
                </span>
                <div>
                  <p>{alerta.texto}</p>
                  <button type="button" className="admin-secondary-button" onClick={() => onNavegar?.(alerta.destino)}>
                    {alerta.accion}
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="home-admin__rapidas">
            <h2 className="admin-section-label">ACCIONES RÁPIDAS</h2>
            <button type="button" className="home-admin__accion-rapida" onClick={() => onNavegar?.('Tutores admin')}>
              <strong className="home-admin__accion-numero">3</strong>
              <span>Tutores pendientes de validar</span>
            </button>
            <button type="button" className="home-admin__accion-rapida" onClick={() => onNavegar?.('Calendario Admin')}>
              <strong className="home-admin__flecha">→</strong>
              <span>Ver calendario de parciales</span>
            </button>
            <button type="button" className="home-admin__accion-rapida" onClick={() => onNavegar?.('Reportes admin')}>
              <strong className="home-admin__flecha home-admin__flecha--oro">→</strong>
              <span>Generar reporte del semestre</span>
            </button>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
