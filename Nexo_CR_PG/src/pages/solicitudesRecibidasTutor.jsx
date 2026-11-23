import { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './solicitudesRecibidasTutor.css';

export const solicitudesTutorIniciales = [
  {
    id: 204,
    estudiante: 'Nombre del estudiante',
    iniciales: 'NE',
    programaEstudiante: 'Ingeniería de Sistemas',
    semestreEstudiante: '5° semestre',
    materia: 'Cálculo diferencial',
    tema: 'Integrales definidas',
    modalidad: 'Virtual',
    fecha: '12 Jun 2025',
    estado: 'Pendiente',
    descripcion:
      'Necesito entender el teorema fundamental del cálculo antes de mi parcial.',
  },
  {
    id: 205,
    estudiante: 'Nombre del estudiante',
    iniciales: 'NE',
    programaEstudiante: 'Matemáticas',
    semestreEstudiante: '6° semestre',
    materia: 'Álgebra lineal',
    tema: 'Transformaciones lineales',
    modalidad: 'Presencial',
    fecha: '9 Jun 2025',
    estado: 'Aceptada',
    descripcion:
      'No entiendo la diferencia entre transformación lineal y función lineal.',
    horario:
      'Jueves 19 Jun · 3:00 PM — 4:00 PM',
    propuesta: true,
  },
  {
    id: 206,
    estudiante: 'Nombre del estudiante',
    iniciales: 'NE',
    programaEstudiante: 'Ingeniería',
    semestreEstudiante: '4° semestre',
    materia: 'Cálculo diferencial',
    tema: 'Límites',
    modalidad: 'Virtual',
    fecha: '7 Jun 2025',
    estado: 'Rechazada',
    descripcion:
      'Problemas con límites al infinito y formas indeterminadas.',
  },
];

const filtros = ['Todas', 'Pendientes', 'Aceptadas', 'Rechazadas'];

function SolicitudesRecibidasTutor({
  onNavegar,
  solicitudes = solicitudesTutorIniciales,
  onVerDetalle,
  onActualizarSolicitud,
}) {
  const [filtroActivo, setFiltroActivo] = useState('Todas');
  const pendientes = solicitudes.filter(
    (solicitud) => solicitud.estado === 'Pendiente'
  ).length;
  const filtradas = solicitudes.filter(
    (solicitud) =>
      filtroActivo === 'Todas' || solicitud.estado === filtroActivo.slice(0, -1)
  );

  const cambiarEstado = (solicitud, estado) => {
    onActualizarSolicitud?.(solicitud.id, { estado });
  };

  return (
    <div className="solicitudes-tutor-layout">
      <Sidebar paginaActiva="Solicitudes recibidas" onNavegar={onNavegar} />

      <div className="solicitudes-tutor-contenido">
        <Navbar titulo="Solicitudes recibidas" onNavegar={onNavegar} />

        <main className="solicitudes-tutor-main">
          <header className="solicitudes-tutor__encabezado">
            <div>
              <h1>Solicitudes de tutoría</h1>
              <p>Solicitudes recibidas de estudiantes</p>
            </div>
            {pendientes > 0 && (
              <span className="solicitudes-tutor__pendientes">
                {pendientes} {pendientes === 1 ? 'pendiente' : 'pendientes'}
              </span>
            )}
          </header>

          <nav className="solicitudes-tutor__tabs" aria-label="Filtrar solicitudes">
            {filtros.map((filtro) => (
              <button
                type="button"
                key={filtro}
                className={`solicitudes-tutor__tab ${
                  filtroActivo === filtro ? 'solicitudes-tutor__tab--activa' : ''
                }`}
                onClick={() => setFiltroActivo(filtro)}
              >
                {filtro}
                {filtro === 'Pendientes' && pendientes > 0 && (
                  <span>{pendientes}</span>
                )}
              </button>
            ))}
          </nav>

          <section className="solicitudes-tutor__lista" aria-live="polite">
            {filtradas.map((solicitud) => (
              <article className="solicitudes-tutor__tarjeta" key={solicitud.id}>
                <div className="solicitudes-tutor__tarjeta-cabecera">
                  <div className="solicitudes-tutor__persona">
                    <span className="solicitudes-tutor__avatar">
                      {solicitud.iniciales || 'NE'}
                    </span>
                    <div>
                      <h2>{solicitud.estudiante}</h2>
                      <p>
                        {solicitud.materia} · {solicitud.tema}
                      </p>
                      <span>{solicitud.fecha}</span>
                    </div>
                  </div>
                  <span
                    className={`solicitudes-tutor__estado solicitudes-tutor__estado--${solicitud.estado.toLowerCase()}`}
                  >
                    {solicitud.estado}
                  </span>
                </div>

                <p className="solicitudes-tutor__descripcion">
                  {solicitud.descripcion}
                </p>

                <div className="solicitudes-tutor__acciones">
                  <button
                    type="button"
                    className="solicitudes-tutor__boton solicitudes-tutor__boton--secundario"
                    onClick={() => onVerDetalle?.(solicitud)}
                  >
                    Ver detalle
                  </button>

                  {solicitud.estado === 'Pendiente' && (
                    <>
                      <button
                        type="button"
                        className="solicitudes-tutor__boton solicitudes-tutor__boton--principal"
                        onClick={() => cambiarEstado(solicitud, 'Aceptada')}
                      >
                        Aceptar
                      </button>
                      <button
                        type="button"
                        className="solicitudes-tutor__boton solicitudes-tutor__boton--rechazar"
                        onClick={() => cambiarEstado(solicitud, 'Rechazada')}
                      >
                        Rechazar
                      </button>
                    </>
                  )}

                  {solicitud.estado === 'Aceptada' && (
                    <button
                      type="button"
                      className="solicitudes-tutor__boton solicitudes-tutor__boton--secundario"
                      disabled
                      title="Falta el frame de Figma para proponer un horario."
                    >
                      Proponer horario
                    </button>
                  )}
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}

export default SolicitudesRecibidasTutor;
