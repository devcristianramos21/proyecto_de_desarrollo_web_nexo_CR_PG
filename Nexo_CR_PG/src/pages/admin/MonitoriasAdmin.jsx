import { useMemo, useState } from 'react';
import AdminShell from './AdminShell';
import warningIcon from './assets/warning.svg';
import './monitoriasAdmin.css';

const filtros = ['Todas', 'Obligatoria', 'Par', 'Pre-parcial'];

export default function MonitoriasAdmin({
  onNavegar,
  monitorias = [],
  onActualizarMonitoria,
}) {
  const [filtroActivo, setFiltroActivo] = useState('Todas');
  const [detalleAbierto, setDetalleAbierto] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const filtradas = useMemo(() => (
    filtroActivo === 'Todas'
      ? monitorias
      : monitorias.filter((monitoria) => monitoria.tipo === filtroActivo)
  ), [monitorias, filtroActivo]);

  const deBajoUmbral = monitorias.filter(
    (monitoria) => monitoria.inscritos < monitoria.minimo
  ).length;

  const notificar = (monitoria) => {
    onActualizarMonitoria?.({ ...monitoria, notificada: true });
    setMensaje(`Estudiantes notificados para ${monitoria.titulo}.`);
    window.setTimeout(() => setMensaje(''), 3500);
  };

  return (
    <AdminShell titulo="Gestión de monitorías" paginaActiva="Monitorias" onNavegar={onNavegar}>
      <div className="monitorias-admin">
        <header className="admin-page-header monitorias-admin__encabezado">
          <div>
            <h1>Gestión de monitorías</h1>
            <p>Monitorías obligatorias, por pares y pre-parciales — Semestre 2026-2</p>
          </div>
          <button type="button" className="admin-primary-button" onClick={() => onNavegar?.('Crear monitoria admin')}>
            + Crear monitoría
          </button>
        </header>

        {deBajoUmbral > 0 && (
          <div className="admin-alert monitorias-admin__alerta">
            <span aria-hidden="true"><img src={warningIcon} alt="" /></span>
            <div>
              <strong>{deBajoUmbral} monitoría{deBajoUmbral === 1 ? '' : 's'} bajo el umbral mínimo de inscripción</strong>
              <p>Se cancelará automáticamente si no se alcanza el mínimo 48 horas antes de la sesión.</p>
            </div>
          </div>
        )}

        <nav className="monitorias-admin__tabs" aria-label="Filtrar monitorías">
          {filtros.map((filtro) => (
            <button
              type="button"
              key={filtro}
              className={filtroActivo === filtro ? 'monitorias-admin__tab monitorias-admin__tab--activa' : 'monitorias-admin__tab'}
              onClick={() => setFiltroActivo(filtro)}
            >
              {filtro}
            </button>
          ))}
        </nav>

        <section className="monitorias-admin__lista" aria-live="polite">
          {filtradas.map((monitoria) => {
            const porcentaje = monitoria.cupo
              ? Math.min((monitoria.inscritos / monitoria.cupo) * 100, 100)
              : 0;
            const bajoUmbral = monitoria.inscritos < monitoria.minimo;

            return (
              <article className="monitorias-admin__tarjeta admin-card" key={monitoria.id}>
                <div className="monitorias-admin__principal">
                  <div className="monitorias-admin__informacion">
                    <div className="monitorias-admin__titulo">
                      <strong>{monitoria.titulo}</strong>
                      <span className={`monitorias-admin__chip monitorias-admin__chip--${monitoria.tipo.toLowerCase().replace('-', '')}`}>
                        {monitoria.tipo}
                      </span>
                      <span className={`monitorias-admin__chip monitorias-admin__chip--estado-${monitoria.estado.toLowerCase().replaceAll(' ', '-')}`}>
                        {monitoria.estado}
                      </span>
                      {bajoUmbral && (
                        <span className="monitorias-admin__umbral">
                          <img src={warningIcon} alt="" />
                          {monitoria.inscritos}/{monitoria.minimo} mínimo
                        </span>
                      )}
                    </div>
                    <p>Tutor: {monitoria.tutor} · {monitoria.programa} · {monitoria.horario}</p>
                    <div className="monitorias-admin__progreso">
                      <span><i style={{ width: `${porcentaje}%` }} /></span>
                      <small>{monitoria.inscritos} / {monitoria.cupo} inscritos ({porcentaje}%)</small>
                    </div>
                  </div>
                  <div className="monitorias-admin__acciones">
                    <button
                      type="button"
                      className="admin-secondary-button"
                      aria-expanded={detalleAbierto === monitoria.id}
                      onClick={() => setDetalleAbierto((id) => id === monitoria.id ? null : monitoria.id)}
                    >
                      {detalleAbierto === monitoria.id ? 'Ocultar detalle' : 'Ver detalle'}
                    </button>
                    {bajoUmbral && (
                      <button
                        type="button"
                        className="admin-text-button"
                        onClick={() => notificar(monitoria)}
                      >
                        {monitoria.notificada ? 'Notificados' : 'Notificar estudiantes'}
                      </button>
                    )}
                  </div>
                </div>
                {detalleAbierto === monitoria.id && (
                  <dl className="monitorias-admin__detalle">
                    <div><dt>Fecha</dt><dd>{monitoria.fecha || monitoria.horario}</dd></div>
                    <div><dt>Modalidad</dt><dd>{monitoria.modalidad || 'Por definir'}</dd></div>
                    <div><dt>Umbral mínimo</dt><dd>{monitoria.minimo} estudiantes</dd></div>
                  </dl>
                )}
              </article>
            );
          })}
          {filtradas.length === 0 && <p className="monitorias-admin__vacio">No hay monitorías en esta categoría.</p>}
        </section>
        {mensaje && <div className="admin-toast" role="status">{mensaje}</div>}
      </div>
    </AdminShell>
  );
}
