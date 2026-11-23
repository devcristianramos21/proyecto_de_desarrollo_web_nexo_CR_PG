import { useMemo, useState } from 'react';
import AdminShell from './AdminShell';
import searchIcon from './assets/search.svg';
import successIcon from './assets/notification-success.svg';
import './tutoresAdmin.css';

const filtros = ['Todos', 'Pendientes', 'Activos', 'Suspendidos'];

export default function TutoresAdmin({
  onNavegar,
  tutores = [],
  onActualizarTutor,
}) {
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [tutorDetalle, setTutorDetalle] = useState(null);
  const pendientes = tutores.filter((tutor) => tutor.estado === 'Pendiente').length;

  const filtrados = useMemo(() => tutores.filter((tutor) => {
    const coincideTexto = tutor.nombre.toLowerCase().includes(busqueda.trim().toLowerCase());
    const coincideFiltro = filtroActivo === 'Todos'
      || (filtroActivo === 'Pendientes' && tutor.estado === 'Pendiente')
      || (filtroActivo === 'Activos' && tutor.estado === 'Activo')
      || (filtroActivo === 'Suspendidos' && tutor.estado === 'Suspendido');
    return coincideTexto && coincideFiltro;
  }), [tutores, filtroActivo, busqueda]);

  const actualizar = (tutor, estado, validado = tutor.validado) => {
    onActualizarTutor?.({ ...tutor, estado, validado });
  };

  return (
    <AdminShell titulo="Gestión de tutores y monitores" paginaActiva="Tutores admin" onNavegar={onNavegar}>
      <div className="tutores-admin">
        <header className="admin-page-header tutores-admin__encabezado">
          <div>
            <h1>Tutores y monitores</h1>
            <p>Gestión y validación del cuerpo de tutores institucionales</p>
          </div>
          <button type="button" className="admin-primary-button" onClick={() => onNavegar?.('Registrar tutor admin')}>+ Registrar tutor</button>
        </header>

        <nav className="tutores-admin__tabs" aria-label="Filtrar tutores">
          {filtros.map((filtro) => (
            <button type="button" key={filtro} className={filtroActivo === filtro ? 'tutores-admin__tab tutores-admin__tab--activa' : 'tutores-admin__tab'} onClick={() => setFiltroActivo(filtro)}>
              {filtro}
              {filtro === 'Pendientes' && pendientes > 0 && <span>{pendientes}</span>}
            </button>
          ))}
        </nav>

        <label className="tutores-admin__busqueda">
          <img className="tutores-admin__busqueda-icono" src={searchIcon} alt="" />
          <input type="search" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder="Buscar por nombre..." aria-label="Buscar tutor por nombre" />
        </label>

        <section className="tutores-admin__lista" aria-live="polite">
          {filtrados.map((tutor) => (
            <article className="tutores-admin__tarjeta admin-card" key={tutor.id}>
              <span className={`tutores-admin__avatar tutores-admin__avatar--${tutor.estado.toLowerCase()}`}>{tutor.iniciales}</span>
              <div className="tutores-admin__informacion">
                <div className="tutores-admin__titulo">
                  <strong>{tutor.nombre}</strong>
                  <span className="tutores-admin__chip tutores-admin__chip--rol">{tutor.rol}</span>
                  <span className={`tutores-admin__chip tutores-admin__chip--${tutor.estado.toLowerCase()}`}>{tutor.estado}</span>
                  {tutor.validado && (
                    <span className="tutores-admin__chip tutores-admin__chip--validado">
                      <img src={successIcon} alt="" />
                      Validado UR
                    </span>
                  )}
                </div>
                <p>{tutor.programa} · {tutor.semestre} · Desde {tutor.desde}</p>
                <div className="tutores-admin__materias">
                  {tutor.materias.map((materia) => <span key={materia}>{materia}</span>)}
                </div>
              </div>
              <div className="tutores-admin__actividad">
                <strong>{tutor.sesiones} sesiones</strong>
                {tutor.calificacion && <span>★ {tutor.calificacion}</span>}
              </div>
              <div className="tutores-admin__acciones">
                <button type="button" className="admin-secondary-button" onClick={() => setTutorDetalle(tutor)}>Ver</button>
                {tutor.estado === 'Pendiente' && (
                  <>
                    <button type="button" className="admin-primary-button" onClick={() => actualizar(tutor, 'Activo', true)}>Validar</button>
                    <button type="button" className="tutores-admin__rechazar" onClick={() => actualizar(tutor, 'Rechazado', false)}>Rechazar</button>
                  </>
                )}
                {tutor.estado === 'Activo' && <button type="button" className="admin-text-button" onClick={() => actualizar(tutor, 'Suspendido')}>Suspender</button>}
                {tutor.estado === 'Suspendido' && <button type="button" className="admin-text-button" onClick={() => actualizar(tutor, 'Activo')}>Reactivar</button>}
              </div>
            </article>
          ))}
          {filtrados.length === 0 && <p className="tutores-admin__vacio">No se encontraron tutores.</p>}
        </section>
      </div>

      {tutorDetalle && (
        <div className="tutores-admin__overlay" onMouseDown={(evento) => evento.target === evento.currentTarget && setTutorDetalle(null)}>
          <section className="tutores-admin__modal admin-card" role="dialog" aria-modal="true" aria-labelledby="tutores-admin-detalle-titulo">
            <button type="button" className="tutores-admin__cerrar" aria-label="Cerrar detalle" onClick={() => setTutorDetalle(null)}>×</button>
            <span className="tutores-admin__avatar">{tutorDetalle.iniciales}</span>
            <h2 id="tutores-admin-detalle-titulo">{tutorDetalle.nombre}</h2>
            <p>{tutorDetalle.programa} · {tutorDetalle.semestre}</p>
            <dl>
              <div><dt>Rol</dt><dd>{tutorDetalle.rol}</dd></div>
              <div><dt>Estado</dt><dd>{tutorDetalle.estado}</dd></div>
              <div><dt>Materias</dt><dd>{tutorDetalle.materias.join(', ')}</dd></div>
            </dl>
            <button type="button" className="admin-primary-button" onClick={() => setTutorDetalle(null)}>Cerrar</button>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
