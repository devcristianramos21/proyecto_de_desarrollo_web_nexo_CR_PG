
import { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './Favoritos.css';

const tutoresIniciales = [
  {
    id: 1,
    nombre: 'Nombre del tutor',
    programa: 'Ing. de Sistemas · 7° sem',
    calificacion: '5.0',
    opiniones: 32,
    materias: ['Cálculo diferencial', 'Álgebra lineal'],
    disponibilidad: 'Disponible hoy',
    estado: 'disponible',
  },
  {
    id: 2,
    nombre: 'Nombre del tutor',
    programa: 'Matemáticas · 9° sem',
    calificacion: '4.0',
    opiniones: 18,
    materias: ['Estadística', 'Ecuaciones diferenciales'],
    disponibilidad: 'Ocupado hasta las 4 PM',
    estado: 'ocupado',
  },
  {
    id: 3,
    nombre: 'Nombre del tutor',
    programa: 'Física · 7° sem',
    calificacion: '4.0',
    opiniones: 8,
    materias: ['Física I', 'Física II'],
    disponibilidad: 'Disponible mañana',
    estado: 'ocupado',
  },
  {
    id: 4,
    nombre: 'Nombre del tutor',
    programa: 'Matemáticas · 10° sem',
    calificacion: '5.0',
    opiniones: 45,
    materias: ['Álgebra lineal', 'Cálculo integral'],
    disponibilidad: 'Disponible hoy',
    estado: 'disponible',
  },
];

function Favoritos({ onNavegar }) {
  const [tutores, setTutores] = useState(tutoresIniciales);

  const quitarFavorito = (id) => {
    setTutores((actuales) =>
      actuales.filter((tutor) => tutor.id !== id)
    );
  };

  const verPerfil = (tutor) => {
    alert(`Próximamente podrás consultar el perfil de ${tutor.nombre}.`);
  };

  const solicitarTutoria = (tutor) => {
    alert(`Próximamente podrás solicitar una tutoría con ${tutor.nombre}.`);
  };

  return (
    <div className="favoritos-layout">
      <Sidebar paginaActiva="Favoritos" onNavegar={onNavegar} />

      <div className="favoritos-contenido">
        <Navbar titulo="Favoritos" />

        <main className="favoritos-main">
          <section className="favoritos-encabezado">
            <div>
              <h1>Mis tutores favoritos</h1>
              <p>{tutores.length} tutores guardados</p>
            </div>

            <button
              type="button"
              className="favoritos-buscar"
              onClick={() => onNavegar?.('Buscar tutores')}
            >
              Buscar más tutores
            </button>
          </section>

          {tutores.length > 0 ? (
            <section className="favoritos-grid">
              {tutores.map((tutor) => (
                <article className="favorito-card" key={tutor.id}>
                  <div className="favorito-superior">
                    <div className="favorito-avatar">NT</div>

                    <div className="favorito-informacion">
                      <h2>{tutor.nombre}</h2>
                      <p>{tutor.programa}</p>

                      <div className="favorito-calificacion">
                        <span className="favorito-estrellas">
                          ★★★★★
                        </span>
                        <strong>{tutor.calificacion}</strong>
                        <span>({tutor.opiniones})</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="favorito-corazon"
                      aria-label="Quitar de favoritos"
                      title="Quitar de favoritos"
                      onClick={() => quitarFavorito(tutor.id)}
                    >
                      ♥
                    </button>
                  </div>

                  <div className="favorito-materias">
                    {tutor.materias.map((materia) => (
                      <span key={materia}>{materia}</span>
                    ))}
                  </div>

                  <div className="favorito-disponibilidad">
                    <span
                      className={`favorito-punto favorito-punto--${tutor.estado}`}
                    />
                    <span>{tutor.disponibilidad}</span>
                  </div>

                  <div className="favorito-acciones">
                    <button
                      type="button"
                      className="favorito-ver"
                      onClick={() => verPerfil(tutor)}
                    >
                      Ver perfil
                    </button>

                    <button
                      type="button"
                      className="favorito-solicitar"
                      onClick={() => solicitarTutoria(tutor)}
                    >
                      Solicitar
                    </button>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <div className="favoritos-vacio">
              <span>♡</span>
              <h2>Aún no tienes tutores favoritos</h2>
              <p>Busca tutores y guarda tus perfiles favoritos.</p>
              <button
                type="button"
                onClick={() => onNavegar?.('Buscar tutores')}
              >
                Buscar tutores
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Favoritos;
