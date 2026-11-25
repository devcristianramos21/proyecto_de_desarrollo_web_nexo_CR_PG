
import { useState } from 'react';

import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';

import './monitorias.css';

const categorias = ['Todas', 'Obligatoria', 'Par', 'Pre-parcial'];

function Monitorias({
  onVerDetalle,
  onNavegar,
  monitorias = [],
  onInscribir,
  onCancelarInscripcion,
  cargando = false,
  error = '',
}) {
  const [categoria, setCategoria] = useState('Todas');

  // Monitoría seleccionada para confirmar una acción.
  const [monitoriaSeleccionada, setMonitoriaSeleccionada] = useState(null);

  // Acción pendiente: inscribir o cancelar.
  const [accionPendiente, setAccionPendiente] = useState(null);

  // Estado de procesamiento y errores del modal.
  const [procesando, setProcesando] = useState(false);
  const [errorAccion, setErrorAccion] = useState('');

  // Filtrar monitorías por categoría.
  const monitoriasFiltradas =
    categoria === 'Todas'
      ? monitorias
      : monitorias.filter((monitoria) => monitoria.tipo === categoria);

  const calcularProgreso = (inscritos, cupo) =>
    cupo > 0 ? Math.min((inscritos / cupo) * 100, 100) : 0;

  const verDetalle = (monitoria) => {
    onVerDetalle?.(monitoria);
  };

  // Abrir modal de inscripción.
  const abrirModalInscripcion = (monitoria) => {
    if (
      !['preparcial', 'saber_pro'].includes(monitoria.tipoBackend) ||
      monitoria.inscrito ||
      monitoria.estado === 'Cupo lleno'
    ) {
      return;
    }

    setMonitoriaSeleccionada(monitoria);
    setAccionPendiente('inscribir');
    setErrorAccion('');
  };

  // Abrir modal de cancelación.
  const abrirModalCancelacion = (monitoria) => {
    if (
      !['preparcial', 'saber_pro'].includes(monitoria.tipoBackend) ||
      !monitoria.inscrito
    ) {
      return;
    }

    setMonitoriaSeleccionada(monitoria);
    setAccionPendiente('cancelar');
    setErrorAccion('');
  };

  // Cerrar modal.
  const cerrarModal = () => {
    if (procesando) return;

    setMonitoriaSeleccionada(null);
    setAccionPendiente(null);
    setErrorAccion('');
  };

  // Confirmar inscripción o cancelación mediante el backend.
  const confirmarAccion = async () => {
    if (!monitoriaSeleccionada || !accionPendiente || procesando) {
      return;
    }

    setProcesando(true);
    setErrorAccion('');

    try {
      if (accionPendiente === 'inscribir') {
        if (typeof onInscribir !== 'function') {
          throw new Error('El servicio de inscripción no está disponible.');
        }

        await onInscribir(monitoriaSeleccionada);
      } else {
        if (typeof onCancelarInscripcion !== 'function') {
          throw new Error('El servicio de cancelación no está disponible.');
        }

        await onCancelarInscripcion(monitoriaSeleccionada);
      }

      // Cerrar únicamente cuando el backend confirme la operación.
      setMonitoriaSeleccionada(null);
      setAccionPendiente(null);
    } catch (error) {
      setErrorAccion(
        error.message || 'No se pudo completar la operación.'
      );
    } finally {
      setProcesando(false);
    }
  };

  const esInscripcion = accionPendiente === 'inscribir';

  const esPreParcial = ['preparcial', 'saber_pro'].includes(
    monitoriaSeleccionada?.tipoBackend
  );

  return (
    <div className="monitorias-layout">

      {/* SIDEBAR */}
      <Sidebar
        paginaActiva="Monitorías"
        onNavegar={onNavegar}
      />

      <div className="monitorias-contenido">

        {/* NAVBAR */}
        <Navbar
          titulo="Monitorías disponibles"
          onNavegar={onNavegar}
        />

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
              <strong>Prepárate para tus evaluaciones</strong>

              <p>
                Consulta las monitorías disponibles y encuentra
                sesiones de preparación para tus próximos parciales.
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

            {/* CARGANDO */}
            {cargando && (
              <p className="monitorias-vacio">
                Cargando monitorías disponibles...
              </p>
            )}

            {/* ERROR DE CARGA */}
            {!cargando && error && (
              <p
                className="monitorias-vacio"
                role="alert"
              >
                {error}
              </p>
            )}

            {/* TARJETAS */}
            {!cargando && !error && monitoriasFiltradas.map((monitoria) => {
              const progreso = calcularProgreso(
                monitoria.inscritos,
                monitoria.cupo
              );

              const esPorConfirmar =
                monitoria.tipoBackend === 'saber_pro' &&
                !monitoria.cupoMinimoAlcanzado;

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

                    {/* ALERTA DE CUPO MÍNIMO */}
                    {esPorConfirmar && (
                      <small className="monitoria-alerta">
                        <span aria-hidden="true">⚠</span>
                        {' '}Necesita{' '}
                        {Math.max(
                          0,
                          monitoria.cupoMinimo - monitoria.inscritos
                        )}{' '}
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

                    {/* Solo se permite inscripción en pre-parcial y Saber Pro */}
                    {['preparcial', 'saber_pro'].includes(
                      monitoria.tipoBackend
                    ) && (
                      <>
                        {monitoria.inscrito ? (
                          <button
                            type="button"
                            className="boton-cancelar"
                            onClick={() => abrirModalCancelacion(monitoria)}
                          >
                            Cancelar
                          </button>
                        ) : monitoria.estado !== 'Cupo lleno' && (
                          <button
                            type="button"
                            className="boton-inscripcion"
                            onClick={() => abrirModalInscripcion(monitoria)}
                          >
                            Inscribirse
                          </button>
                        )}
                      </>
                    )}

                  </div>

                </article>
              );
            })}

            {/* ESTADO VACÍO */}
            {!cargando &&
              !error &&
              monitoriasFiltradas.length === 0 && (
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

                {esPreParcial &&
                !monitoriaSeleccionada.cupoMinimoAlcanzado ? (
                  <>
                    Esta monitoría todavía no alcanza el mínimo de
                    inscritos. Necesita{' '}
                    {Math.max(
                      0,
                      monitoriaSeleccionada.cupoMinimo -
                        monitoriaSeleccionada.inscritos
                    )}{' '}
                    inscripciones más para confirmarse.
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

            {/* ERROR DE LA OPERACIÓN */}
            {errorAccion && (
              <p
                role="alert"
                className="monitorias-error"
              >
                {errorAccion}
              </p>
            )}

            <div className="monitorias-modal-acciones">

              <button
                type="button"
                className="monitorias-modal-cancelar"
                onClick={cerrarModal}
                disabled={procesando}
              >
                Volver
              </button>

              <button
                type="button"
                className="monitorias-modal-confirmar"
                onClick={confirmarAccion}
                disabled={procesando}
              >
                {procesando
                  ? 'Procesando...'
                  : esInscripcion
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
