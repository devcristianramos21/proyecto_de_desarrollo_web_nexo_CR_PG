import { useState } from 'react';
import AdminShell from './AdminShell';
import './crearMonitoriaAdmin.css';

const tipos = [
  { valor: 'Obligatoria', descripcion: '20-25 estudiantes,\nasignación institucional' },
  { valor: 'Par', descripcion: '3-5 estudiantes,\nentre pares' },
  { valor: 'Pre-parcial', descripcion: 'Sesión única antes\nde examen, umbral mínimo' },
];

const asignaturas = [
  'Cálculo Diferencial',
  'Álgebra Lineal',
  'Programación II',
  'Microeconomía',
  'Estadística',
  'Bases de Datos',
];

const tutores = ['Andrés Moreno', 'Carlos Herrera', 'Felipe Castro'];
const programaPorTutor = {
  'Andrés Moreno': 'Ingeniería',
  'Carlos Herrera': 'Ing. de Sistemas',
  'Felipe Castro': 'Ing. / Matemáticas',
};

export default function CrearMonitoriaAdmin({
  onNavegar,
  onCrear,
  tipoInicial = 'Obligatoria',
  parciales = [],
  tutoresDisponibles = [],
  cargandoReferencias = false,
  errorReferencias = '',
}) {
  const [formulario, setFormulario] = useState({
    tipo: tipoInicial,
    titulo: '',
    asignatura: 'Cálculo Diferencial',
    tutor: 'Andrés Moreno',
    cupo: '25',
    minimo: '15',
    horario: '',
    modalidad: 'Presencial',
    parcialId: '',
    tutorId: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    descripcion: '',
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const esPreParcial = tipoInicial === 'Pre-parcial';

  const cambiar = (campo, valor) => {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
    setError('');
  };

  const crear = async (evento) => {
    evento.preventDefault();

    if (esPreParcial) {
      if (
        !formulario.parcialId ||
        !formulario.tutorId ||
        !formulario.fecha ||
        !formulario.horaInicio ||
        !formulario.horaFin
      ) {
        setError('Selecciona el parcial, el tutor y el horario de la monitoría.');
        return;
      }

      try {
        setGuardando(true);
        await onCrear?.({
          tipo: 'preparcial',
          tutor: formulario.tutorId,
          parcial: formulario.parcialId,
          fecha: formulario.fecha,
          horaInicio: formulario.horaInicio,
          horaFin: formulario.horaFin,
          modalidad: formulario.modalidad.toLowerCase(),
          cupoMaximo: Number(formulario.cupo),
          descripcion: formulario.descripcion.trim(),
        });
      } catch (err) {
        setError(err.message || 'No se pudo crear la monitoría pre-parcial.');
      } finally {
        setGuardando(false);
      }
      return;
    }

    const cupo = Number(formulario.cupo);
    const minimo = Number(formulario.minimo);
    if (!formulario.titulo.trim() || !formulario.horario.trim() || cupo < 1 || minimo < 1 || minimo > cupo) {
      setError('Completa los campos obligatorios y verifica que el umbral no supere la capacidad.');
      return;
    }

    onCrear?.({
      id: Date.now(),
      titulo: formulario.titulo.trim(),
      tipo: formulario.tipo,
      estado: 'Abierta',
      tutor: formulario.tutor,
      programa: programaPorTutor[formulario.tutor] || 'Ingeniería',
      asignatura: formulario.asignatura,
      horario: formulario.horario.trim(),
      fecha: formulario.horario.trim(),
      inscritos: 0,
      cupo,
      minimo,
      modalidad: formulario.modalidad,
    });
  };

  return (
    <AdminShell titulo="Crear monitoría" paginaActiva="Monitorias" onNavegar={onNavegar}>
      <div className="crear-monitoria-admin">
        <nav className="crear-monitoria-admin__migas" aria-label="Ruta de navegación">
          <button type="button" onClick={() => onNavegar?.('Monitorias admin')}>Monitorías</button>
          <span>/</span>
          <strong>Crear monitoría</strong>
        </nav>
        <header className="admin-page-header">
          <div>
            <h1>Crear nueva monitoría</h1>
            <p>Configura los detalles de la nueva monitoría institucional</p>
          </div>
        </header>

        <form className="crear-monitoria-admin__formulario admin-card" onSubmit={crear}>
          {esPreParcial ? (
            <>
              <label className="crear-monitoria-admin__campo crear-monitoria-admin__campo--completo">
                Parcial relacionado
                <select
                  className="admin-select"
                  value={formulario.parcialId}
                  onChange={(evento) => cambiar('parcialId', evento.target.value)}
                  disabled={cargandoReferencias || parciales.length === 0}
                  required
                >
                  <option value="">
                    {cargandoReferencias
                      ? 'Cargando parciales…'
                      : 'Selecciona un parcial'}
                  </option>
                  {parciales.map((parcial) => (
                    <option key={parcial._id} value={parcial._id}>
                      {parcial.materia} · {parcial.nombre} · {parcial.fecha}
                    </option>
                  ))}
                </select>
              </label>

              <div className="crear-monitoria-admin__dos-columnas">
                <label className="crear-monitoria-admin__campo crear-monitoria-admin__campo--completo">
                  Tutor asignado
                  <select
                    className="admin-select"
                    value={formulario.tutorId}
                    onChange={(evento) => cambiar('tutorId', evento.target.value)}
                    disabled={cargandoReferencias || tutoresDisponibles.length === 0}
                    required
                  >
                    <option value="">
                      {cargandoReferencias
                        ? 'Cargando tutores…'
                        : 'Selecciona un tutor'}
                    </option>
                    {tutoresDisponibles.map((tutor) => (
                      <option key={tutor._id} value={tutor._id}>
                        {tutor.nombre}
                        {tutor.carrera ? ` · ${tutor.carrera}` : ''}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="crear-monitoria-admin__campo">
                  Capacidad máxima
                  <input
                    className="admin-field"
                    type="number"
                    min="1"
                    max="100"
                    value={formulario.cupo}
                    onChange={(evento) => cambiar('cupo', evento.target.value)}
                    required
                  />
                </label>
                <label className="crear-monitoria-admin__campo">
                  Modalidad
                  <select
                    className="admin-select"
                    value={formulario.modalidad}
                    onChange={(evento) => cambiar('modalidad', evento.target.value)}
                  >
                    <option>Presencial</option>
                    <option>Virtual</option>
                  </select>
                </label>
                <label className="crear-monitoria-admin__campo">
                  Fecha
                  <input
                    className="admin-field"
                    type="date"
                    value={formulario.fecha}
                    onChange={(evento) => cambiar('fecha', evento.target.value)}
                    required
                  />
                </label>
                <label className="crear-monitoria-admin__campo">
                  Hora de inicio
                  <input
                    className="admin-field"
                    type="time"
                    value={formulario.horaInicio}
                    onChange={(evento) => cambiar('horaInicio', evento.target.value)}
                    required
                  />
                </label>
                <label className="crear-monitoria-admin__campo">
                  Hora de fin
                  <input
                    className="admin-field"
                    type="time"
                    value={formulario.horaFin}
                    onChange={(evento) => cambiar('horaFin', evento.target.value)}
                    required
                  />
                </label>
                <label className="crear-monitoria-admin__campo crear-monitoria-admin__campo--completo">
                  Descripción
                  <textarea
                    className="admin-textarea"
                    value={formulario.descripcion}
                    onChange={(evento) => cambiar('descripcion', evento.target.value)}
                    maxLength={500}
                    rows="3"
                  />
                </label>
              </div>
              {errorReferencias && (
                <p className="admin-error" role="alert">
                  {errorReferencias}
                </p>
              )}
            </>
          ) : (
            <>
              <fieldset className="crear-monitoria-admin__tipos">
                <legend>Tipo de monitoría</legend>
                <div>
                  {tipos.map((tipo) => (
                    <label className={formulario.tipo === tipo.valor ? 'crear-monitoria-admin__tipo crear-monitoria-admin__tipo--activo' : 'crear-monitoria-admin__tipo'} key={tipo.valor}>
                      <input
                        type="radio"
                        name="tipo-monitoria"
                        value={tipo.valor}
                        checked={formulario.tipo === tipo.valor}
                        onChange={() => tipo.valor === 'Pre-parcial'
                          ? onNavegar?.('Crear monitoria pre-parcial Admin')
                          : cambiar('tipo', tipo.valor)}
                      />
                      <span>
                        <strong>{tipo.valor}</strong>
                        <small>{tipo.descripcion}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="crear-monitoria-admin__campo crear-monitoria-admin__campo--completo">
                Nombre de la monitoría
                <input className="admin-field" value={formulario.titulo} onChange={(evento) => cambiar('titulo', evento.target.value)} placeholder="Ej. Monitoría Cálculo Diferencial — Grupo A" required />
              </label>

              <div className="crear-monitoria-admin__dos-columnas">
                <label className="crear-monitoria-admin__campo">
                  Asignatura
                  <select className="admin-select" value={formulario.asignatura} onChange={(evento) => cambiar('asignatura', evento.target.value)}>
                    {asignaturas.map((asignatura) => <option key={asignatura}>{asignatura}</option>)}
                  </select>
                </label>
                <label className="crear-monitoria-admin__campo">
                  Tutor / Monitor asignado
                  <select className="admin-select" value={formulario.tutor} onChange={(evento) => cambiar('tutor', evento.target.value)}>
                    {tutores.map((tutor) => <option key={tutor}>{tutor}</option>)}
                  </select>
                </label>
                <label className="crear-monitoria-admin__campo">
                  Capacidad máxima
                  <input className="admin-field" type="number" min="1" value={formulario.cupo} onChange={(evento) => cambiar('cupo', evento.target.value)} required />
                </label>
                <label className="crear-monitoria-admin__campo">
                  Umbral mínimo para confirmar
                  <input className="admin-field" type="number" min="1" value={formulario.minimo} onChange={(evento) => cambiar('minimo', evento.target.value)} required />
                  <small>La monitoría se cancela si no llega a este número.</small>
                </label>
              </div>

              <label className="crear-monitoria-admin__campo crear-monitoria-admin__campo--completo">
                Fecha y horario
                <input className="admin-field" value={formulario.horario} onChange={(evento) => cambiar('horario', evento.target.value)} placeholder="Ej. Sábado 20 Sep · 9:00 AM – 11:00 AM" required />
              </label>

              <label className="crear-monitoria-admin__campo crear-monitoria-admin__campo--completo">
                Modalidad
                <select className="admin-select" value={formulario.modalidad} onChange={(evento) => cambiar('modalidad', evento.target.value)}>
                  <option>Presencial</option>
                  <option>Virtual</option>
                </select>
              </label>
            </>
          )}

          {error && <p className="admin-error crear-monitoria-admin__error" role="alert">{error}</p>}
          <div className="crear-monitoria-admin__acciones">
            <button type="button" className="admin-text-button" onClick={() => onNavegar?.('Monitorias admin')}>Cancelar</button>
            <button
              type="submit"
              className="admin-primary-button"
              disabled={guardando || (esPreParcial && (cargandoReferencias || parciales.length === 0 || tutoresDisponibles.length === 0))}
            >
              {guardando ? 'Guardando…' : 'Crear monitoría'}
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
