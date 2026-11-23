
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import StudentStats from '../components/layout/studentStats';
import UpcomingExam from '../components/layout/upComingExam';
import TutorCard from '../components/layout/tutorCard';

import './homeEstudiantes.css';

const tutoresIniciales = [
  {
    id: 1,
    nombre: 'Nombre del tutor',
    iniciales: 'NT',
    especialidad: 'Ingeniería de Sistemas',
    semestre: 7,
    calificacion: 4.9,
    resenas: 32,
    materias: ['Cálculo diferencial', 'Álgebra lineal'],
    disponible: true,
    favorito: false,
  },
  {
    id: 2,
    nombre: 'Nombre del tutor',
    iniciales: 'FC',
    especialidad: 'Matemáticas',
    semestre: 6,
    calificacion: 4.8,
    resenas: 24,
    materias: ['Álgebra lineal', 'Cálculo'],
    disponible: true,
    favorito: false,
  },
  {
    id: 3,
    nombre: 'Nombre del tutor',
    iniciales: 'AM',
    especialidad: 'Ingeniería Industrial',
    semestre: 8,
    calificacion: 4.7,
    resenas: 19,
    materias: ['Estadística', 'Cálculo diferencial'],
    disponible: false,
    favorito: false,
  },
];

export default function HomeEstudiante({
  onNavegar,
  onVerPerfilTutor,
  onSolicitarTutoria,
  onInscribirMonitoria,
  onEnviarMensajeTutor,
  onVerDetalleTutoria,
  monitorias = [],
  tutorias = [],
  tutoresFavoritos = [],
  onToggleFavorito,
}) {
  const tutores = tutoresIniciales;
  const monitoriasDestacadas = monitorias
    .filter((monitoria) => monitoria.tipo === 'Pre-parcial')
    .slice(0, 2);
  const proximaTutoria = tutorias.find(
    (tutoria) => tutoria.categoria === 'Proximas'
  );

  return (
    <div className="home-estudiante">
      <Sidebar
        paginaActiva="Inicio"
        onNavegar={onNavegar}
      />

      <main className="home-estudiante__principal">
        <Navbar
          titulo="Inicio"
          onNavegar={onNavegar}
        />

        <div className="home-estudiante__contenido">
          <section className="bienvenida">
            <div className="bienvenida__texto">
              <p className="bienvenida__saludo">
                Bienvenido de nuevo
              </p>

              <h2>Hola, estudiante</h2>

              <p>¿Qué necesitas aprender hoy?</p>
            </div>

            <StudentStats
              tutoriasActivas={3}
              sesionesCompletadas={12}
              solicitudesPendientes={2}
            />
          </section>

          <UpcomingExam
            titulo="Parcial de Cálculo Diferencial en 7 días"
            fecha="Lunes 23 Sep - Aula 301"
            descripcion="Hay una monitoría pre-parcial disponible el Sáb 20 Sep."
            onVerCalendario={() => onNavegar?.('Calendario')}
            onInscribirse={() => onNavegar?.('Monitorías')}
          />

          {/* MONITORÍAS DISPONIBLES */}
          <section className="seccion-home">
            <div className="seccion-home__encabezado">
              <h2>MONITORÍAS DISPONIBLES</h2>

              <button
                type="button"
                onClick={() => onNavegar?.('Monitorías')}
              >
                Ver todas
              </button>
            </div>

            <div className="monitorias-grid">
              {monitoriasDestacadas.map((monitoria) => (
                <article
                  className="monitoria-card"
                  key={monitoria.id}
                >
                  <div className="monitoria-card__etiquetas">
                    <span>{monitoria.tipo}</span>
                  </div>

                  <h3>{monitoria.titulo}</h3>

                  <p>
                    {monitoria.monitor} · {monitoria.horario}
                  </p>

                  <button
                    type="button"
                    disabled={
                      monitoria.estado === 'Inscrito' ||
                      monitoria.estado === 'Cupo lleno' ||
                      monitoria.inscritos >= monitoria.cupo
                    }
                    onClick={() => onInscribirMonitoria?.(monitoria)}
                  >
                    {monitoria.estado === 'Inscrito'
                      ? 'Inscrito'
                      : monitoria.estado === 'Cupo lleno' ||
                          monitoria.inscritos >= monitoria.cupo
                        ? 'Cupo lleno'
                        : 'Inscribirse'}
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* PRÓXIMA TUTORÍA */}
          <section className="seccion-home">
            <div className="seccion-home__encabezado">
              <h2>PRÓXIMA TUTORÍA</h2>
            </div>

            <article className="tutoria-card">
              <div className="tutoria-card__avatar">
                NT
              </div>

              <div className="tutoria-card__informacion">
                <h3>{proximaTutoria?.tutor || 'Nombre del tutor'}</h3>

                <p>
                  {proximaTutoria
                    ? `${proximaTutoria.materia} · ${proximaTutoria.tema}`
                    : 'Cálculo diferencial · Integrales'}
                </p>

                <span>
                  {proximaTutoria
                    ? `${proximaTutoria.fecha} · ${proximaTutoria.hora} · ${proximaTutoria.modalidad}`
                    : 'Jueves, 3:00 PM — 4:00 PM · Virtual'}
                </span>
              </div>

              <span className="tutoria-card__estado">
                Programada
              </span>

              <div className="tutoria-card__acciones">
                <button
                  type="button"
                  onClick={() => {
                    if (proximaTutoria) onVerDetalleTutoria?.(proximaTutoria);
                    else onNavegar?.('Mis monitorias');
                  }}
                >
                  Ver detalles
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onEnviarMensajeTutor?.({
                      nombre: proximaTutoria?.tutor || 'Nombre del tutor',
                      programa: proximaTutoria?.programaTutor || 'Ingeniería de Sistemas',
                      semestre: proximaTutoria?.semestreTutor || '7° semestre',
                      iniciales: 'NT',
                    })
                  }
                >
                  Mensaje
                </button>
              </div>
            </article>
          </section>

          {/* TUTORES RECOMENDADOS */}
          <section className="seccion-home seccion-home--tutores">
            <div className="seccion-home__encabezado">
              <h2>TUTORES RECOMENDADOS</h2>

              <button
                type="button"
                onClick={() => onNavegar?.('Buscar tutores')}
              >
                Ver todos
              </button>
            </div>

            <div className="tutores-grid">
              {tutores.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  {...tutor}
                  favorito={tutoresFavoritos.some(
                    (favorito) => favorito.id === tutor.id
                  )}
                  onToggleFavorito={() => onToggleFavorito?.(tutor)}
                  onVerPerfil={() =>
                    onVerPerfilTutor?.(tutor)
                  }
                  onSolicitar={() =>
                    onSolicitarTutoria?.(tutor)
                  }
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
