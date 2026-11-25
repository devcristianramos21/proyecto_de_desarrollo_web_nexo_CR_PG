
import { useState } from 'react';

import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';

import './detalleMonitoria.css';

function DetalleMonitoria({
  onNavegar,
  monitoria,
  onInscribirse,
  onCancelarInscripcion,
  onVerPerfilTutor,
  modoTutor = false,
}) {
  const datos = monitoria || {};

  // Estados
  const [modalAbierto, setModalAbierto] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [errorAccion, setErrorAccion] = useState('');

  // Identificación del tipo de monitoría
  const tipoBackend = datos.tipoBackend || '';
  const permiteInscripcion = ['preparcial', 'saber_pro'].includes(
    tipoBackend
  );

  // Datos de la monitoría
  const cupo = Number(datos.cupo) || 0;
  const inscritosActuales = Number(datos.inscritos) || 0;

  const yaInscrito = Boolean(datos.inscrito) ||
    datos.estado === 'Inscrito';

  const cupoLleno =
    cupo > 0 && inscritosActuales >= cupo;

  const cupoMinimo = Number(datos.cupoMinimo ?? 1);

  const cupoMinimoAlcanzado =
    datos.cupoMinimoAlcanzado ??
    inscritosActuales >= cupoMinimo;

  const estadoActual = yaInscrito
    ? 'Inscrito'
    : cupoLleno
      ? 'Cupo lleno'
      : datos.estado || 'Disponible';

  const temas = Array.isArray(datos.temas)
    ? datos.temas
    : [];

  const porcentaje = cupo > 0
    ? Math.min((inscritosActuales / cupo) * 100, 100)
    : 0;

  // Fecha y horario
  const horarioSeparado = datos.horario?.split('·') || [];

  const fecha =
    datos.fecha ||
    horarioSeparado[0]?.trim() ||
    'Por definir';

  const hora =
    datos.hora ||
    horarioSeparado.slice(1).join(' · ').trim() ||
    '';

  const horarioCompleto = datos.horario ||
    [fecha, hora].filter(Boolean).join(' · ');

  const horaInicio = hora.split(/[–—]/)[0]?.trim() || '';

  // Información del tutor
  const nombreMonitor = datos.monitor || 'Tutor no asignado';
  const iniciales = datos.iniciales || 'TU';
  const modalidad = datos.modalidad || 'Por definir';
  const lugar = datos.lugar || 'Por definir';

  const descripcion =
    datos.descripcion ||
    'No hay una descripción adicional registrada para esta monitoría.';

  // Abrir modal de inscripción
  const abrirConfirmacion = () => {
    if (
      !permiteInscripcion ||
      yaInscrito ||
      cupoLleno ||
      modoTutor
    ) {
      return;
    }

    setAccionPendiente('inscribir');
    setErrorAccion('');
    setModalAbierto(true);
  };

  // Abrir modal de cancelación
  const abrirConfirmacionCancelacion = () => {
    if (
      !permiteInscripcion ||
      !yaInscrito ||
      modoTutor
    ) {
      return;
    }

    setAccionPendiente('cancelar');
    setErrorAccion('');
    setModalAbierto(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    if (procesando) return;

    setModalAbierto(false);
    setAccionPendiente(null);
    setErrorAccion('');
  };

  // Confirmar inscripción o cancelación
  const confirmarAccion = async () => {
    if (!datos.id || !accionPendiente || procesando) {
      return;
    }

    setProcesando(true);
    setErrorAccion('');

    try {
      if (accionPendiente === 'inscribir') {
        if (typeof onInscribirse !== 'function') {
          throw new Error('El servicio de inscripción no está disponible.');
        }

        await onInscribirse(datos);
      } else {
        if (typeof onCancelarInscripcion !== 'function') {
          throw new Error('El servicio de cancelación no está disponible.');
        }

        await onCancelarInscripcion(datos);
      }

      setModalAbierto(false);
      setAccionPendiente(null);
    } catch (error) {
      setErrorAccion(
        error.message || 'No se pudo completar la operación.'
      );
    } finally {
      setProcesando(false);
    }
  };

  // Abrir perfil del monitor
  const abrirPerfilMonitor = () => {
    if (!datos.tutorId) return;

    onVerPerfilTutor?.({
      ...datos,
      id: datos.tutorId,
      nombre: nombreMonitor,
      iniciales,
      especialidad: datos.especialidad || datos.programa || 'Monitor académico',
      semestreTutor: datos.semestreMonitor || datos.semestreTutor || '',
      calificacion: datos.calificacion ?? null,
    });
  };

  // Si no existe una monitoría seleccionada
  if (!monitoria) {
    return (
      <div className="detalle-layout">
        <Sidebar
          paginaActiva={modoTutor ? 'Monitorías asignadas' : 'Monitorías'}
          onNavegar={onNavegar}
        />

        <div className="detalle-contenido">
          <Navbar
            titulo="Detalle monitoría"
            onNavegar={onNavegar}
          />

          <main className="detalle-main">
            <p className="monitorias-vacio">
              No se encontró la información de esta monitoría.
            </p>

            <button
              type="button"
              onClick={() => onNavegar?.(
                modoTutor ? 'Monitorías asignadas' : 'Monitorías'
              )}
            >
              Volver a monitorías
            </button>
          </main>
        </div>
      </div>
    );
  }

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
                onNavegar?.(
                  modoTutor ? 'Monitorías asignadas' : 'Monitorías'
                )
              }
            >
              Monitorías
            </button>

            <span>/</span>

            <strong>{datos.titulo || 'Detalle de monitoría'}</strong>
          </div>

          {/* ENCABEZADO */}
          <section className="detalle-encabezado">

            <div className="detalle-encabezado-info">

              <div className="detalle-titulo-fila">
                <h1>{datos.titulo || 'Monitoría'}</h1>

                <span className="detalle-tipo">
                  {datos.tipo || 'Monitoría'}
                </span>

                <span className="detalle-estado">
                  {estadoActual}
                </span>
              </div>

              <p>
                {horarioCompleto} · {modalidad}
              </p>

            </div>

            {!modoTutor && permiteInscripcion && yaInscrito ? (
              <button
                className="detalle-boton-cancelar-inscripcion"
                type="button"
                onClick={abrirConfirmacionCancelacion}
              >
                Cancelar inscripción
              </button>
            ) : !modoTutor && permiteInscripcion ? (
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

          {/* AVISO: INSCRIPCIÓN CONFIRMADA */}
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
                  {horaInicio && (
                    <> a las <b>{horaInicio}</b></>
                  )}.
                </p>
              </div>

            </section>
          )}

          {/* AVISO: PREPARACIÓN PARA PARCIAL */}
          {['Pre-parcial', 'Saber Pro'].includes(datos.tipo) && (
            <section className="detalle-aviso">

              <span
                className="detalle-aviso-icono"
                aria-hidden="true"
              >
                i
              </span>

              <div>
                <strong>Preparación académica</strong>

                <p>
                  Esta monitoría está orientada a la preparación de{' '}
                  <b>
                    {datos.preparacion ||
                      'las evaluaciones de la asignatura'}
                  </b>.
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
                    {iniciales}
                  </div>

                  <div className="detalle-monitor-datos">

                    <strong>{nombreMonitor}</strong>

                    <p>
                      {datos.semestreMonitor ||
                        datos.semestreTutor ||
                        'Información académica no disponible'}
                    </p>

                    <div className="detalle-puntuacion">
                      {datos.calificacion != null ? (
                        <>
                          <span className="detalle-estrellas">
                            ★★★★★
                          </span>

                          <b>{datos.calificacion}</b>
                        </>
                      ) : (
                        <b>Calificación no disponible</b>
                      )}
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={abrirPerfilMonitor}
                    disabled={!datos.tutorId}
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
                  <strong>{datos.tipo || 'No definido'}</strong>
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

                {cupoMinimoAlcanzado ? (
                  <p>
                    ✓ Se alcanzó el mínimo de inscritos.
                  </p>
                ) : (
                  <p className="detalle-inscripciones-pendientes">
                    Necesita{' '}
                    {Math.max(0, cupoMinimo - inscritosActuales)}
                    {' '}inscripciones más para alcanzar el mínimo.
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
                {accionPendiente === 'inscribir'
                  ? 'Confirmar inscripción'
                  : 'Cancelar inscripción'}
              </h2>

              {accionPendiente === 'inscribir' ? (
                <p>
                  ¿Deseas inscribirte en la{' '}
                  <strong>{datos.titulo}</strong> del{' '}
                  <strong>{horarioCompleto}</strong>?

                  {' '}

                  Esta monitoría es {modalidad.toLowerCase()} en{' '}
                  <strong>{lugar}</strong>.

                  {!cupoMinimoAlcanzado && (
                    <>
                      {' '}Actualmente faltan{' '}
                      <strong>
                        {Math.max(0, cupoMinimo - inscritosActuales)}
                      </strong>{' '}
                      inscripciones para alcanzar el mínimo requerido.
                    </>
                  )}
                </p>
              ) : (
                <p>
                  ¿Estás seguro de que deseas cancelar tu inscripción
                  en la monitoría{' '}
                  <strong>{datos.titulo}</strong>?
                  Tu cupo quedará disponible para otro estudiante.
                </p>
              )}

              {/* ERROR */}
              {errorAccion && (
                <p
                  role="alert"
                  className="monitorias-error"
                >
                  {errorAccion}
                </p>
              )}

              <div className="detalle-modal-acciones">

                <button
                  type="button"
                  className="detalle-modal-cancelar"
                  onClick={cerrarModal}
                  disabled={procesando}
                >
                  Volver
                </button>

                <button
                  type="button"
                  className="detalle-modal-confirmar"
                  onClick={confirmarAccion}
                  disabled={procesando}
                >
                  {procesando
                    ? 'Procesando...'
                    : accionPendiente === 'inscribir'
                      ? 'Confirmar inscripción'
                      : 'Sí, cancelar inscripción'}
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
