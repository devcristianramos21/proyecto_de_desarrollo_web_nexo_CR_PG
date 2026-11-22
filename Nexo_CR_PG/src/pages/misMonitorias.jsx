
import { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './MisMonitorias.css';

const tutoriasIniciales = [
  {
    id: 1,
    materia: 'Cálculo diferencial',
    tema: 'Integrales',
    tutor: 'Nombre del tutor',
    fecha: 'Jue 19 Jun · 3:00 PM — 4:00 PM',
    modalidad: 'Virtual',
    estado: 'Programada',
    categoria: 'Proximas',
  },
  {
    id: 2,
    materia: 'Programación I',
    tema: 'Listas enlazadas',
    tutor: 'Nombre del tutor',
    fecha: 'Jue 23 Jun · 2:00 PM — 3:00 PM',
    modalidad: 'Virtual',
    estado: 'Programada',
    categoria: 'Proximas',
  },
];

const pestañas = [
  { id: 'Proximas', nombre: 'Próximas' },
  { id: 'Finalizadas', nombre: 'Finalizadas' },
  { id: 'Canceladas', nombre: 'Canceladas' },
];

function MisMonitorias({ onNavegar }) {
  const [tutorias, setTutorias] = useState(tutoriasIniciales);
  const [filtroActivo, setFiltroActivo] = useState('Proximas');

  const tutoriasFiltradas = tutorias.filter(
    (tutoria) => tutoria.categoria === filtroActivo
  );

  const cantidadProximas = tutorias.filter(
    (tutoria) => tutoria.categoria === 'Proximas'
  ).length;

  const cancelarTutoria = (id) => {
    setTutorias((actuales) =>
      actuales.map((tutoria) =>
        tutoria.id === id
          ? { ...tutoria, categoria: 'Canceladas', estado: 'Cancelada' }
          : tutoria
      )
    );
  };

  const verTutoria = (tutoria) => {
    alert(
      `${tutoria.materia}\n${tutoria.tema}\nTutor: ${tutoria.tutor}\n${tutoria.fecha}`
    );
  };

  const reprogramarTutoria = (tutoria) => {
    alert(`La reprogramación de ${tutoria.materia} estará disponible próximamente.`);
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
          <header className="mis-tutorias__encabezado">
            <h1>Mis tutorías</h1>
            <p>Historial y próximas sesiones de tutoría</p>
          </header>

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

          <section className="mis-tutorias__lista">
            {tutoriasFiltradas.length > 0 ? (
              tutoriasFiltradas.map((tutoria) => (
                <article
                  className="mis-tutorias__tarjeta"
                  key={tutoria.id}
                >
                  <div className="mis-tutorias__avatar">NT</div>

                  <div className="mis-tutorias__informacion">
                    <h2>{tutoria.materia}</h2>

                    <p>
                      {tutoria.tema} · {tutoria.tutor}
                    </p>

                    <div className="mis-tutorias__datos">
                      <span className="mis-tutorias__fecha">
                        <span aria-hidden="true">▢</span>
                        {tutoria.fecha}
                      </span>

                      <span className="mis-tutorias__modalidad">
                        {tutoria.modalidad}
                      </span>
                    </div>
                  </div>

                  <div className="mis-tutorias__acciones">
                    <span className="mis-tutorias__estado">
                      {tutoria.estado}
                    </span>

                    <div className="mis-tutorias__botones">
                      <button
                        type="button"
                        className="mis-tutorias__boton mis-tutorias__boton--ver"
                        onClick={() => verTutoria(tutoria)}
                      >
                        Ver
                      </button>

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
