
import { useState } from 'react';

import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';

import './monitorias.css';

const monitoriasIniciales = [
  {
    id: 1,
    titulo: 'Monitoría Cálculo Diferencial',
    tipo: 'Obligatoria',
    estado: 'Disponible',
    monitor: 'Andrés Moreno',
    horario: 'Lunes y miércoles 2:00 – 4:00 PM',
    inscritos: 0,
    cupo: 20,
  },
  {
    id: 2,
    titulo: 'Pre-parcial Cálculo Diferencial',
    tipo: 'Pre-parcial',
    estado: 'Por confirmar',
    monitor: 'Andrés Moreno',
    horario: 'Sáb 20 Sep · 9:00 – 11:00 AM',
    preparacion: 'Preparación para: Parcial Lun 23 Sep',
    inscritos: 3,
    cupo: 20,
  },
  {
    id: 3,
    titulo: 'Monitoría Par Programación II',
    tipo: 'Par',
    estado: 'Disponible',
    monitor: 'Carlos Herrera',
    horario: 'Viernes 4:00 – 6:00 PM',
    inscritos: 2,
    cupo: 5,
  },
  {
    id: 4,
    titulo: 'Monitoría Par Microeconomía',
    tipo: 'Par',
    estado: 'Inscrito',
    monitor: 'Valentina Gómez',
    horario: 'Miércoles 5:00 – 6:00 PM',
    inscritos: 2,
    cupo: 3,
  },
  {
    id: 5,
    titulo: 'Monitoría Álgebra Lineal',
    tipo: 'Obligatoria',
    estado: 'Cupo lleno',
    monitor: 'Felipe Castro',
    horario: 'Martes y jueves 3:00 – 5:00 PM',
    inscritos: 25,
    cupo: 25,
  },
];

const categorias = ['Todas', 'Obligatoria', 'Par', 'Pre-parcial'];

function Monitorias({ onVerDetalle, onNavegar }) {
  const [categoria, setCategoria] = useState('Todas');
  const [monitorias, setMonitorias] = useState(monitoriasIniciales);

  const monitoriasFiltradas =
    categoria === 'Todas'
      ? monitorias
      : monitorias.filter((monitoria) => monitoria.tipo === categoria);

  const actualizarInscripcion = (id) => {
    setMonitorias((actuales) =>
      actuales.map((monitoria) => {
        if (monitoria.id !== id) return monitoria;

        if (monitoria.estado === 'Inscrito') {
          return {
            ...monitoria,
            estado: 'Disponible',
            inscritos: Math.max(0, monitoria.inscritos - 1),
          };
        }

        if (monitoria.inscritos >= monitoria.cupo) {
          return monitoria;
        }

        return {
          ...monitoria,
          estado: 'Inscrito',
          inscritos: monitoria.inscritos + 1,
        };
      })
    );
  };

  const calcularProgreso = (inscritos, cupo) =>
    Math.min((inscritos / cupo) * 100, 100);

  const verDetalle = (monitoria) => {
    if (onVerDetalle) {
      onVerDetalle(monitoria);
    }
  };

  return (
    <div className="monitorias-layout">
      <Sidebar
        paginaActiva="Monitorías"
        onNavegar={onNavegar}
      />

      <div className="monitorias-contenido">
        <Navbar titulo="Monitorías disponibles" />

        <main className="monitorias-main">
          <section className="monitorias-encabezado">
            <h1>Monitorías disponibles</h1>
            <p>
              Sesiones de apoyo académico — Universidad del Rosario ·
              Semestre 2026-2
            </p>
          </section>

          <section className="monitorias-aviso">
            <div className="monitorias-aviso__icono" aria-hidden="true">
              <img src="/assets/calendar_clock_23dp_E3E3E3_FILL0_wght400_GRAD0_opsz24 1.svg" alt="" />
            </div>

            <div className="monitorias-aviso__contenido">
              <strong>Parciales en los próximos 7 días</strong>
              <p>
                Cálculo Diferencial (Lun 23 Sep), Álgebra Lineal
                (Mar 24 Sep), Programación II (Mié 25 Sep).
                Inscríbete en las monitorías pre-parcial antes de que
                se cancelen por bajo cupo.
              </p>
            </div>
          </section>

          <div className="monitorias-filtros" role="tablist" aria-label="Filtrar monitorías">
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

          <section className="monitorias-lista">
            {monitoriasFiltradas.map((monitoria) => (
              <article
                className={`monitoria-card ${
                  monitoria.id === 2 ? 'monitoria-card--preparcial' : ''
                }`}
                key={monitoria.id}
              >
                <div className="monitoria-informacion">
                  <div className="monitoria-titulo-fila">
                    <h2>{monitoria.titulo}</h2>

                    <span className={`monitoria-tipo tipo-${monitoria.tipo.toLowerCase().replaceAll('-', '')}`}>
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

                  {monitoria.preparacion && (
                    <p className="monitoria-preparacion">
                      <span aria-hidden="true">▣</span>
                      {monitoria.preparacion}
                    </p>
                  )}

                  <p className="monitoria-horario">
                    <strong>{monitoria.monitor}</strong>
                    {' · '}
                    {monitoria.horario}
                  </p>

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
                        style={{
                          width: `${calcularProgreso(
                            monitoria.inscritos,
                            monitoria.cupo
                          )}%`,
                        }}
                      />
                    </div>

                    <small>
                      {monitoria.inscritos}/{monitoria.cupo} inscritos
                    </small>
                  </div>

                  {monitoria.estado === 'Por confirmar' && (
                    <small className="monitoria-alerta">
                      <span aria-hidden="true">⚠</span>
                      Necesita {monitoria.cupo - monitoria.inscritos} inscripciones más para confirmarse
                    </small>
                  )}
                </div>

                <div className="monitoria-acciones">
                  <button
                    type="button"
                    className="boton-detalle"
                    onClick={() => verDetalle(monitoria)}
                  >
                    Ver detalle
                  </button>

                  {monitoria.estado !== 'Cupo lleno' && (
                    <button
                      type="button"
                      className={
                        monitoria.estado === 'Inscrito'
                          ? 'boton-cancelar'
                          : 'boton-inscripcion'
                      }
                      onClick={() => actualizarInscripcion(monitoria.id)}
                    >
                      {monitoria.estado === 'Inscrito'
                        ? 'Cancelar'
                        : 'Inscribirse'}
                    </button>
                  )}
                </div>
              </article>
            ))}

            {monitoriasFiltradas.length === 0 && (
              <p className="monitorias-vacio">
                No hay monitorías disponibles en esta categoría.
              </p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Monitorias;
