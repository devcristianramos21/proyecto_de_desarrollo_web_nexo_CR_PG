import { useState } from 'react';
import AdminShell from './AdminShell';
import warningIcon from './assets/warning.svg';
import './calendarioAdmin.css';

const formVacio = {
  asignatura: '',
  evaluacion: 'Parcial',
  semestre: '1°',
  programas: '',
  fecha: '',
  hora: '',
  lugar: '',
  notas: '',
};

function mostrarFecha(fecha) {
  if (!fecha) return '';
  const parsed = new Date(`${fecha}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return fecha;
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(parsed).replace('.', '').toUpperCase();
}

export default function CalendarioAdmin({
  onNavegar,
  examenes = [],
  onGuardarExamen,
  onEliminarExamen,
  abrirFormulario = false,
}) {
  const [modalAbierto, setModalAbierto] = useState(abrirFormulario);
  const [formulario, setFormulario] = useState(formVacio);
  const [error, setError] = useState('');

  const cambiar = (campo, valor) => {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
    setError('');
  };

  const guardar = (evento) => {
    evento.preventDefault();
    if (!formulario.asignatura.trim() || !formulario.fecha || !formulario.hora || !formulario.lugar.trim()) {
      setError('Completa los campos obligatorios para agregar el parcial.');
      return;
    }

    onGuardarExamen?.({
      id: Date.now(),
      ...formulario,
      materia: formulario.asignatura,
      dia: mostrarFecha(formulario.fecha).split(' ')[0],
      fechaCorta: formulario.fecha.slice(-2),
      tipo: formulario.evaluacion,
      programa: formulario.programas,
      monitoriaAsignada: false,
      esNuevo: true,
    });
    setFormulario(formVacio);
    setModalAbierto(false);
  };

  return (
    <AdminShell titulo="Calendario académico" paginaActiva="Calendario Admin" onNavegar={onNavegar}>
      <div className="calendario-admin">
        <header className="admin-page-header calendario-admin__encabezado">
          <div>
            <h1>Calendario académico</h1>
            <p>Gestión de parciales, finales y evaluaciones — Semestre 2026-2</p>
          </div>
          <div className="calendario-admin__acciones-superiores">
            <button type="button" className="admin-secondary-button" onClick={() => onNavegar?.('Crear monitoria pre-parcial Admin')}>Crear monitoría pre-parcial</button>
            <button type="button" className="admin-primary-button" onClick={() => setModalAbierto(true)}>+ Agregar parcial</button>
          </div>
        </header>

        <section className="admin-kpis calendario-admin__kpis" aria-label="Resumen del calendario">
          <article className="admin-card admin-kpi admin-kpi--red"><strong>7</strong><span>Exámenes registrados</span></article>
          <article className="admin-card admin-kpi admin-kpi--gold"><strong>5</strong><span>Próximos 7 días</span></article>
          <article className="admin-card admin-kpi admin-kpi--green"><strong>3</strong><span>Monitorías pre-parcial activas</span></article>
          <article className="admin-card admin-kpi admin-kpi--red"><strong>2</strong><span>Sin monitoría asignada</span></article>
        </section>

        {examenes.some((examen) => !examen.monitoriaAsignada) && (
          <div className="admin-alert calendario-admin__alerta">
            <span aria-hidden="true"><img src={warningIcon} alt="" /></span>
            <div>
              <strong>2 parciales próximos sin monitoría de apoyo</strong>
              <p>Microeconomía (Jue 26 Sep) y Estadística (Vie 27 Sep) no tienen monitoría pre-parcial asignada. Se recomienda crearlas con al menos 5 días de anticipación.</p>
            </div>
          </div>
        )}

        <h2 className="calendario-admin__subtitulo">PRÓXIMOS EXÁMENES — SEP / OCT 2026</h2>
        <section className="calendario-admin__lista" aria-live="polite">
          {examenes.map((examen) => (
            <article className="calendario-admin__evento admin-card" key={examen.id}>
              <div className="calendario-admin__fecha">
                <strong>{examen.dia}</strong>
                <b>{examen.fechaCorta}</b>
              </div>
              <div className="calendario-admin__datos">
                <div className="calendario-admin__titulo">
                  <strong>{examen.materia}</strong>
                  <span>{examen.tipo}</span>
                </div>
                <p>{examen.programa} · {examen.semestre} · {examen.hora} · {examen.lugar}</p>
              </div>
              <span className={examen.monitoriaAsignada ? 'calendario-admin__estado' : 'calendario-admin__estado calendario-admin__estado--pendiente'}>
                {examen.monitoriaAsignada ? '● Monitoría asignada' : '● Sin monitoría'}
              </span>
              <div className="calendario-admin__botones">
                {examen.monitoriaAsignada ? (
                  <button type="button" className="admin-secondary-button" onClick={() => onNavegar?.('Monitorias admin')}>Ver monitoría</button>
                ) : (
                  <button type="button" className="admin-secondary-button" onClick={() => onNavegar?.('Crear monitoria pre-parcial Admin')}>Crear monitoría</button>
                )}
                <button
                  type="button"
                  className="calendario-admin__eliminar"
                  aria-label={`Eliminar parcial de ${examen.materia}`}
                  title="Eliminar parcial"
                  onClick={() => onEliminarExamen?.(examen.id)}
                >
                  <img src="/assets/exit-svgrepo-com 1.svg" alt="" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>

      {modalAbierto && (
        <div className="calendario-admin__overlay" onMouseDown={(evento) => evento.target === evento.currentTarget && setModalAbierto(false)}>
          <form className="calendario-admin__modal" onSubmit={guardar} aria-label="Agregar parcial">
            <label className="calendario-admin__campo calendario-admin__campo--completo">
              Asignatura
              <input className="admin-field" value={formulario.asignatura} onChange={(evento) => cambiar('asignatura', evento.target.value)} placeholder="Ej. Cálculo Diferencial" required />
            </label>
            <div className="calendario-admin__modal-grid">
              <label className="calendario-admin__campo">
                Tipo de evaluación
                <select className="admin-select" value={formulario.evaluacion} onChange={(evento) => cambiar('evaluacion', evento.target.value)}>
                  <option>Parcial</option>
                  <option>Final</option>
                </select>
              </label>
              <label className="calendario-admin__campo">
                Semestre
                <select className="admin-select" value={formulario.semestre} onChange={(evento) => cambiar('semestre', evento.target.value)}>
                  {Array.from({ length: 10 }, (_, index) => <option key={index + 1}>{index + 1}°</option>)}
                </select>
              </label>
              <label className="calendario-admin__campo calendario-admin__campo--completo">
                Programa(s)
                <input className="admin-field" value={formulario.programas} onChange={(evento) => cambiar('programas', evento.target.value)} placeholder="Ej. Ingeniería de Sistemas, Matemáticas..." />
              </label>
              <label className="calendario-admin__campo">
                Fecha
                <input className="admin-field" type="date" value={formulario.fecha} onChange={(evento) => cambiar('fecha', evento.target.value)} required />
              </label>
              <label className="calendario-admin__campo">
                Hora
                <input className="admin-field" type="time" value={formulario.hora} onChange={(evento) => cambiar('hora', evento.target.value)} required />
              </label>
              <label className="calendario-admin__campo calendario-admin__campo--completo">
                Aula / Lugar
                <input className="admin-field" value={formulario.lugar} onChange={(evento) => cambiar('lugar', evento.target.value)} placeholder="Ej. Aula 301, Edificio E" required />
              </label>
              <label className="calendario-admin__campo calendario-admin__campo--completo">
                Notas adicionales (opcional)
                <textarea className="admin-textarea" value={formulario.notas} onChange={(evento) => cambiar('notas', evento.target.value)} placeholder="Material permitido, duración..." rows="3" />
              </label>
            </div>
            {error && <p className="admin-error" role="alert">{error}</p>}
            <div className="calendario-admin__modal-acciones">
              <button type="button" className="admin-text-button" onClick={() => setModalAbierto(false)}>Cancelar</button>
              <button type="submit" className="admin-primary-button">Guardar en calendario</button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}
