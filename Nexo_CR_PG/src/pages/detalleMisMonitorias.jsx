
import { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './detalleMisMonitorias.css';

function DetalleTutoria({
  onNavegar,
  tutoria,
  onCancelarTutoria,
  onVerPerfilTutor,
  onEnviarMensajeTutor,
  modoTutor = false,
}) {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const datos = {
    id: 1,
    materia: 'Cálculo diferencial',
    tema: 'Integrales definidas',
    tutor: 'Nombre del tutor',
    programaTutor: 'Ingeniería de Sistemas',
    semestreTutor: '7° semestre',
    fecha: 'Jueves, 19 de junio de 2025',
    hora: '3:00 PM — 4:00 PM',
    duracion: '60 minutos',
    modalidad: 'Virtual',
    estado: 'Programada',
    enlace: 'plataforma-reunion.ejemplo/sala-tutoria',
    ...tutoria,
  };

  // Confirmar cancelación de la tutoría
  const confirmarCancelacion = () => {
    if (onCancelarTutoria) {
      onCancelarTutoria(datos.id);
    }

    setMostrarConfirmacion(false);
    onNavegar('Mis monitorias');
  };

  const tutorActual = {
    id: datos.tutorId ?? `tutoria-${datos.id}`,
    nombre: datos.tutor,
    programa: datos.programaTutor,
    semestreTutor: datos.semestreTutor,
    calificacion: datos.calificacion,
    iniciales: datos.iniciales || 'NT',
  };

  const enviarMensaje = () => {
    if (onEnviarMensajeTutor) {
      onEnviarMensajeTutor(tutorActual);
      return;
    }

    onNavegar('Mensajes');
  };

  return (
    <div className="detalle-tutoria-layout">
      <Sidebar
        paginaActiva={modoTutor ? 'Monitorías asignadas' : 'Mis monitorias'}
        onNavegar={onNavegar}
      />

      <main className="detalle-tutoria-contenido">
        <Navbar
          titulo="Detalle de tutoría"
          onNavegar={onNavegar}
        />

        <div className="detalle-tutoria-principal">

          {/* MIGAS DE PAN */}
          <div className="detalle-tutoria-migas">
            <button onClick={() => onNavegar(modoTutor ? 'Monitorías asignadas' : 'Mis monitorias')}>
              {modoTutor ? 'Mis monitorías' : 'Mis tutorías'}
            </button>
            <span>/</span>
            <span>Detalle de tutoría</span>
          </div>

          {/* ENCABEZADO */}
          <div className="detalle-tutoria-encabezado">
            <h1>Detalle de tutoría</h1>
            <span className="detalle-tutoria-estado">
              {datos.estado}
            </span>
          </div>

          {/* INFORMACIÓN DEL TUTOR */}
          <section className="detalle-tutoria-card tutor-card">
            <div className="tutor-avatar">NT</div>

            <div className="tutor-datos">
              <h2>{datos.tutor}</h2>
              <p>
                {datos.programaTutor} · {datos.semestreTutor}
              </p>
            </div>

            <button
              className="btn-ver-perfil"
              onClick={() => onVerPerfilTutor?.(tutorActual)}
            >
              Ver perfil
            </button>
          </section>

          {/* INFORMACIÓN DE LA SESIÓN */}
          <section className="detalle-tutoria-card sesion-card">
            <h3>INFORMACIÓN DE LA SESIÓN</h3>

            <div className="sesion-grid">
              <div className="sesion-dato">
                <span>Materia</span>
                <p>{datos.materia}</p>
              </div>

              <div className="sesion-dato">
                <span>Tema</span>
                <p>{datos.tema}</p>
              </div>

              <div className="sesion-dato">
                <span>Modalidad</span>
                <p>{datos.modalidad}</p>
              </div>

              <div className="sesion-dato">
                <span>Fecha</span>
                <p>{datos.fecha}</p>
              </div>

              <div className="sesion-dato">
                <span>Hora</span>
                <p>{datos.hora}</p>
              </div>

              <div className="sesion-dato">
                <span>Duración</span>
                <p>{datos.duracion}</p>
              </div>
            </div>
          </section>

          {/* ENLACE DE REUNIÓN VIRTUAL */}
          {datos.modalidad === 'Virtual' && (
            <section className="detalle-tutoria-card reunion-card">
              <h3>ENLACE DE REUNIÓN VIRTUAL</h3>

              <div className="reunion-enlace">
                <a
                  href={`https://${datos.enlace}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {datos.enlace}
                </a>
                <span>(enlace de ejemplo)</span>
              </div>

              <p>
                El enlace estará activo 10 minutos antes del inicio
                de la sesión.
              </p>
            </section>
          )}

          {/* BOTONES DE ACCIÓN */}
          <div className="detalle-tutoria-acciones">
            <button
              className="btn-mensaje"
              onClick={enviarMensaje}
            >
              Enviar mensaje
            </button>

            <button
              className="btn-reprogramar"
              disabled
              title="No hay un frame de reprogramación de tutoría en la referencia Figma."
            >
              Reprogramar
            </button>

            <button
              className="btn-cancelar-tutoria"
              onClick={() => setMostrarConfirmacion(true)}
            >
              Cancelar tutoría
            </button>
          </div>
        </div>
      </main>

      {/* MODAL DE CONFIRMACIÓN */}
      {mostrarConfirmacion && (
        <div
          className="modal-cancelacion-overlay"
          onClick={() => setMostrarConfirmacion(false)}
        >
          <div
            className="modal-cancelacion"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-cancelacion"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="titulo-cancelacion">
              Cancelar tutoría
            </h2>

            <p>
              ¿Estás seguro de que deseas cancelar esta tutoría?
              El tutor será notificado. Esta acción no se puede
              deshacer.
            </p>

            <div className="modal-cancelacion-acciones">
              <button
                className="btn-mantener"
                onClick={() => setMostrarConfirmacion(false)}
              >
                No, mantener
              </button>

              <button
                className="btn-confirmar-cancelacion"
                onClick={confirmarCancelacion}
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetalleTutoria;
