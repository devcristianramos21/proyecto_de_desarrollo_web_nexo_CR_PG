
import { useState } from 'react';

import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';

import './monitorias.css';

export const monitoriasIniciales = [
  {
    id: 1,
    titulo: 'Monitoría Cálculo Diferencial',
    tipo: 'Obligatoria',
    estado: 'Disponible',
    monitor: 'Andrés Moreno',
    horario: 'Lunes y miércoles 2:00 – 4:00 PM',
    inscritos: 0,
    cupo: 20,
  },
  {
    id: 2,
    titulo: 'Pre-parcial Cálculo Diferencial',
    tipo: 'Pre-parcial',
    estado: 'Por confirmar',
    monitor: 'Andrés Moreno',
    horario: 'Sáb 20 Sep · 9:00 – 11:00 AM',
    preparacion: 'Preparación para: Parcial Lun 23 Sep',
    inscritos: 3,
    cupo: 20,
  },
  {
    id: 3,
    titulo: 'Monitoría Par Programación II',
    tipo: 'Par',
    estado: 'Disponible',
    monitor: 'Carlos Herrera',
    horario: 'Viernes 4:00 – 6:00 PM',
    inscritos: 2,
    cupo: 5,
  },
  {
    id: 4,
    titulo: 'Monitoría Par Microeconomía',
    tipo: 'Par',
    estado: 'Inscrito',
    monitor: 'Valentina Gómez',
    horario: 'Miércoles 5:00 – 6:00 PM',
    inscritos: 2,
    cupo: 3,
  },
  {
    id: 5,
    titulo: 'Monitoría Álgebra Lineal',
    tipo: 'Obligatoria',
    estado: 'Cupo lleno',
    monitor: 'Felipe Castro',
    horario: 'Martes y jueves 3:00 – 5:00 PM',
    inscritos: 25,
    cupo: 25,
  },
  {
    id: 6,
    titulo: 'Pre-parcial Álgebra Lineal',
    tipo: 'Pre-parcial',
    estado: 'Disponible',
    monitor: 'Felipe Castro',
    horario: 'Dom 21 Sep 2026 · 10:00 AM – 12:00 PM',
    fecha: 'Dom 21 Sep 2026',
    hora: '10:00 AM – 12:00 PM',
    modalidad: 'Presencial',
    lugar: 'Edificio G, Sala 2',
    preparacion:
      'Preparación para: Parcial de Álgebra Lineal — Martes 24 Sep a las 10:00 AM',
    descripcion:
      'Sesión de repaso intensivo. Se cubrirán: espacios vectoriales, transformaciones lineales, valores y vectores propios, sistemas de ecuaciones.',
    temas: [
      'Espacios vectoriales',
      'Transformaciones lineales',
      'Valores propios',
      'Sistemas de ecuaciones',
    ],
    semestreMonitor: 'Matemáticas · 10° semestre',
    calificacion: 4.8,
    iniciales: 'FC',
    inscritos: 14,
    cupo: 20,
  },
];

const categorias = ['Todas', 'Obligatoria', 'Par', 'Pre-parcial'];

