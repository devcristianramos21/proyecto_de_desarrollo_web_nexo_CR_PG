
import { useEffect, useState } from 'react';
import AdminShell from './AdminShell';
import warningIcon from './assets/warning.svg';
import './calendarioAdmin.css';

const formVacio = {
  materia: '',
  nombre: 'Primer parcial',
  fecha: '',
  hora: '',
  descripcion: '',
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

function obtenerFechaTexto(fecha) {
  if (!fecha) return '';

  const texto = typeof fecha === 'string'
    ? fecha.slice(0, 10)
    : '';

  return texto;
}

function obtenerIdParcial(valor) {
  return String(valor?._id ?? valor ?? '');
}

function tieneMonitoria(parcial, monitorias) {
  return monitorias.some((monitoria) => (
    monitoria.tipo === 'preparcial' &&
    obtenerIdParcial(monitoria.parcial) === obtenerIdParcial(parcial._id) &&
    !['cancelada', 'rechazada'].includes(monitoria.estado)
  ));
}

function esProximoEnSieteDias(fecha) {
  if (!fecha) return false;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const limite = new Date(hoy);
  limite.setDate(limite.getDate() + 7);

  const fechaParcial = new Date(`${fecha}T12:00:00`);
  return fechaParcial >= hoy && fechaParcial <= limite;
}

export default function CalendarioAdmin({
  onNavegar,
  examenes = [],
  monitorias = [],
  onGuardarExamen,
  onEliminarExamen,
  abrirFormulario = false,
}) {
  const [modalAbierto, setModalAbierto] = useState(abrirFormulario);
  const [formulario, setFormulario] = useState(formVacio);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(null);

  useEffect(() => {
    if (abrirFormulario) setModalAbierto(true);
  }, [abrirFormulario]);

  const cambiar = (campo, valor) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
    setError('');
  };

  const examenesOrdenados = [...examenes].sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha)
  );

  const examenesProximos = examenesOrdenados.filter(
    (examen) => esProximoEnSieteDias(obtenerFechaTexto(examen.fecha))
  );

  const examenesSinMonitoria = examenesOrdenados.filter(
    (examen) => !tieneMonitoria(examen, monitorias)
  );

  const monitoriasPreParcial = monitorias.filter(
    (monitoria) =>
      monitoria.tipo === 'preparcial' &&
      !['cancelada', 'rechazada'].includes(monitoria.estado)
  );

  const guardar = async (evento) => {
    evento.preventDefault();
    setError('');

    if (
      !formulario.materia.trim() ||
      !formulario.nombre.trim() ||
      !formulario.fecha ||
      !formulario.hora
    ) {
      setError('Completa los campos obligatorios para agregar el parcial.');
      return;
    }

    try {
      setGuardando(true);

      await onGuardarExamen?.({
        materia: formulario.materia.trim(),
        nombre: formulario.nombre.trim(),
        fecha: formulario.fecha,
        hora: formulario.hora,
        descripcion: formulario.descripcion.trim(),
      });

      setFormulario(formVacio);
      setModalAbierto(false);
    } catch (err) {
      setError(err.message || 'No se pudo guardar el parcial.');
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id) => {
    if (!id) return;

    const confirmar = window.confirm(
      '¿Estás segura de que deseas eliminar este parcial?'
    );

    if (!confirmar) return;

    try {
      setEliminando(id);
      setError('');
      await onEliminarExamen?.(id);
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el parcial.');
    } finally {
      setEliminando(null);
    }
  };

  return (
    <AdminShell
      titulo="Calendario académico"
      paginaActiva="Calendario Admin"
      onNavegar={onNavegar}
    >
      <div className="calendario-admin">
        <header className="admin-page-header calendario-admin__encabezado">
          <div>
            <h1>Calendario académico</h1>
            <p>Gestión de parciales, finales y evaluaciones</p>
          </div>

          <div className="calendario-admin__acciones-superiores">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => onNavegar?.('Crear monitoria pre-parcial Admin')}
            >
              Crear monitoría pre-parcial
            </button>

            <button
              type="button"
              className="admin-primary-button"
              onClick={() => setModalAbierto(true)}
            >
              + Agregar parcial
            </button>
          </div>
        </header>

        <section
          className="admin-kpis calendario-admin__kpis"
          aria-label="Resumen del calendario"
        >
          <article className="admin-card admin-kpi admin-kpi--red">
            <strong>{examenes.length}</strong>
            <span>Exámenes registrados</span>
          </article>

          <article className="admin-card admin-kpi admin-kpi--gold">
            <strong>{examenesProximos.length}</strong>
            <span>Próximos 7 días</span>
          </article>

          <article className="admin-card admin-kpi admin-kpi--green">
            <strong>{monitoriasPreParcial.length}</strong>
            <span>Monitorías pre-parcial activas</span>
          </article>

          <article className="admin-card admin-kpi admin-kpi--red">
            <strong>{examenesSinMonitoria.length}</strong>
            <span>Sin monitoría asignada</span>
          </article>
        </section>

        {examenesSinMonitoria.length > 0 && (
          <div className="admin-alert calendario-admin__alerta">
            <span aria-hidden="true">
              <img src={warningIcon} alt="" />
            </span>

            <div>
              <strong>
                {examenesSinMonitoria.length} parciales sin monitoría de apoyo
              </strong>

              <p>
                {examenesSinMonitoria
                  .slice(0, 3)
                  .map((examen) => (
                    `${examen.materia} (${mostrarFecha(obtenerFechaTexto(examen.fecha))})`
                  ))
                  .join(' · ')}
                . Se recomienda crear monitorías pre-parcial.
              </p>
            </div>
          </div>
        )}

        <h2 className="calendario-admin__subtitulo">
          PRÓXIMOS EXÁMENES
        </h2>

        <section
          className="calendario-admin__lista"
          aria-live="polite"
        >
          {examenesOrdenados.length === 0 ? (
            <article className="admin-card">
              <p>No hay parciales registrados en el calendario.</p>
            </article>
          ) : (
            examenesOrdenados.map((examen) => {
              const fecha = obtenerFechaTexto(examen.fecha);
              const asignada = tieneMonitoria(examen, monitorias);

              return (
                <article
                  className="calendario-admin__evento admin-card"
                  key={examen._id}
                >
                  <div className="calendario-admin__fecha">
                    <strong>{mostrarFecha(fecha).split(' ')[0]}</strong>
                    <b>{fecha.slice(-2)}</b>
                  </div>

                  <div className="calendario-admin__datos">
                    <div className="calendario-admin__titulo">
                      <strong>{examen.materia}</strong>
                      <span>{examen.nombre}</span>
                    </div>

                    <p>
                      {mostrarFecha(fecha)} · {examen.hora || 'Hora no definida'}
                    </p>

                    {examen.descripcion && (
                      <p>{examen.descripcion}</p>
                    )}
                  </div>

                  <span
                    className={
                      asignada
                        ? 'calendario-admin__estado'
                        : 'calendario-admin__estado calendario-admin__estado--pendiente'
                    }
                  >
                    {asignada
                      ? '● Monitoría asignada'
                      : '● Sin monitoría'}
                  </span>

                  <div className="calendario-admin__botones">
                    {asignada ? (
                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() => onNavegar?.('Monitorias admin')}
                      >
                        Ver monitoría
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() => onNavegar?.('Crear monitoria pre-parcial Admin')}
                      >
                        Crear monitoría
                      </button>
                    )}

                    <button
                      type="button"
                      className="calendario-admin__eliminar"
                      aria-label={`Eliminar parcial de ${examen.materia}`}
                      title="Eliminar parcial"
                      disabled={eliminando === examen._id}
                      onClick={() => eliminar(examen._id)}
                    >
                      <img
                        src="/assets/exit-svgrepo-com 1.svg"
                        alt=""
                      />
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>

      {modalAbierto && (
        <div
          className="calendario-admin__overlay"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              setModalAbierto(false);
              setError('');
            }
          }}
        >
          <form
            className="calendario-admin__modal"
            onSubmit={guardar}
            aria-label="Agregar parcial"
          >
            <label className="calendario-admin__campo calendario-admin__campo--completo">
              Asignatura
              <input
                className="admin-field"
                value={formulario.materia}
                onChange={(evento) => cambiar('materia', evento.target.value)}
                placeholder="Ej. Cálculo Diferencial"
                maxLength={100}
                required
              />
            </label>

            <div className="calendario-admin__modal-grid">
              <label className="calendario-admin__campo calendario-admin__campo--completo">
                Nombre del parcial
                <select
                  className="admin-select"
                  value={formulario.nombre}
                  onChange={(evento) => cambiar('nombre', evento.target.value)}
                  required
                >
                  <option>Primer parcial</option>
                  <option>Segundo parcial</option>
                  <option>Tercer parcial</option>
                  <option>Parcial final</option>
                  <option>Examen final</option>
                </select>
              </label>

              <label className="calendario-admin__campo">
                Fecha
                <input
                  className="admin-field"
                  type="date"
                  value={formulario.fecha}
                  onChange={(evento) => cambiar('fecha', evento.target.value)}
                  required
                />
              </label>

              <label className="calendario-admin__campo">
                Hora
                <input
                  className="admin-field"
                  type="time"
                  value={formulario.hora}
                  onChange={(evento) => cambiar('hora', evento.target.value)}
                  required
                />
              </label>

              <label className="calendario-admin__campo calendario-admin__campo--completo">
                Descripción
                <textarea
                  className="admin-textarea"
                  value={formulario.descripcion}
                  onChange={(evento) => cambiar('descripcion', evento.target.value)}
                  placeholder="Temas, indicaciones o información adicional..."
                  maxLength={500}
                  rows="3"
                />
              </label>
            </div>

            {error && (
              <p className="admin-error" role="alert">
                {error}
              </p>
            )}

            <div className="calendario-admin__modal-acciones">
              <button
                type="button"
                className="admin-text-button"
                onClick={() => {
                  setModalAbierto(false);
                  setError('');
                }}
                disabled={guardando}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="admin-primary-button"
                disabled={guardando}
              >
                {guardando ? 'Guardando...' : 'Guardar en calendario'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}
