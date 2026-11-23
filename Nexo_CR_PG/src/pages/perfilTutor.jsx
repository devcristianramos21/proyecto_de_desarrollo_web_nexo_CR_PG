
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';

import './perfilTutor.css';

const NOMBRES_DIAS = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

export default function PerfilTutor({
  onNavegar,
  paginaAnterior = 'Resultados búsqueda',
  onVolver,
  tutor,
  onSolicitar,
  onEnviarMensaje,
  favoritos = [],
  onToggleFavorito,
}) {
  const datosTutor = {
    ...(tutor || {}),
    nombre: tutor?.nombre || 'Tutor no disponible',
    iniciales: tutor?.nombre
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0])
      .join('')
      .toUpperCase() || 'TU',
    programa:
      tutor?.programa ||
      tutor?.especialidad ||
      tutor?.programaTutor ||
      'Programa académico no disponible',
    disponibilidad: tutor
      ? tutor.disponibilidad ||
        (tutor.disponible ? 'Disponible hoy' : 'Disponibilidad por confirmar')
      : 'Disponibilidad por confirmar',
    calificacion: tutor?.calificacion ?? null,
    resenas: tutor?.resenas ?? 0,
  };

  const calificacion = datosTutor.calificacion == null
    ? '—'
    : Number(datosTutor.calificacion).toFixed(1);
  const resenas = datosTutor.resenas;
  const materiasTutor = (tutor?.materias || []).map((nombre) => ({ nombre, temas: [] }));
  const semestreTexto = datosTutor.semestreTutor ||
    (tutor?.semestre != null
      ? `${tutor.semestre}° semestre`
      : 'Semestre no disponible');
  const horariosTutor = (tutor?.horarios || []).map((horario) => ({
    dia: NOMBRES_DIAS[horario.diaSemana] || horario.diaSemana,
    horario: `${horario.horaInicio} — ${horario.horaFin}`,
  }));
  const sobreMi = tutor?.biografia || 'El tutor no ha agregado una biografía.';
  const etiquetasPagina = {
    'Resultados búsqueda': 'Resultados',
    'Detalle monitoría': 'Monitorías',
    'Detalle tutoría': 'Mis tutorías',
    'Detalle solicitud': 'Mis solicitudes',
  };

  const favorito = favoritos.some(
    (item) => item.id != null && item.id === datosTutor.id
  );

  // Solicitar tutoría
  const solicitarTutoria = () => {
    if (onSolicitar) {
      onSolicitar(datosTutor);
    } else {
      onNavegar?.('Solicitar tutoría');
    }
  };

  // Enviar mensaje
  const enviarMensaje = () => {
    if (onEnviarMensaje) {
      onEnviarMensaje(datosTutor);
    } else {
      onNavegar?.('Mensajes');
    }
  };

  // Guardar o quitar de favoritos
  const cambiarFavorito = () => {
    onToggleFavorito?.(datosTutor);
  };

  return (
    <div className="perfil-tutor">
      <Sidebar
        paginaActiva="Buscar tutores"
        onNavegar={onNavegar}
      />

      <main className="perfil-tutor__principal">
        <Navbar titulo="Perfil del tutor" onNavegar={onNavegar} />

        <div className="perfil-tutor__contenido">

          {/* BREADCRUMB */}
          <div className="perfil-tutor__breadcrumb">
            <button
              type="button"
              onClick={() =>
                onVolver
                  ? onVolver()
                  : onNavegar?.('Resultados búsqueda')
              }
            >
              {etiquetasPagina[paginaAnterior] || paginaAnterior}
            </button>

            <span>/</span>

            <strong>Perfil del tutor</strong>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="perfil-tutor__columnas">

            {/* COLUMNA IZQUIERDA */}
            <section className="perfil-tutor__izquierda">

              {/* INFORMACIÓN PRINCIPAL */}
              <article className="perfil-tutor__tarjeta perfil-tutor__presentacion">
                <div className="perfil-tutor__avatar">
                  {datosTutor.iniciales}
                </div>

                <div className="perfil-tutor__identidad">
                  <h1>{datosTutor.nombre}</h1>

                  <p>
                    {datosTutor.programa} · {semestreTexto}
                  </p>

                  <div className="perfil-tutor__calificacion">
                    <span className="perfil-tutor__estrellas">
                      {datosTutor.calificacion == null ? '☆☆☆☆☆' : '★★★★★'}
                    </span>

                    <strong>
                      {calificacion}
                    </strong>

                    <span>· {resenas} reseñas</span>
                  </div>

                  <div className="perfil-tutor__estado">
                    <span />
                    {datosTutor.disponibilidad}
                  </div>
                </div>

                <div className="perfil-tutor__acciones-superiores">
                  <button
                    type="button"
                    className={`perfil-tutor__guardar ${
                      favorito ? 'perfil-tutor__guardar--activo' : ''
                    }`}
                    onClick={cambiarFavorito}
                  >
                    <span>{favorito ? '♥' : '♡'}</span>
                    {favorito ? 'Guardado' : 'Guardar'}
                  </button>

                  <button
                    type="button"
                    className="perfil-tutor__solicitar"
                    onClick={solicitarTutoria}
                  >
                    Solicitar tutoría
                  </button>
                </div>
              </article>

              {/* SOBRE MÍ */}
              <article className="perfil-tutor__tarjeta perfil-tutor__sobre-mi">
                <h2>Sobre mí</h2>

                <p>{sobreMi}</p>
              </article>

              {/* MATERIAS Y TEMAS */}
              <article className="perfil-tutor__tarjeta perfil-tutor__materias">
                <h2>Materias y temas</h2>

                <div className="perfil-tutor__grupos-materias">
                  {materiasTutor.map((materia) => (
                    <div
                      className="perfil-tutor__grupo-materia"
                      key={materia.nombre}
                    >
                      <h3>{materia.nombre}</h3>

                      <div className="perfil-tutor__temas">
                        {materia.temas.map((tema) => (
                          <span key={tema}>{tema}</span>
                        ))}
                        {materiasTutor.length === 0 && (
                          <p>El tutor no tiene materias registradas.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            {/* COLUMNA DERECHA */}
            <aside className="perfil-tutor__derecha">

              {/* DISPONIBILIDAD */}
              <article className="perfil-tutor__tarjeta perfil-tutor__disponibilidad">
                <h2>DISPONIBILIDAD</h2>

                <div className="perfil-tutor__horarios">
                  {horariosTutor.map((item) => (
                    <div
                      className="perfil-tutor__fila-horario"
                      key={item.dia}
                    >
                      <strong>{item.dia}</strong>

                      <span
                        className={
                          item.noDisponible
                            ? 'perfil-tutor__horario-no-disponible'
                            : ''
                        }
                      >
                        {item.horario}
                      </span>
                    </div>
                  ))}
                  {horariosTutor.length === 0 && (
                    <p>No hay disponibilidad registrada.</p>
                  )}
                </div>
              </article>

              {/* ESTADÍSTICAS Y ACCIONES */}
              <div className="perfil-tutor__estadisticas-contenedor">

                <article className="perfil-tutor__tarjeta perfil-tutor__estadisticas">
                  <h2>ESTADÍSTICAS</h2>

                  <div className="perfil-tutor__fila-estadistica">
                    <span>Tutorías realizadas</span>
                    <strong>{tutor?.tutoriasRealizadas ?? '—'}</strong>
                  </div>

                  <div className="perfil-tutor__fila-estadistica">
                    <span>Calificación</span>
                    <strong>
                      {calificacion}
                    </strong>
                  </div>

                  <div className="perfil-tutor__fila-estadistica">
                    <span>Tasa de aceptación</span>
                    <strong>{tutor?.tasaAceptacion ?? '—'}</strong>
                  </div>
                </article>

                <button
                  type="button"
                  className="perfil-tutor__solicitar-lateral"
                  onClick={solicitarTutoria}
                >
                  Solicitar tutoría
                </button>

                <button
                  type="button"
                  className="perfil-tutor__mensaje"
                  onClick={enviarMensaje}
                >
                  Enviar mensaje
                </button>

              </div>
            </aside>
          </div>

          {/* RESEÑAS */}
          <section className="perfil-tutor__tarjeta perfil-tutor__resenas">
            <div className="perfil-tutor__resenas-encabezado">
              <h2>Reseñas</h2>

              <div className="perfil-tutor__resumen-resenas">
                <span>★★★★★</span>

                <strong>
                  {calificacion}
                </strong>

                <small>· {resenas} reseñas</small>
              </div>
            </div>

            <div className="perfil-tutor__resena">
              <div className="perfil-tutor__resena-encabezado">
                <div className="perfil-tutor__avatar-estudiante">
                  NE
                </div>

                <strong>Nombre del estudiante</strong>

                <span className="perfil-tutor__estrellas-resena">
                  ★★★★★
                </span>
              </div>

              <p>
                Explicó el tema con ejemplos muy claros y tuvo mucha paciencia.
                <br />
                Llegó puntual y resolvió todas mis dudas.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
