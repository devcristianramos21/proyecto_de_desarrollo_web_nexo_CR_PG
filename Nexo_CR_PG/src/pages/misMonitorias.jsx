
import { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './MisMonitorias.css';

export const tutoriasIniciales = [
  // TUTORÍAS PRÓXIMAS
  {
    id: 1,
    materia: 'Cálculo diferencial',
    tema: 'Integrales definidas',
    tutor: 'Nombre del tutor',
    programaTutor: 'Ingeniería de Sistemas',
    semestreTutor: '7° semestre',
    calificacion: '4.9',
    fecha: 'Jueves, 19 de junio de 2025',
    hora: '3:00 PM — 4:00 PM',
    duracion: '60 minutos',
    modalidad: 'Virtual',
    estado: 'Programada',
    categoria: 'Proximas',
    enlace: 'plataforma-reunion.ejemplo/sala-tutoria',
  },
  {
    id: 2,
    materia: 'Programación I',
    tema: 'Listas enlazadas',
    tutor: 'Nombre del tutor',
    programaTutor: 'Ingeniería de Sistemas',
    semestreTutor: '7° semestre',
    calificacion: '4.9',
    fecha: 'Lunes, 23 de junio de 2025',
    hora: '2:00 PM — 3:00 PM',
    duracion: '60 minutos',
    modalidad: 'Virtual',
    estado: 'Programada',
    categoria: 'Proximas',
    enlace: 'plataforma-reunion.ejemplo/sala-tutoria',
  },

  // TUTORÍAS FINALIZADAS
  {
    id: 3,
    materia: 'Álgebra lineal',
    tema: 'Vectores',
    tutor: 'Nombre del tutor',
    programaTutor: 'Matemáticas',
    semestreTutor: '7° semestre',
    fecha: 'Mar 10 Jun',
    hora: '10:00 AM',
    duracion: '60 minutos',
    modalidad: 'Presencial',
    estado: 'Completada',
    categoria: 'Finalizadas',
    evaluada: false,
  },
  {
    id: 4,
    materia: 'Física I',
    tema: 'Cinemática',
    tutor: 'Nombre del tutor',
    programaTutor: 'Física',
    semestreTutor: '6° semestre',
    fecha: 'Vie 7 Jun',
    hora: '3:00 PM',
    duracion: '60 minutos',
    modalidad: 'Presencial',
    estado: 'Completada',
    categoria: 'Finalizadas',
    evaluada: false,
  },
];

const pestañas = [
  { id: 'Proximas', nombre: 'Próximas' },
  { id: 'Finalizadas', nombre: 'Finalizadas' },
  { id: 'Canceladas', nombre: 'Canceladas' },
];

function MisMonitorias({
  onNavegar,
  onVerDetalleTutoria,
  onEvaluarTutoria,
  tutorias,
  setTutorias,
}) {
  const [filtroActivo, setFiltroActivo] = useState('Proximas');

  // Filtrar tutorías según la pestaña seleccionada
  const tutoriasFiltradas = tutorias.filter(
    (tutoria) => tutoria.categoria === filtroActivo
  );

  // Contador de próximas tutorías
  const cantidadProximas = tutorias.filter(
    (tutoria) => tutoria.categoria === 'Proximas'
  ).length;

  // Cancelar tutoría
  const cancelarTutoria = (id) => {
    setTutorias((actuales) =>
      actuales.map((tutoria) =>
        tutoria.id === id
          ? {
              ...tutoria,
              categoria: 'Canceladas',
              estado: 'Cancelada',
            }
          : tutoria
      )
    );
  };

  // Abrir detalle
  const verTutoria = (tutoria) => {
    if (onVerDetalleTutoria) {
      onVerDetalleTutoria(tutoria);
    }
  };

  // Abrir evaluación
  const evaluarTutoria = (tutoria) => {
    if (onEvaluarTutoria) {
      onEvaluarTutoria(tutoria);
    }
  };

  // Reprogramar tutoría
  const reprogramarTutoria = (tutoria) => {
    alert(
      `La reprogramación de ${tutoria.materia} estará disponible próximamente.`
    );
  };

  return (
    <div className="mis-tutorias-layout">
      <Sidebar
        paginaActiva="Mis tutorías"
        onNavegar={onNavegar}
      />

      <div className="mis-tutorias-contenido">
        <Navbar titulo="Mis tutorías" />

        <main className="mis-tutorias-main">

          {/* ENCABEZADO */}
          <header className="mis-tutorias__encabezado">
            <h1>Mis tutorías</h1>
            <p>Historial y próximas sesiones de tutoría</p>
          </header>

          {/* PESTAÑAS */}
          <nav className="mis-tutorias__tabs">
            {pestañas.map((pestaña) => (
              <button
                type="button"
                key={pestaña.id}
                className={`mis-tutorias__tab ${
                  filtroActivo === pestaña.id
                    ? 'mis-tutorias__tab--activa'
                    : ''
                }`}
                onClick={() => setFiltroActivo(pestaña.id)}
              >
                {pestaña.nombre}

                {pestaña.id === 'Proximas' && cantidadProximas > 0 && (
                  <span className="mis-tutorias__contador">
                    {cantidadProximas}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* LISTADO DE TUTORÍAS */}
          <section className="mis-tutorias__lista">
            {tutoriasFiltradas.length > 0 ? (
              tutoriasFiltradas.map((tutoria) => (
                <article
                  className="mis-tutorias__tarjeta"
                  key={tutoria.id}
                >
                  {/* AVATAR */}
                  <div className="mis-tutorias__avatar">
                    NT
                  </div>

                  {/* INFORMACIÓN */}
                  <div className="mis-tutorias__informacion">
                    <h2>{tutoria.materia}</h2>

                    <p>
                      {tutoria.tema} · {tutoria.tutor}
                    </p>

                    <div className="mis-tutorias__datos">
                      <span className="mis-tutorias__fecha">
                        <span aria-hidden="true">▢</span>
                        {tutoria.fecha} · {tutoria.hora}
                      </span>

                      <span className="mis-tutorias__modalidad">
                        {tutoria.modalidad}
                      </span>
                    </div>
                  </div>

                  {/* ESTADO Y ACCIONES */}
                  <div className="mis-tutorias__acciones">
                    <span
                      className={`mis-tutorias__estado ${
                        tutoria.estado === 'Completada'
                          ? 'estado-completada'
                          : ''
                      }`}
                    >
                      {tutoria.estado}
                    </span>

                    <div className="mis-tutorias__botones">

                      {/* VER DETALLE */}
                      <button
                        type="button"
                        className="mis-tutorias__boton mis-tutorias__boton--ver"
                        onClick={() => verTutoria(tutoria)}
                      >
                        Ver
                      </button>

                      {/* ACCIONES DE PRÓXIMAS */}
                      {filtroActivo === 'Proximas' && (
                        <>
                          <button
                            type="button"
                            className="mis-tutorias__boton mis-tutorias__boton--reprogramar"
                            onClick={() => reprogramarTutoria(tutoria)}
                          >
                            Reprogramar
                          </button>

                          <button
                            type="button"
                            className="mis-tutorias__boton mis-tutorias__boton--cancelar"
                            onClick={() => cancelarTutoria(tutoria.id)}
                          >
                            Cancelar
                          </button>
                        </>
                      )}

                      {/* EVALUAR TUTOR */}
                      {filtroActivo === 'Finalizadas' &&
                        !tutoria.evaluada && (
                          <button
                            type="button"
                            className="mis-tutorias__boton mis-tutorias__boton--evaluar"
                            onClick={() => evaluarTutoria(tutoria)}
                          >
                            Evaluar tutor
                          </button>
                        )}

                      {filtroActivo === 'Finalizadas' &&
                        tutoria.evaluada && (
                          <span className="mis-tutorias__ya-evaluada">
                            Evaluada
                          </span>
                        )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="mis-tutorias__vacio">
                No tienes tutorías en esta categoría.
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}

export default MisMonitorias;
