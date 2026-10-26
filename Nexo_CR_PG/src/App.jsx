import { useState } from 'react';

import StudentStats from './components/StudentStats';
import UpcomingExam from './components/upComingExam';
import TutorCard from './components/tutorCard';

const tutoresIniciales = [
  {
    id: 1,
    nombre: 'Andrés Moreno',
    iniciales: 'AM',
    especialidad: 'Ingeniería de Sistemas',
    semestre: 7,
    calificacion: 4.9,
    resenas: 32,
    materias: ['Cálculo diferencial', 'Álgebra lineal'],
    disponible: true,
  },
  {
    id: 2,
    nombre: 'Laura Rodríguez',
    iniciales: 'LR',
    especialidad: 'Matemáticas',
    semestre: 8,
    calificacion: 4.8,
    resenas: 24,
    materias: ['Cálculo diferencial', 'Ecuaciones'],
    disponible: true,
  },
  {
    id: 3,
    nombre: 'Felipe Castro',
    iniciales: 'FC',
    especialidad: 'Ingeniería de Sistemas',
    semestre: 7,
    calificacion: 4.9,
    resenas: 28,
    materias: ['Álgebra lineal', 'Programación'],
    disponible: false,
  },
];

function App() {
  const [favoritos, setFavoritos] = useState([]);
  
  const alternarFavorito = (id) => {
    setFavoritos((actuales) =>
      actuales.includes(id)
        ? actuales.filter((favoritoId) => favoritoId !== id)
        : [...actuales, id]
    );
  };

  const verCalendario = () => {
    alert('Aquí se abrirá el calendario del estudiante.');
  };

  const inscribirseParcial = () => {
    alert('Aquí se realizará la inscripción al parcial.');
  };

  const verPerfil = (nombre) => {
    alert(`Aquí se abrirá el perfil de ${nombre}.`);
  };

  const solicitarTutoria = (nombre) => {
    alert(`Aquí se realizará la solicitud de tutoría con ${nombre}.`);
  };

  return (
    <main className="dashboard">
      <section className="dashboard__bienvenida">
        <div>
          <p className="dashboard__saludo">Bienvenido de nuevo</p>
          <h1>Hola, estudiante</h1>
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
        descripcion="Hay una monitoría pre-parcial disponible el sábado 20 Sep."
        onVerCalendario={verCalendario}
        onInscribirse={inscribirseParcial}
      />

      <section className="dashboard__tutores">
        <div className="dashboard__seccion-encabezado">
          <h2>Tutores recomendados</h2>
          <button
            type="button"
            className="dashboard__ver-todos"
            onClick={() => alert('Aquí se mostrará la lista completa de tutores.')}
          >
            Ver todos ›
          </button>
        </div>

        <div className="dashboard__tutores-grid">
          {tutoresIniciales.map((tutor) => (
            <TutorCard
              key={tutor.id}
              {...tutor}
              favorito={favoritos.includes(tutor.id)}
              onToggleFavorito={() => alternarFavorito(tutor.id)}
              onVerPerfil={() => verPerfil(tutor.nombre)}
              onSolicitar={() => solicitarTutoria(tutor.nombre)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;