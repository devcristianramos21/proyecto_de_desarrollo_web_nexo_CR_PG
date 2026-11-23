
import { useState } from 'react';

import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';

import './buscarTutores.css';

const materias = [
  'Cálculo diferencial',
  'Álgebra lineal',
  'Programación I',
  'Bases de datos',
  'Estadística',
  'Física I',
  'Ecuaciones diferenciales',
  'Estructuras de datos',
];

const opcionesMateria = [
  'Todas las materias',
  ...materias,
];

export default function BuscarTutores({ onNavegar, onBuscar }) {
  const [busqueda, setBusqueda] = useState('');
  const [materia, setMateria] = useState('Todas las materias');
  const [disponibilidad, setDisponibilidad] = useState('Cualquier horario');
  const [modalidad, setModalidad] = useState('Ambas modalidades');
  const [calificacion, setCalificacion] = useState('Cualquier calificación');
  const [tema, setTema] = useState('');

  const seleccionarMateria = (nombre) => {
    setMateria(nombre);
    setBusqueda(nombre);
  };

  const realizarBusqueda = (event) => {
    event.preventDefault();

    const filtros = {
      busqueda,
      materia,
      disponibilidad,
      modalidad,
      calificacion,
      tema,
    };

    console.log('Filtros de búsqueda:', filtros);

    // Enviamos los filtros a App.jsx
    onBuscar?.(filtros);
  };

  return (
    <div className="buscar-tutores">
      <Sidebar
        paginaActiva="Buscar tutores"
        onNavegar={onNavegar}
      />

      <main className="buscar-tutores__principal">
        <Navbar titulo="Buscar tutores" />

        <div className="buscar-tutores__contenido">
          <header className="buscar-tutores__encabezado">
            <h2>Buscar tutores</h2>
            <p>Encuentra el tutor ideal para tu materia</p>
          </header>

          <form
            className="busqueda-card"
            onSubmit={realizarBusqueda}
          >
            <label className="busqueda-card__titulo">
              ¿QUÉ NECESITAS APRENDER?
            </label>

            <div className="busqueda-card__buscador">
              <span
                className="busqueda-card__icono"
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="10.8"
                    cy="10.8"
                    r="6.3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="m15.5 15.5 4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <input
                type="search"
                placeholder="Buscar por materia, tema o programa..."
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
              />
            </div>

            <p className="busqueda-card__subtitulo">FILTROS</p>

            <div className="busqueda-card__filtros">
              <div className="filtro">
                <label htmlFor="filtro-materia">Materia</label>
                <select
                  id="filtro-materia"
                  value={materia}
                  onChange={(event) => setMateria(event.target.value)}
                >
                  {opcionesMateria.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filtro">
                <label htmlFor="filtro-disponibilidad">
                  Disponibilidad
                </label>
                <select
                  id="filtro-disponibilidad"
                  value={disponibilidad}
                  onChange={(event) =>
                    setDisponibilidad(event.target.value)
                  }
                >
                  <option>Cualquier horario</option>
                  <option>Disponible hoy</option>
                  <option>Disponible entre semana</option>
                  <option>Disponible fines de semana</option>
                </select>
              </div>

              <div className="filtro">
                <label htmlFor="filtro-modalidad">Modalidad</label>
                <select
                  id="filtro-modalidad"
                  value={modalidad}
                  onChange={(event) => setModalidad(event.target.value)}
                >
                  <option>Ambas modalidades</option>
                  <option>Virtual</option>
                  <option>Presencial</option>
                </select>
              </div>

              <div className="filtro">
                <label htmlFor="filtro-calificacion">
                  Calificación mínima
                </label>
                <select
                  id="filtro-calificacion"
                  value={calificacion}
                  onChange={(event) =>
                    setCalificacion(event.target.value)
                  }
                >
                  <option>Cualquier calificación</option>
                  <option>3.0 estrellas</option>
                  <option>4.0 estrellas</option>
                  <option>4.5 estrellas</option>
                  <option>5.0 estrellas</option>
                </select>
              </div>
            </div>

            <div className="filtro filtro--tema">
              <label htmlFor="filtro-tema">Tema específico</label>
              <input
                id="filtro-tema"
                type="text"
                placeholder="ej. Integrales, recursividad, regresión lineal..."
                value={tema}
                onChange={(event) => setTema(event.target.value)}
              />
            </div>

            <button
              type="submit"
              className="busqueda-card__boton"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle
                  cx="10.8"
                  cy="10.8"
                  r="6.3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="m15.5 15.5 4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              Buscar tutores
            </button>
          </form>

          <section className="materias-populares">
            <h3>MATERIAS POPULARES</h3>

            <div className="materias-populares__lista">
              {materias.map((nombre) => (
                <button
                  type="button"
                  key={nombre}
                  className={`materias-populares__chip ${
                    materia === nombre
                      ? 'materias-populares__chip--activo'
                      : ''
                  }`}
                  onClick={() => seleccionarMateria(nombre)}
                >
                  {nombre}
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
