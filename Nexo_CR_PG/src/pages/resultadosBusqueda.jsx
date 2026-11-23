
import { useMemo, useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './resultadosBusqueda.css';

const tutoresIniciales = [
  {
    id: 1,
    nombre: 'Nombre del tutor',
    iniciales: 'NT',
    programa: 'Ing. de Sistemas',
    semestre: 7,
    calificacion: 5.0,
    resenas: 32,
    materias: ['Cálculo diferencial', 'Álgebra lineal', 'Programación I'],
    disponibilidad: 'Disponible hoy',
    estado: 'disponible',
    modalidad: 'Virtual',
    favorito: false,
  },
  {
    id: 2,
    nombre: 'Nombre del tutor',
    iniciales: 'NT',
    programa: 'Matemáticas',
    semestre: 9,
    calificacion: 4.0,
    resenas: 18,
    materias: ['Ecuaciones diferenciales', 'Estadística'],
    disponibilidad: 'Ocupado hasta las 4:00 PM',
    estado: 'ocupado',
    modalidad: 'Virtual',
    favorito: false,
  },
  {
    id: 3,
    nombre: 'Nombre del tutor',
    iniciales: 'NT',
    programa: 'Ing. Industrial',
    semestre: 8,
    calificacion: 5.0,
    resenas: 24,
    materias: ['Física I', 'Cálculo diferencial'],
    disponibilidad: 'Disponible hoy',
    estado: 'disponible',
    modalidad: 'Virtual',
    favorito: false,
  },
  {
    id: 4,
    nombre: 'Nombre del tutor',
    iniciales: 'NT',
    programa: 'Ing. de Sistemas',
    semestre: 6,
    calificacion: 5.0,
    resenas: 11,
    materias: ['Bases de datos', 'Programación I'],
    disponibilidad: 'Disponible mañana',
    estado: 'manana',
    modalidad: 'Virtual',
    favorito: false,
  },
  {
    id: 5,
    nombre: 'Nombre del tutor',
    iniciales: 'NT',
    programa: 'Matemáticas',
    semestre: 10,
    calificacion: 5.0,
    resenas: 45,
    materias: ['Álgebra lineal', 'Cálculo integral'],
    disponibilidad: 'Disponible hoy',
    estado: 'disponible',
    modalidad: 'Virtual',
    favorito: false,
  },
  {
    id: 6,
    nombre: 'Nombre del tutor',
    iniciales: 'NT',
    programa: 'Física',
    semestre: 7,
    calificacion: 4.0,
    resenas: 8,
    materias: ['Física I', 'Física II', 'Cálculo'],
    disponibilidad: 'Disponible mañana',
    estado: 'manana',
    modalidad: 'Virtual',
    favorito: false,
  },
];

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
  onVerPerfilTutor,
  onSolicitarTutoria,
}) {
  const materiaBuscada =
    filtrosBusqueda.materia &&
    filtrosBusqueda.materia !== 'Todas las materias'
      ? filtrosBusqueda.materia
      : filtrosBusqueda.busqueda || 'Cálculo diferencial';

  const [tutores, setTutores] = useState(tutoresIniciales);
  const [orden, setOrden] = useState('coincidencia');
  const [paginaActual, setPaginaActual] = useState(1);

  const [filtrosActivos, setFiltrosActivos] = useState([
    materiaBuscada,
    ...(filtrosBusqueda.modalidad === 'Virtual' ? ['Virtual'] : []),
    ...(filtrosBusqueda.calificacion &&
    filtrosBusqueda.calificacion !== 'Cualquier calificación'
      ? ['4.0+ ★']
      : ['4.0+ ★']),
  ]);

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

  const cambiarFavorito = (id) => {
    setTutores((actuales) =>
      actuales.map((tutor) =>
        tutor.id === id
          ? { ...tutor, favorito: !tutor.favorito }
          : tutor
      )
    );
  };

  const tutoresFiltrados = useMemo(() => {
    let resultado = [...tutores];

    const filtroMateria = filtrosActivos.find(
      (filtro) =>
        !['Virtual', 'Presencial', '4.0+ ★'].includes(filtro)
    );

    if (filtroMateria) {
      resultado = resultado.filter((tutor) =>
        tutor.materias.some(
          (materia) =>
            normalizar(materia) === normalizar(filtroMateria)
        )
      );
    }

    if (filtrosActivos.includes('Virtual')) {
      resultado = resultado.filter(
        (tutor) => tutor.modalidad === 'Virtual'
      );
    }

    if (filtrosActivos.includes('Presencial')) {
      resultado = resultado.filter(
        (tutor) => tutor.modalidad === 'Presencial'
      );
    }

    if (filtrosActivos.includes('4.0+ ★')) {
      resultado = resultado.filter(
        (tutor) => tutor.calificacion >= 4
      );
    }

    if (orden === 'calificacion') {
      resultado.sort(
        (a, b) => b.calificacion - a.calificacion
      );
    } else if (orden === 'resenas') {
      resultado.sort((a, b) => b.resenas - a.resenas);
    }

    return resultado;
  }, [tutores, filtrosActivos, orden]);

  const tutoresPorPagina = 6;
  const totalPaginas = 4;

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
            tutor.favorito
              ? 'resultado-card__favorito--activo'
              : ''
          }`}
          onClick={() => cambiarFavorito(tutor.id)}
          aria-label={
            tutor.favorito
              ? 'Quitar de favoritos'
              : 'Agregar a favoritos'
          }
          aria-pressed={tutor.favorito}
        >
          {tutor.favorito ? '♥' : '♡'}
        </button>
      </div>

      <div className="resultado-card__calificacion">
        <span aria-hidden="true">★★★★★</span>
        <strong>{tutor.calificacion.toFixed(1)}</strong>
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
        <Navbar titulo="Resultados por búsqueda" />

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
              <h1>{tutoresFiltrados.length} tutores encontrados</h1>
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

          {tutoresVisibles.length > 0 ? (
            <section className="resultados-busqueda__grid">
              {tutoresVisibles.map(renderTarjeta)}
            </section>
          ) : (
            <div className="resultados-busqueda__vacio">
              No encontramos tutores con los filtros seleccionados.
              <button type="button" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            </div>
          )}

          {/* PAGINACIÓN */}

          <nav
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
          </nav>

        </div>
      </main>
    </div>
  );
}
