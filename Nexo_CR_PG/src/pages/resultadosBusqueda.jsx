
import { useMemo, useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './resultadosBusqueda.css';

function normalizar(texto = '') {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export default function ResultadosBusqueda({
  onNavegar,
  filtrosBusqueda = {},
  tutores = [],
  cargando = false,
  error = '',
  onVerPerfilTutor,
  onSolicitarTutoria,
  tutoresFavoritos = [],
  onToggleFavorito,
}) {
  const materiaBuscada =
    filtrosBusqueda.materia &&
    filtrosBusqueda.materia !== 'Todas las materias'
      ? filtrosBusqueda.materia
      : filtrosBusqueda.busqueda || 'Todas las materias';
  const materiaSeleccionada = filtrosBusqueda.materia
    && filtrosBusqueda.materia !== 'Todas las materias'
    ? filtrosBusqueda.materia
    : '';

  const [orden, setOrden] = useState('coincidencia');
  const [paginaActual, setPaginaActual] = useState(1);
  const [fechaReferencia] = useState(() => new Date());
  const filtrosIniciales = [
    ...(materiaSeleccionada
      ? [materiaSeleccionada]
      : filtrosBusqueda.busqueda
        ? [filtrosBusqueda.busqueda]
        : []),
    ...(filtrosBusqueda.disponibilidad
      && filtrosBusqueda.disponibilidad !== 'Cualquier horario'
      ? [filtrosBusqueda.disponibilidad]
      : []),
    ...(filtrosBusqueda.modalidad
      && filtrosBusqueda.modalidad !== 'Ambas modalidades'
      ? [filtrosBusqueda.modalidad]
      : []),
    ...(filtrosBusqueda.calificacion
      && filtrosBusqueda.calificacion !== 'Cualquier calificación'
      ? [`${Number.parseFloat(filtrosBusqueda.calificacion).toFixed(1)}+ ★`]
      : []),
  ];
  const [filtrosActivos, setFiltrosActivos] = useState(filtrosIniciales);

  const quitarFiltro = (filtro) => {
    setFiltrosActivos((actuales) =>
      actuales.filter((actual) => actual !== filtro)
    );
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    setFiltrosActivos([]);
    setPaginaActual(1);
  };

  const tutoresFiltrados = useMemo(() => {
    const filtroMateria = materiaSeleccionada
      && filtrosActivos.includes(materiaSeleccionada)
      ? materiaSeleccionada
      : '';
    const filtroTexto = !filtroMateria
      && filtrosBusqueda.busqueda
      && filtrosActivos.includes(filtrosBusqueda.busqueda)
      ? normalizar(filtrosBusqueda.busqueda)
      : '';
    const filtroDisponibilidad = filtrosActivos.find((filtro) =>
      ['Disponible hoy', 'Disponible entre semana', 'Disponible fines de semana'].includes(filtro)
    );
    const filtroCalificacion = filtrosActivos.find((filtro) => filtro.endsWith('+ ★'));
    const minimoCalificacion = filtroCalificacion
      ? Number.parseFloat(filtroCalificacion)
      : null;
    const partesHora = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Bogota',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(fechaReferencia);
    const partesFecha = Object.fromEntries(
      partesHora.map(({ type, value }) => [type, value])
    );
    const diasSemana = {
      Sunday: 'domingo',
      Monday: 'lunes',
      Tuesday: 'martes',
      Wednesday: 'miercoles',
      Thursday: 'jueves',
      Friday: 'viernes',
      Saturday: 'sabado',
    };
    const diaActual = diasSemana[partesFecha.weekday];
    const horaActual = `${partesFecha.hour}:${partesFecha.minute}`;

    let resultado = tutores.map((tutor) => {
      const horarios = tutor.horarios || [];
      const iniciales = (tutor.nombre || 'Tutor')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join('')
        .toUpperCase();
      return {
        ...tutor,
        id: String(tutor._id),
        programa: tutor.carrera || 'Programa académico',
        semestre: tutor.semestre ?? '—',
        iniciales,
        materias: tutor.materias || [],
        horarios,
        disponibilidad: horarios.length ? 'Horarios registrados' : 'Sin horarios registrados',
        estado: horarios.length ? 'disponible' : 'ocupado',
        resenas: tutor.resenas ?? 0,
      };
    });

    if (filtroMateria) {
      const materiaNormalizada = normalizar(filtroMateria);
      resultado = resultado.filter((tutor) =>
        tutor.materias.some((materia) => normalizar(materia).includes(materiaNormalizada))
      );
    } else if (filtroTexto) {
      resultado = resultado.filter((tutor) => normalizar([
        tutor.nombre,
        tutor.carrera,
        tutor.biografia,
        ...(tutor.materias || []),
      ].join(' ')).includes(filtroTexto));
    }

    if (filtroDisponibilidad === 'Disponible hoy') {
      resultado = resultado.filter((tutor) => tutor.horarios.some((horario) =>
        horario.diaSemana === diaActual && horario.horaFin > horaActual
      ));
    } else if (filtroDisponibilidad === 'Disponible entre semana') {
      resultado = resultado.filter((tutor) => tutor.horarios.some((horario) =>
        ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].includes(horario.diaSemana)
      ));
    } else if (filtroDisponibilidad === 'Disponible fines de semana') {
      resultado = resultado.filter((tutor) => tutor.horarios.some((horario) =>
        ['sabado', 'domingo'].includes(horario.diaSemana)
      ));
    }

    if (minimoCalificacion != null) {
      resultado = resultado.filter((tutor) =>
        tutor.calificacion != null && tutor.calificacion >= minimoCalificacion
      );
    }

    if (orden === 'calificacion') {
      resultado.sort((a, b) => (b.calificacion ?? -1) - (a.calificacion ?? -1));
    } else if (orden === 'resenas') {
      resultado.sort((a, b) => b.resenas - a.resenas);
    }

    return resultado;
  }, [fechaReferencia, filtrosActivos, filtrosBusqueda.busqueda, materiaSeleccionada, orden, tutores]);

  const tutoresPorPagina = 6;
  const totalPaginas = Math.max(
    1,
    Math.ceil(tutoresFiltrados.length / tutoresPorPagina)
  );

  const tutoresVisibles = tutoresFiltrados.slice(
    (paginaActual - 1) * tutoresPorPagina,
    paginaActual * tutoresPorPagina
  );

  // CORRECCIÓN: usar el nombre correcto de la propiedad
  const mostrarPerfil = (tutor) => {
    if (onVerPerfilTutor) {
      onVerPerfilTutor(tutor);
    }
  };

  const solicitarTutoria = (tutor) => {
    onSolicitarTutoria?.(tutor);
  };

  const renderTarjeta = (tutor, indice) => (
    <article
      className={`resultado-card ${
        indice < 3
          ? 'resultado-card--superior'
          : 'resultado-card--inferior'
      }`}
      key={tutor.id}
    >
      <div className="resultado-card__encabezado">
        <div className="resultado-card__avatar">
          {tutor.iniciales}
        </div>

        <div className="resultado-card__identidad">
          <h2>{tutor.nombre}</h2>
          <p>
            {tutor.programa} · {tutor.semestre}° sem
          </p>
        </div>

        <button
          type="button"
          className={`resultado-card__favorito ${
            tutoresFavoritos.some((favorito) => favorito.id === tutor.id)
              ? 'resultado-card__favorito--activo'
              : ''
          }`}
          onClick={() => onToggleFavorito?.(tutor)}
          aria-label={
            tutoresFavoritos.some((favorito) => favorito.id === tutor.id)
              ? 'Quitar de favoritos'
              : 'Agregar a favoritos'
          }
          aria-pressed={tutoresFavoritos.some(
            (favorito) => favorito.id === tutor.id
          )}
        >
          {tutoresFavoritos.some((favorito) => favorito.id === tutor.id) ? '♥' : '♡'}
        </button>
      </div>

      <div className="resultado-card__calificacion">
        <span aria-hidden="true">{tutor.calificacion == null ? '☆☆☆☆☆' : '★★★★★'}</span>
        <strong>{tutor.calificacion == null ? '—' : Number(tutor.calificacion).toFixed(1)}</strong>
        <span className="resultado-card__resenas">
          ({tutor.resenas})
        </span>
      </div>

      <div className="resultado-card__materias">
        {tutor.materias.map((materia) => (
          <span key={materia}>{materia}</span>
        ))}
      </div>

      <div className="resultado-card__disponibilidad">
        <span
          className={`resultado-card__punto resultado-card__punto--${tutor.estado}`}
        />
        <span>{tutor.disponibilidad}</span>
      </div>

      <div className="resultado-card__acciones">
        <button
          type="button"
          className="resultado-card__ver"
          onClick={() => mostrarPerfil(tutor)}
        >
          Ver perfil
        </button>

        <button
          type="button"
          className="resultado-card__solicitar"
          onClick={() => solicitarTutoria(tutor)}
        >
          Solicitar
        </button>
      </div>
    </article>
  );

  return (
    <div className="resultados-busqueda">
      <Sidebar
        paginaActiva="Buscar tutores"
        onNavegar={onNavegar}
      />

      <main className="resultados-busqueda__principal">
        <Navbar titulo="Resultados por búsqueda" onNavegar={onNavegar} />

        <div className="resultados-busqueda__contenido">

          {/* BREADCRUMB */}

          <div className="resultados-busqueda__breadcrumb">
            <button
              type="button"
              onClick={() => onNavegar?.('Buscar tutores')}
            >
              Buscar tutores
            </button>
            <span>/</span>
            <strong>Resultados</strong>
          </div>

          {/* ENCABEZADO */}

          <header className="resultados-busqueda__encabezado">
            <div>
              <h1>{cargando ? 'Buscando tutores…' : `${tutoresFiltrados.length} tutores encontrados`}</h1>
              <p>
                Para: <strong>{materiaBuscada}</strong>
              </p>
            </div>

            <div className="resultados-busqueda__orden">
              <label htmlFor="orden-resultados">Ordenar por</label>

              <select
                id="orden-resultados"
                value={orden}
                onChange={(event) => {
                  setOrden(event.target.value);
                  setPaginaActual(1);
                }}
              >
                <option value="coincidencia">Mejor coincidencia</option>
                <option value="calificacion">Mejor calificación</option>
                <option value="resenas">Más reseñas</option>
              </select>
            </div>
          </header>

          {/* FILTROS ACTIVOS */}

          <div className="resultados-busqueda__filtros">
            <div className="resultados-busqueda__chips">
              {filtrosActivos.map((filtro) => (
                <button
                  type="button"
                  className="resultado-chip"
                  key={filtro}
                  onClick={() => quitarFiltro(filtro)}
                >
                  <span />
                  {filtro}
                  <strong>×</strong>
                </button>
              ))}

              {filtrosActivos.length === 0 && (
                <span className="resultado-filtros-vacios">
                  No hay filtros activos
                </span>
              )}
            </div>

            <button
              type="button"
              className="resultados-busqueda__limpiar"
              onClick={limpiarFiltros}
            >
              Limpiar todo
            </button>
          </div>

          {/* TARJETAS */}

          {error && <p role="alert">{error}</p>}
          {cargando ? (
            <p role="status">Cargando resultados…</p>
          ) : tutoresVisibles.length > 0 ? (
            <section className="resultados-busqueda__grid">
              {tutoresVisibles.map(renderTarjeta)}
            </section>
          ) : !error && (
            <div className="resultados-busqueda__vacio">
              No encontramos tutores con los filtros seleccionados.
              <button type="button" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            </div>
          )}

          {/* PAGINACIÓN */}

          {!cargando && tutoresFiltrados.length > tutoresPorPagina && <nav
            className="resultados-busqueda__paginacion"
            aria-label="Paginación de resultados"
          >
            <button
              type="button"
              disabled={paginaActual === 1}
              onClick={() =>
                setPaginaActual((actual) => Math.max(1, actual - 1))
              }
            >
              ‹
            </button>

            {Array.from({ length: totalPaginas }, (_, indice) => (
              <button
                type="button"
                key={indice + 1}
                className={
                  paginaActual === indice + 1
                    ? 'pagina-activa'
                    : ''
                }
                onClick={() => setPaginaActual(indice + 1)}
              >
                {indice + 1}
              </button>
            ))}

            <button
              type="button"
              disabled={paginaActual === totalPaginas}
              onClick={() =>
                setPaginaActual((actual) =>
                  Math.min(totalPaginas, actual + 1)
                )
              }
            >
              ›
            </button>
          </nav>}

        </div>
      </main>
    </div>
  );
}