function Monitorias({
  onVerDetalle,
  onNavegar,
  monitorias = monitoriasIniciales,
  onActualizarMonitoria,
}) {
  const [categoria, setCategoria] = useState('Todas');

  // Monitoría seleccionada para confirmar una acción
  const [monitoriaSeleccionada, setMonitoriaSeleccionada] = useState(null);

  // Acción pendiente: inscribir o cancelar
  const [accionPendiente, setAccionPendiente] = useState(null);

  const monitoriasFiltradas =
    categoria === 'Todas'
      ? monitorias
      : monitorias.filter((monitoria) => monitoria.tipo === categoria);

  const calcularProgreso = (inscritos, cupo) =>
    cupo > 0 ? Math.min((inscritos / cupo) * 100, 100) : 0;

  const verDetalle = (monitoria) => {
    onVerDetalle?.(monitoria);
  };

  // Abrir modal de inscripción
  const abrirModalInscripcion = (monitoria) => {
    setMonitoriaSeleccionada(monitoria);
    setAccionPendiente('inscribir');
  };

  // Abrir modal de cancelación
  const abrirModalCancelacion = (monitoria) => {
    setMonitoriaSeleccionada(monitoria);
    setAccionPendiente('cancelar');
  };

  // Cerrar modal
  const cerrarModal = () => {
    setMonitoriaSeleccionada(null);
    setAccionPendiente(null);
  };

  // Confirmar inscripción o cancelación
  const confirmarAccion = () => {
    if (!monitoriaSeleccionada || !accionPendiente) return;

    if (accionPendiente === 'inscribir') {
      if (
        monitoriaSeleccionada.estado === 'Inscrito' ||
        monitoriaSeleccionada.estado === 'Cupo lleno' ||
        monitoriaSeleccionada.inscritos >= monitoriaSeleccionada.cupo
      ) {
        cerrarModal();
        return;
      }

      onActualizarMonitoria?.({
        ...monitoriaSeleccionada,
        estado: 'Inscrito',
        inscritos: monitoriaSeleccionada.inscritos + 1,
      });
    } else {
      onActualizarMonitoria?.({
        ...monitoriaSeleccionada,
        estado: 'Disponible',
        inscritos: Math.max(0, monitoriaSeleccionada.inscritos - 1),
      });
    }

    cerrarModal();
  };

  const esInscripcion = accionPendiente === 'inscribir';
  const esPreParcial =
    monitoriaSeleccionada?.tipo === 'Pre-parcial';

  return (
    <div className="monitorias-layout">

      {/* SIDEBAR */}
      <Sidebar
        paginaActiva="Monitorías"
        onNavegar={onNavegar}
      />

      <div className="monitorias-contenido">

        {/* NAVBAR */}
        <Navbar titulo="Monitorías disponibles" onNavegar={onNavegar} />

        <main className="monitorias-main">

          {/* ENCABEZADO */}
          <section className="monitorias-encabezado">
            <h1>Monitorías disponibles</h1>

            <p>
              Sesiones de apoyo académico — Universidad del Rosario ·
              Semestre 2026-2
            </p>
          </section>

          {/* AVISO DE PARCIALES */}
          <section className="monitorias-aviso">

            <div
              className="monitorias-aviso__icono"
              aria-hidden="true"
            >
              <img
                src="/assets/calendar_clock_23dp_E3E3E3_FILL0_wght400_GRAD0_opsz24 1.svg"
                alt=""
              />
            </div>

            <div className="monitorias-aviso__contenido">
              <strong>Parciales en los próximos 7 días</strong>

              <p>
                Cálculo Diferencial (Lun 23 Sep), Álgebra Lineal
                (Mar 24 Sep), Programación II (Mié 25 Sep).
                Inscríbete en las monitorías pre-parcial antes de que
                se cancelen por bajo cupo.
              </p>
            </div>

          </section>

          {/* FILTROS */}
          <div
            className="monitorias-filtros"
            role="tablist"
            aria-label="Filtrar monitorías"
          >
            {categorias.map((filtro) => (
              <button
                key={filtro}
                type="button"
                role="tab"
                aria-selected={categoria === filtro}
                className={
                  categoria === filtro ? 'filtro activo' : 'filtro'
                }
                onClick={() => setCategoria(filtro)}
              >
                {filtro}
              </button>
            ))}
          </div>

          {/* LISTADO DE MONITORÍAS */}
          <section className="monitorias-lista">

            {monitoriasFiltradas.map((monitoria) => {
              const progreso = calcularProgreso(
                monitoria.inscritos,
                monitoria.cupo
              );

              const esPorConfirmar =
                monitoria.estado === 'Por confirmar';

              return (
                <article
                  className={`monitoria-card ${
                    monitoria.tipo === 'Pre-parcial'
                      ? 'monitoria-card--preparcial'
                      : ''
                  }`}
                  key={monitoria.id}
                >

                  <div className="monitoria-informacion">

                    {/* TÍTULO Y ESTADOS */}
                    <div className="monitoria-titulo-fila">

                      <h2>{monitoria.titulo}</h2>

                      <span
                        className={`monitoria-tipo tipo-${monitoria.tipo
                          .toLowerCase()
                          .replaceAll('-', '')}`}
                      >
                        {monitoria.tipo}
                      </span>

                      <span
                        className={`monitoria-estado estado-${monitoria.estado
                          .toLowerCase()
                          .replaceAll(' ', '-')}`}
                      >
                        {monitoria.estado}
                      </span>

                    </div>

                    {/* PREPARACIÓN PARA PARCIAL */}
                    {monitoria.preparacion && (
                      <p className="monitoria-preparacion">
                        <span aria-hidden="true">▣</span>
                        {monitoria.preparacion}
                      </p>
                    )}

                    {/* MONITOR Y HORARIO */}
                    <p className="monitoria-horario">
                      <strong>{monitoria.monitor}</strong>
                      {' · '}
                      {monitoria.horario}
                    </p>

                    {/* CUPOS */}
                    <div className="monitoria-cupos">

                      <div
                        className="monitoria-progreso"
                        role="progressbar"
                        aria-label={`Inscripciones de ${monitoria.titulo}`}
                        aria-valuenow={monitoria.inscritos}
                        aria-valuemin={0}
                        aria-valuemax={monitoria.cupo}
                      >
                        <span
                          style={{ width: `${progreso}%` }}
                        />
                      </div>

                      <small>
                        {monitoria.inscritos}/{monitoria.cupo} inscritos
                      </small>

                    </div>

                    {/* ALERTA DE CONFIRMACIÓN */}
                    {esPorConfirmar && (
                      <small className="monitoria-alerta">
                        <span aria-hidden="true">⚠</span>
                        {' '}Necesita{' '}
                        {Math.max(0, 10 - monitoria.inscritos)}{' '}
                        inscripciones más para confirmarse
                      </small>
                    )}

                  </div>

                  {/* ACCIONES */}
                  <div className="monitoria-acciones">

                    <button
                      type="button"
                      className="boton-detalle"
                      onClick={() => verDetalle(monitoria)}
                    >
                      Ver detalle
                    </button>

                    {monitoria.estado !== 'Cupo lleno' && (
                      <button
                        type="button"
                        className={
                          monitoria.estado === 'Inscrito'
                            ? 'boton-cancelar'
                            : 'boton-inscripcion'
                        }
                        onClick={() =>
                          monitoria.estado === 'Inscrito'
                            ? abrirModalCancelacion(monitoria)
                            : abrirModalInscripcion(monitoria)
                        }
                      >
                        {monitoria.estado === 'Inscrito'
                          ? 'Cancelar'
                          : 'Inscribirse'}
                      </button>
                    )}

                  </div>

                </article>
              );
            })}

            {/* ESTADO VACÍO */}
            {monitoriasFiltradas.length === 0 && (
              <p className="monitorias-vacio">
                No hay monitorías disponibles en esta categoría.
              </p>
            )}

          </section>
        </main>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {monitoriaSeleccionada && accionPendiente && (
        <div
          className="monitorias-modal-overlay"
          onClick={cerrarModal}
        >
          <section
            className="monitorias-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="monitorias-modal-titulo"
            onClick={(e) => e.stopPropagation()}
          >

            <h2 id="monitorias-modal-titulo">
              {esInscripcion
                ? 'Confirmar inscripción'
                : 'Cancelar inscripción'}
            </h2>

            {esInscripcion ? (
              <p>
                ¿Deseas inscribirte en{' '}
                <strong>{monitoriaSeleccionada.titulo}</strong>?
                {' '}

                {esPreParcial ? (
                  <>
                    Esta monitoría aún no ha alcanzado el mínimo de
                    inscritos para confirmarse. Si no se completa
                    el cupo mínimo, se cancelará.
                  </>
                ) : (
                  <>
                    Confirma tu inscripción para reservar tu cupo
                    en esta monitoría.
                  </>
                )}
              </p>
            ) : (
              <p>
                ¿Estás seguro de que deseas cancelar tu inscripción
                en{' '}
                <strong>{monitoriaSeleccionada.titulo}</strong>?
                Tu cupo quedará disponible para otro estudiante.
              </p>
            )}

            <div className="monitorias-modal-acciones">

              <button
                type="button"
                className="monitorias-modal-cancelar"
                onClick={cerrarModal}
              >
                Volver
              </button>

              <button
                type="button"
                className="monitorias-modal-confirmar"
                onClick={confirmarAccion}
              >
                {esInscripcion
                  ? 'Confirmar inscripción'
                  : 'Sí, cancelar inscripción'}
              </button>

            </div>

          </section>
        </div>
      )}

    </div>
  );
}

export default Monitorias;
