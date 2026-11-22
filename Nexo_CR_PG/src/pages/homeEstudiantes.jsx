
import { useState } from 'react';

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

const monitorias = [
  {
    id: 1,
    titulo: 'Pre-parcial Cálculo Diferencial',
    tutor: 'Andrés Moreno',
    fecha: 'Sáb 20 Sep · 9-11 AM',
    etiquetas: ['Pre-parcial', 'URGENTE'],
  },
  {
    id: 2,
    titulo: 'Pre-parcial Álgebra Lineal',
    tutor: 'Felipe Castro',
    fecha: 'Dom 21 Sep · 10 AM-12 PM',
    etiquetas: ['Pre-parcial'],
  },
];

export default function HomeEstudiante({ onNavegar }) {
  const [tutores, setTutores] = useState(tutoresIniciales);

  const cambiarFavorito = (id) => {
    setTutores((actuales) =>
      actuales.map((tutor) =>
        tutor.id === id
          ? { ...tutor, favorito: !tutor.favorito }
          : tutor
      )
    );
  };

  const mostrarMensaje = (mensaje) => {
    alert(mensaje);
  };

  return (
    <div className="home-estudiante">
      <Sidebar
        paginaActiva="Inicio"
        onNavegar={onNavegar}
      />

      <main className="home-estudiante__principal">
        <Navbar titulo="Inicio" />

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
            onVerCalendario={() =>
              mostrarMensaje('Próximamente podrás consultar tu calendario.')
            }
            onInscribirse={() =>
              mostrarMensaje('Próximamente podrás inscribirte a esta monitoría.')
            }
          />

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
              {monitorias.map((monitoria) => (
                <article className="monitoria-card" key={monitoria.id}>
                  <div className="monitoria-card__etiquetas">
                    {monitoria.etiquetas.map((etiqueta) => (
                      <span key={etiqueta}>{etiqueta}</span>
                    ))}
                  </div>

                  <h3>{monitoria.titulo}</h3>

                  <p>
                    {monitoria.tutor} · {monitoria.fecha}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      mostrarMensaje(`Seleccionaste ${monitoria.titulo}`)
                    }
                  >
                    Inscribirse
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="seccion-home">
            <div className="seccion-home__encabezado">
              <h2>PRÓXIMA TUTORÍA</h2>
            </div>

            <article className="tutoria-card">
              <div className="tutoria-card__avatar">NT</div>

              <div className="tutoria-card__informacion">
                <h3>Nombre del tutor</h3>
                <p>Cálculo diferencial · Integrales</p>
                <span>Jueves, 3:00 PM — 4:00 PM · Virtual</span>
              </div>

              <span className="tutoria-card__estado">
                Programada
              </span>

              <div className="tutoria-card__acciones">
                <button
                  type="button"
                  onClick={() => mostrarMensaje('Detalles de la tutoría')}
                >
                  Ver detalles
                </button>

                <button
                  type="button"
                  onClick={() => mostrarMensaje('Próximamente podrás enviar mensajes.')}
                >
                  Mensaje
                </button>
              </div>
            </article>
          </section>

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
                  onToggleFavorito={() => cambiarFavorito(tutor.id)}
                  onVerPerfil={() =>
                    mostrarMensaje(`Perfil de ${tutor.nombre}`)
                  }
                  onSolicitar={() =>
                    mostrarMensaje(`Solicitud para ${tutor.nombre}`)
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
