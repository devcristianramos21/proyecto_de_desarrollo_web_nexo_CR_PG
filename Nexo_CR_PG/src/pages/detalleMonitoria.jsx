
import { useState } from 'react';

import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';

import './detalleMonitoria.css';

const temasPredeterminados = [
  'Espacios vectoriales',
  'Transformaciones lineales',
  'Valores propios',
  'Sistemas de ecuaciones',
];

const monitoriaPredeterminada = {
  titulo: 'Pre-parcial Álgebra Lineal',
  tipo: 'Pre-parcial',
  estado: 'Disponible',
  monitor: 'Felipe Castro',
  fecha: 'Dom 21 Sep 2026',
  hora: '10:00 AM – 12:00 PM',
  horario: 'Dom 21 Sep 2026 · 10:00 AM – 12:00 PM',
  modalidad: 'Presencial',
  lugar: 'Edificio G, Sala 2',
  inscritos: 14,
  cupo: 20,
  descripcion:
    'Sesión de repaso intensivo. Se cubrirán: espacios vectoriales, transformaciones lineales, valores y vectores propios, sistemas de ecuaciones.',
  preparacion:
    'Parcial de Álgebra Lineal — Martes 24 Sep a las 10:00 AM',
  temas: temasPredeterminados,
  semestreMonitor: 'Matemáticas · 10° semestre',
  calificacion: 4.8,
  iniciales: 'FC',
};

