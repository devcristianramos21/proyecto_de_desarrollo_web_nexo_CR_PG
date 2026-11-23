
import { useState } from 'react';

import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';

import './solicitarTutoria.css';

const horariosDisponibles = [
  { id: 1, dia: 'Lunes 16 Jun', hora: '2:00 PM — 3:00 PM' },
  { id: 2, dia: 'Lunes 16 Jun', hora: '3:00 PM — 4:00 PM' },
  { id: 3, dia: 'Martes 17 Jun', hora: '10:00 AM — 11:00 AM' },
  { id: 4, dia: 'Viernes 20 Jun', hora: '3:00 PM — 4:00 PM' },
  { id: 5, dia: 'Sábado 21 Jun', hora: '9:00 AM — 10:00 AM' },
];

export default function SolicitarTutoria({
  onNavegar,
  paginaAnterior = 'Perfil tutor',
  onVolver,
  tutor,
  onCrearSolicitud,
}) {
  const materiasTutor = tutor?.materias || [];

  const [paso, setPaso] = useState(1);
  const [materia, setMateria] = useState(
    materiasTutor[0] || 'Cálculo diferencial'
  );
  const [tema, setTema] = useState('');
  const [necesidad, setNecesidad] = useState('');
  const [modalidad, setModalidad] = useState('Virtual');
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(1);
  const [error, setError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);

  const nombreTutor = tutor?.nombre || 'Nombre del tutor';
  const programaTutor =
    tutor?.programa || tutor?.especialidad || 'Programa académico';
  const etiquetasPagina = {
    'Resultados búsqueda': 'Resultados',
    'Detalle solicitud': 'Mis solicitudes',
    'Mis solicitudes': 'Mis solicitudes',
  };

  const horarioActual = horariosDisponibles.find(
    (horario) => horario.id === horarioSeleccionado
  );

  // ========================================
  // PASO 1: INFORMACIÓN
  // ========================================

  const continuar = (event) => {
    event.preventDefault();

    if (!materia || !tema.trim() || !necesidad.trim()) {
      setError('Completa todos los campos antes de continuar.');
      return;
    }

    setError('');
    setPaso(2);
  };

  const volverInformacion = () => {
    setError('');
    setPaso(1);
  };

  // ========================================
  // PASO 2: HORARIO
  // ========================================

  const revisarSolicitud = () => {
    if (!horarioSeleccionado) {
      setError('Selecciona un horario para continuar.');
      return;
    }

    setError('');
    setPaso(3);
  };

  const volverHorario = () => {
    setError('');
    setPaso(2);
  };

  // ========================================
  // PASO 3: MODAL DE CONFIRMACIÓN
  // ========================================

  const enviarSolicitud = () => {
    setMostrarModal(true);
  };

  const confirmarEnvio = () => {
    const solicitud = {
      id: Date.now(),
      tutor: nombreTutor,
      tutorId: tutor?.id,
      tutorData: tutor || null,
      programaTutor,
      semestreTutor:
        tutor?.semestreTutor ||
        (tutor?.semestre ? `${tutor.semestre}° semestre` : 'Programa académico'),
      calificacion: tutor?.calificacion || '4.9',
      materia,
      tema: tema.trim(),
      modalidad,
      fecha: new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date()),
      estado: 'Pendiente',
      descripcion: necesidad.trim(),
      propuesta: false,
      horario: `${horarioActual?.dia || ''} · ${horarioActual?.hora || ''}`.trim(),
    };

    onCrearSolicitud?.(solicitud);
    setMostrarModal(false);
    setSolicitudEnviada(true);
  };

  return (
    <div className="solicitar-tutoria">
      <Sidebar
        paginaActiva="Buscar tutores"
        onNavegar={onNavegar}
      />

      <main className="solicitar-tutoria__principal">
        <Navbar titulo="Solicitar tutoría" onNavegar={onNavegar} />

        <div className="solicitar-tutoria__contenido">

          {/* ==================================
              PANTALLA DE ÉXITO
          ================================== */}

          {solicitudEnviada ? (
            <section className="solicitar-tutoria__exito">

              {/* ICONO DE ÉXITO */}
              <div className="solicitar-tutoria__exito-icono">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </div>

              {/* MENSAJE */}
              <h1>¡Solicitud enviada!</h1>

              <p className="solicitar-tutoria__exito-descripcion">
                Tu solicitud fue enviada a{' '}
                <strong>{nombreTutor}</strong>.
                <br />
                Recibirás una notificación cuando el tutor responda.
              </p>

              {/* AVISO */}
              <div className="solicitar-tutoria__exito-aviso">
                <span
                  className="solicitar-tutoria__exito-aviso-icono"
                  aria-hidden="true"
                >
                  ⓘ
                </span>

                <div>
                  <h2>¿Qué pasa ahora?</h2>

                  <p>
                    El tutor revisará tu solicitud y te propondrá un
                    horario. Podrás verlo en{' '}
                    <strong>Mis solicitudes</strong>.
                  </p>
                </div>
              </div>

              {/* BOTONES */}
              <div className="solicitar-tutoria__exito-acciones">

                <button
                  type="button"
                  className="solicitar-tutoria__exito-secundario"
                  onClick={() => onNavegar?.('Mis solicitudes')}
                >
                  Ver mis solicitudes
                </button>

                <button
                  type="button"
                  className="solicitar-tutoria__exito-principal"
                  onClick={() => onNavegar?.('Inicio')}
                >
                  Ir al inicio
                </button>

              </div>
            </section>
          ) : (
            <>

              {/* ==================================
                  BREADCRUMB
              ================================== */}

              <div className="solicitar-tutoria__breadcrumb">
                <button
                  type="button"
                  onClick={() =>
                    onVolver
                      ? onVolver()
                      : onNavegar?.('Perfil tutor')
                  }
                >
                  {etiquetasPagina[paginaAnterior] || paginaAnterior}
                </button>

                <span>/</span>

                <strong>Solicitar tutoría</strong>
              </div>

              {/* ==================================
                  ENCABEZADO
              ================================== */}

              <header className="solicitar-tutoria__encabezado">
                <h1>Solicitar tutoría</h1>

                <p>
                  Con: <strong>{nombreTutor}</strong> · {programaTutor}
                </p>
              </header>

              {/* ==================================
                  INDICADOR DE PASOS
              ================================== */}

              <div className="solicitar-tutoria__pasos">

                {/* INFORMACIÓN */}
                <div
                  className={`solicitar-tutoria__paso ${
                    paso === 1
                      ? 'solicitar-tutoria__paso--activo'
                      : 'solicitar-tutoria__paso--completado'
                  }`}
                >
                  <div className="solicitar-tutoria__circulo">
                    {paso === 1 ? '1' : '✓'}
                  </div>

                  <span>Información</span>
                </div>

                <div
                  className={`solicitar-tutoria__linea ${
                    paso >= 2
                      ? 'solicitar-tutoria__linea--completada'
                      : ''
                  }`}
                />

                {/* HORARIO */}
                <div
                  className={`solicitar-tutoria__paso ${
                    paso === 2
                      ? 'solicitar-tutoria__paso--activo'
                      : paso === 3
                        ? 'solicitar-tutoria__paso--completado'
                        : ''
                  }`}
                >
                  <div className="solicitar-tutoria__circulo">
                    {paso === 3 ? '✓' : '2'}
                  </div>

                  <span>Horario</span>
                </div>

                <div
                  className={`solicitar-tutoria__linea ${
                    paso === 3
                      ? 'solicitar-tutoria__linea--completada'
                      : ''
                  }`}
                />

                {/* CONFIRMAR */}
                <div
                  className={`solicitar-tutoria__paso ${
                    paso === 3
                      ? 'solicitar-tutoria__paso--activo'
                      : ''
                  }`}
                >
                  <div className="solicitar-tutoria__circulo">
                    3
                  </div>

                  <span>Confirmar</span>
                </div>

              </div>

              {/* ==================================
                  PASO 1: INFORMACIÓN
              ================================== */}

              {paso === 1 && (
                <form
                  className="solicitar-tutoria__formulario"
                  onSubmit={continuar}
                >
                  <div className="solicitar-tutoria__campo">
                    <label htmlFor="materia-tutoria">
                      Materia
                    </label>

                    <select
                      id="materia-tutoria"
                      value={materia}
                      onChange={(event) =>
                        setMateria(event.target.value)
                      }
                      required
                    >
                      {materiasTutor.length > 0 ? (
                        materiasTutor.map((nombreMateria) => (
                          <option
                            key={nombreMateria}
                            value={nombreMateria}
                          >
                            {nombreMateria}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Cálculo diferencial">
                            Cálculo diferencial
                          </option>

                          <option value="Álgebra lineal">
                            Álgebra lineal
                          </option>

                          <option value="Programación I">
                            Programación I
                          </option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="solicitar-tutoria__campo">
                    <label htmlFor="tema-tutoria">
                      Tema específico
                    </label>

                    <input
                      id="tema-tutoria"
                      type="text"
                      value={tema}
                      onChange={(event) => setTema(event.target.value)}
                      placeholder="ej. Integrales definidas, regla de la cadena..."
                      required
                    />
                  </div>

                  <div className="solicitar-tutoria__campo">
                    <label htmlFor="necesidad-tutoria">
                      Describe tu necesidad académica
                    </label>

                    <textarea
                      id="necesidad-tutoria"
                      value={necesidad}
                      onChange={(event) =>
                        setNecesidad(event.target.value)
                      }
                      placeholder="Cuéntale al tutor en qué necesitas apoyo, qué has intentado y qué tienes pendiente..."
                      required
                    />

                    <span className="solicitar-tutoria__ayuda">
                      Cuanto más detallado, mejor puede prepararse el tutor.
                    </span>
                  </div>

                  <div className="solicitar-tutoria__campo">
                    <label>Modalidad</label>

                    <div className="solicitar-tutoria__modalidades">
                      {['Virtual', 'Presencial'].map((opcion) => (
                        <label
                          key={opcion}
                          className={`solicitar-tutoria__opcion ${
                            modalidad === opcion
                              ? 'solicitar-tutoria__opcion--activa'
                              : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name="modalidad"
                            value={opcion}
                            checked={modalidad === opcion}
                            onChange={() => setModalidad(opcion)}
                          />

                          <span>{opcion}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <p
                      className="solicitar-tutoria__error"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}

                  <div className="solicitar-tutoria__acciones">
                    <button
                      type="submit"
                      className="solicitar-tutoria__continuar"
                    >
                      Continuar
                      <span aria-hidden="true">›</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ==================================
                  PASO 2: HORARIO
              ================================== */}

              {paso === 2 && (
                <section className="solicitar-tutoria__formulario solicitar-tutoria__formulario--horario">

                  <div className="solicitar-tutoria__titulo-horario">
                    <h2>Selecciona un horario</h2>
                    <p>Disponibilidad del tutor esta semana</p>
                  </div>

                  <div className="solicitar-tutoria__lista-horarios">
                    {horariosDisponibles.map((horario) => (
                      <button
                        type="button"
                        key={horario.id}
                        className={`solicitar-tutoria__horario ${
                          horarioSeleccionado === horario.id
                            ? 'solicitar-tutoria__horario--seleccionado'
                            : ''
                        }`}
                        onClick={() => {
                          setHorarioSeleccionado(horario.id);
                          setError('');
                        }}
                        aria-pressed={
                          horarioSeleccionado === horario.id
                        }
                      >
                        <span
                          className="solicitar-tutoria__icono-horario"
                          aria-hidden="true"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="5"
                              width="18"
                              height="16"
                              rx="2"
                            />

                            <path d="M16 3v4M8 3v4M3 10h18" />

                            <circle cx="16.5" cy="16.5" r="3" />

                            <path d="M16.5 15v1.7l1 0.6" />
                          </svg>
                        </span>

                        <span>
                          {horario.dia} · {horario.hora}
                        </span>

                        {horarioSeleccionado === horario.id && (
                          <span className="solicitar-tutoria__horario-etiqueta">
                            Seleccionado
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {error && (
                    <p
                      className="solicitar-tutoria__error"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}

                  <div className="solicitar-tutoria__acciones solicitar-tutoria__acciones--horario">
                    <button
                      type="button"
                      className="solicitar-tutoria__atras"
                      onClick={volverInformacion}
                    >
                      Atrás
                    </button>

                    <button
                      type="button"
                      className="solicitar-tutoria__continuar"
                      onClick={revisarSolicitud}
                    >
                      Revisar solicitud
                    </button>
                  </div>

                </section>
              )}

              {/* ==================================
                  PASO 3: RESUMEN
              ================================== */}

              {paso === 3 && (
                <section className="solicitar-tutoria__formulario solicitar-tutoria__formulario--confirmar">

                  <h2 className="solicitar-tutoria__titulo-resumen">
                    Resumen de la solicitud
                  </h2>

                  <div className="solicitar-tutoria__resumen">
                    <div className="solicitar-tutoria__fila-resumen">
                      <span>Tutor</span>
                      <strong>{nombreTutor}</strong>
                    </div>

                    <div className="solicitar-tutoria__fila-resumen">
                      <span>Materia</span>
                      <strong>{materia}</strong>
                    </div>

                    <div className="solicitar-tutoria__fila-resumen">
                      <span>Tema</span>
                      <strong>{tema}</strong>
                    </div>

                    <div className="solicitar-tutoria__fila-resumen">
                      <span>Modalidad</span>
                      <strong>{modalidad}</strong>
                    </div>

                    <div className="solicitar-tutoria__fila-resumen">
                      <span>Horario preferido</span>
                      <strong>
                        {horarioActual?.dia} · {horarioActual?.hora}
                      </strong>
                    </div>
                  </div>

                  <div className="solicitar-tutoria__aviso">
                    <span
                      className="solicitar-tutoria__aviso-icono"
                      aria-hidden="true"
                    >
                      ⓘ
                    </span>

                    <p>
                      El tutor confirmará o propondrá un horario diferente.
                      Recibirás una notificación con su respuesta.
                    </p>
                  </div>

                  <div className="solicitar-tutoria__acciones solicitar-tutoria__acciones--confirmar">
                    <button
                      type="button"
                      className="solicitar-tutoria__atras"
                      onClick={volverHorario}
                    >
                      Atrás
                    </button>

                    <button
                      type="button"
                      className="solicitar-tutoria__continuar solicitar-tutoria__enviar"
                      onClick={enviarSolicitud}
                    >
                      Enviar solicitud
                    </button>
                  </div>

                </section>
              )}

              {/* ==================================
                  MODAL DE CONFIRMACIÓN
              ================================== */}

              {mostrarModal && (
                <div
                  className="solicitar-tutoria__overlay"
                  onClick={() => setMostrarModal(false)}
                >
                  <section
                    className="solicitar-tutoria__modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="titulo-confirmacion"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <h2 id="titulo-confirmacion">
                      Confirmar solicitud
                    </h2>

                    <p>
                      ¿Confirmas que deseas enviar esta solicitud de tutoría
                      a <strong>{nombreTutor}</strong>?
                    </p>

                    <div className="solicitar-tutoria__modal-acciones">
                      <button
                        type="button"
                        className="solicitar-tutoria__modal-cancelar"
                        onClick={() => setMostrarModal(false)}
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        className="solicitar-tutoria__modal-confirmar"
                        onClick={confirmarEnvio}
                      >
                        Confirmar y enviar
                      </button>
                    </div>
                  </section>
                </div>
              )}

            </>
          )}

        </div>
      </main>
    </div>
  );
}