function DetalleMonitoria({
  onNavegar,
  monitoria,
  onInscribirse,
  onVerPerfilTutor,
  modoTutor = false,
}) {
  const datos = monitoria || monitoriaPredeterminada;

  // Estados
  const [modalAbierto, setModalAbierto] = useState(false);

  // Datos calculados
  const cupo = Number(datos.cupo) || 0;
  const inscritosActuales = Number(datos.inscritos) || 0;
  const yaInscrito = datos.estado === 'Inscrito';

  const cupoLleno =
    cupo > 0 && inscritosActuales >= cupo;

  const estadoActual = yaInscrito
    ? 'Inscrito'
    : cupoLleno
      ? 'Cupo lleno'
      : datos.estado || 'Disponible';

  const temas = datos.temas || (monitoria ? [] : temasPredeterminados);

  const porcentaje = cupo > 0
    ? Math.min((inscritosActuales / cupo) * 100, 100)
    : 0;

  const horarioSeparado = datos.horario?.split('·') || [];
  const fecha = datos.fecha || horarioSeparado[0]?.trim() || (
    monitoria ? 'Por definir' : 'Dom 21 Sep 2026'
  );
  const hora = datos.hora ||
    horarioSeparado.slice(1).join(' · ').trim() ||
    (monitoria ? '' : '10:00 AM – 12:00 PM');
  const horarioCompleto = datos.horario ||
    [fecha, hora].filter(Boolean).join(' · ');
  const nombreMonitor = datos.monitor || 'Felipe Castro';
  const modalidad = datos.modalidad || (monitoria ? 'Por definir' : 'Presencial');
  const lugar = datos.lugar || 'Por definir';

  const descripcion =
    datos.descripcion ||
    (monitoria
      ? 'Información de esta monitoría.'
      : 'Sesión de apoyo académico para repasar los temas de la asignatura.');

  const horaInicio = hora.split('–')[0].trim();

  // Abrir modal de inscripción
  const abrirConfirmacion = () => {
    if (!yaInscrito && !cupoLleno) {
      setModalAbierto(true);
    }
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModalAbierto(false);
  };

  // Confirmar inscripción
  const confirmarInscripcion = () => {
    if (yaInscrito || cupoLleno) return;

    setModalAbierto(false);

    onInscribirse?.({
      ...datos,
      inscritos: Math.min(inscritosActuales + 1, cupo),
      estado: 'Inscrito',
    });
  };

  // Cancelar una inscripción ya confirmada
  const cancelarInscripcionConfirmada = () => {
    if (!yaInscrito) return;

    onInscribirse?.({
      ...datos,
      inscritos: Math.max(inscritosActuales - 1, 0),
      estado: 'Disponible',
    });
  };

  // Abrir perfil del monitor
  const abrirPerfilMonitor = () => {
    onVerPerfilTutor?.({
      ...datos,
      id: datos.tutorId ?? `monitor-${datos.id}`,
      nombre: nombreMonitor,
      iniciales: datos.iniciales || 'FC',
      especialidad: datos.especialidad || datos.programa || 'Monitor académico',
      semestreTutor: datos.semestreMonitor || datos.semestreTutor || '',
      calificacion: datos.calificacion ?? null,
    });
  };

  return (
    <div className="detalle-layout">

      {/* SIDEBAR */}
      <Sidebar
        paginaActiva={modoTutor ? 'Monitorías asignadas' : 'Monitorías'}
        onNavegar={onNavegar}
      />

      {/* CONTENIDO */}
      <div className="detalle-contenido">

        {/* NAVBAR */}
        <Navbar
          titulo="Detalle monitoría"
          onNavegar={onNavegar}
        />

        <main className="detalle-main">

          {/* BREADCRUMB */}
          <div className="detalle-migas">
            <button
              type="button"
              onClick={() =>
                onNavegar?.(modoTutor ? 'Monitorías asignadas' : 'Monitorías')
              }
            >
              Monitorías
            </button>

            <span>/</span>

            <strong>{datos.titulo}</strong>
          </div>

          {/* ENCABEZADO */}
          <section className="detalle-encabezado">

            <div className="detalle-encabezado-info">

              <div className="detalle-titulo-fila">
                <h1>{datos.titulo}</h1>

                <span className="detalle-tipo">
                  {datos.tipo}
                </span>

                <span className="detalle-estado">
                  {estadoActual === 'Inscrito'
                    ? 'Disponible'
                    : estadoActual}
                </span>
              </div>

              <p>
                {horarioCompleto} · {modalidad}
              </p>

            </div>

            {!modoTutor && yaInscrito ? (
              <button
                className="detalle-boton-cancelar-inscripcion"
                type="button"
                onClick={cancelarInscripcionConfirmada}
              >
                Cancelar inscripción
              </button>
            ) : !modoTutor ? (
              <button
                className="detalle-boton-inscribir"
                type="button"
                onClick={abrirConfirmacion}
                disabled={cupoLleno}
              >
                {cupoLleno ? 'Cupo lleno' : 'Inscribirse'}
              </button>
            ) : null}

          </section>

          {/* AVISO VERDE: INSCRIPCIÓN CONFIRMADA */}
          {yaInscrito && (
            <section className="detalle-aviso detalle-aviso-exito">

              <span
                className="detalle-aviso-icono"
                aria-hidden="true"
              >
                ✓
              </span>

              <div>
                <strong>¡Inscripción confirmada!</strong>

                <p>
                  Ya estás inscrito en esta monitoría.
                  Te esperamos el <b>{fecha}</b>
                  {horaInicio && <> a las <b>{horaInicio}</b></>}.
                </p>
              </div>

            </section>
          )}

          {/* AVISO AZUL: PREPARACIÓN PARA PARCIAL */}
          {datos.tipo === 'Pre-parcial' && (
            <section className="detalle-aviso">

              <span
                className="detalle-aviso-icono"
                aria-hidden="true"
              >
                i
              </span>

              <div>
                <strong>Preparación para parcial</strong>

                <p>
                  Esta monitoría es la sesión de repaso antes del{' '}
                  <b>
                    {datos.preparacion ||
                      'próximo parcial de la asignatura'}
                  </b>
                </p>
              </div>

            </section>
          )}

          {/* COLUMNAS */}
          <div className="detalle-columnas">

            {/* COLUMNA IZQUIERDA */}
            <div className="detalle-columna-izquierda">

              {/* DESCRIPCIÓN */}
              <section className="detalle-card detalle-descripcion">

                <h2>Sobre esta monitoría</h2>

                <p>{descripcion}</p>

                <div
                  className="detalle-temas"
                  aria-label="Temas de la sesión"
                >
                  {temas.map((tema) => (
                    <span
                      className="detalle-tema"
                      key={tema}
                    >
                      {tema}
                    </span>
                  ))}
                </div>

              </section>

              {/* INFORMACIÓN DEL MONITOR */}
              <section className="detalle-card detalle-monitor">

                <h2>Monitor</h2>

                <div className="detalle-monitor-info">

                  <div className="detalle-avatar">
                    {datos.iniciales || 'FC'}
                  </div>

                  <div className="detalle-monitor-datos">

                    <strong>{nombreMonitor}</strong>

                    <p>
                      {datos.semestreMonitor || datos.semestreTutor || 'Monitor académico'}
                    </p>

                    <div className="detalle-puntuacion">

                      <span className="detalle-estrellas">
                        ★★★★★
                      </span>

                      <b>{datos.calificacion ?? '—'}</b>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={abrirPerfilMonitor}
                  >
                    Ver perfil
                  </button>

                </div>

              </section>

            </div>

            {/* COLUMNA DERECHA */}
            <div className="detalle-columna-derecha">

              {/* DATOS DE LA SESIÓN */}
              <section className="detalle-card detalle-datos">

                <div>
                  <span>Tipo</span>
                  <strong>{datos.tipo}</strong>
                </div>

                <div>
                  <span>Fecha</span>
                  <strong>{fecha}</strong>
                </div>

                <div>
                  <span>Hora</span>
                  <strong>{hora || 'Por definir'}</strong>
                </div>

                <div>
                  <span>Modalidad</span>
                  <strong>{modalidad}</strong>
                </div>

                <div>
                  <span>Lugar</span>
                  <strong>{lugar}</strong>
                </div>

              </section>

              {/* INSCRIPCIONES */}
              <section className="detalle-card detalle-inscripciones">

                <h2>Inscripciones</h2>

                <strong className="detalle-cantidad">
                  {inscritosActuales} / {cupo}
                </strong>

                <div
                  className="detalle-progreso"
                  role="progressbar"
                  aria-label="Porcentaje de inscripciones"
                  aria-valuenow={inscritosActuales}
                  aria-valuemin={0}
                  aria-valuemax={cupo}
                >
                  <span style={{ width: `${porcentaje}%` }} />
                </div>

                {inscritosActuales >= 10 ? (
                  <p>
                    ✓ Monitoría confirmada (superó umbral de 10)
                  </p>
                ) : (
                  <p className="detalle-inscripciones-pendientes">
                    Necesita {10 - inscritosActuales} inscripciones
                    más para confirmarse.
                  </p>
                )}

              </section>

            </div>

          </div>
        </main>

        {/* MODAL DE CONFIRMACIÓN */}
        {!modoTutor && modalAbierto && (
          <div
            className="detalle-modal-overlay"
            onClick={cerrarModal}
          >
            <section
              className="detalle-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="detalle-modal-titulo"
              onClick={(e) => e.stopPropagation()}
            >

              <h2 id="detalle-modal-titulo">
                Confirmar inscripción
              </h2>

              <p>
                ¿Deseas inscribirte en la{' '}
                <strong>{datos.titulo}</strong> del{' '}
                <strong>{horarioCompleto}</strong>?
                Esta monitoría es {modalidad.toLowerCase()} en{' '}
                <strong>{lugar}</strong>.
              </p>

              <div className="detalle-modal-acciones">

                <button
                  type="button"
                  className="detalle-modal-cancelar"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="detalle-modal-confirmar"
                  onClick={confirmarInscripcion}
                >
                  Confirmar inscripción
                </button>

              </div>

            </section>
          </div>
        )}

      </div>
    </div>
  );
}

export default DetalleMonitoria;
