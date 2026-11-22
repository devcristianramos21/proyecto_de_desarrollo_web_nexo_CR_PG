
import { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './MisSolicitudes.css';

const solicitudesIniciales = [
  {
    id: 1,
    materia: 'Cálculo diferencial',
    tema: 'Integrales definidas',
    tutor: 'Nombre del tutor',
    fecha: '12 Jun 2025',
    estado: 'Pendiente',
    propuesta: false,
  },
  {
    id: 2,
    materia: 'Programación I',
    tema: 'Listas enlazadas',
    tutor: 'Nombre del tutor',
    fecha: '10 Jun 2025',
    estado: 'Aceptada',
    propuesta: true,
  },
  {
    id: 3,
    materia: 'Bases de datos',
    tema: 'Consultas SQL',
    tutor: 'Nombre del tutor',
    fecha: '8 Jun 2025',
    estado: 'Rechazada',
    propuesta: false,
  },
  {
    id: 4,
    materia: 'Álgebra lineal',
    tema: 'Espacios vectoriales',
    tutor: 'Nombre del tutor',
    fecha: '5 Jun 2025',
    estado: 'Cancelada',
    propuesta: false,
  },
  {
    id: 5,
    materia: 'Física I',
    tema: 'Movimiento uniforme',
    tutor: 'Nombre del tutor',
    fecha: '2 Jun 2025',
    estado: 'Aceptada',
    propuesta: true,
  },
];

const pestañas = [
  'Todas',
  'Pendientes',
  'Aceptadas',
  'Rechazadas',
  'Canceladas',
];

function MisSolicitudes({ onNavegar }) {
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);
  const [filtroActivo, setFiltroActivo] = useState('Todas');

  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    if (filtroActivo === 'Todas') return true;

    return solicitud.estado.toLowerCase() ===
      filtroActivo.slice(0, -1).toLowerCase() ||
      (filtroActivo === 'Pendientes' && solicitud.estado === 'Pendiente') ||
      (filtroActivo === 'Aceptadas' && solicitud.estado === 'Aceptada') ||
      (filtroActivo === 'Rechazadas' && solicitud.estado === 'Rechazada') ||
      (filtroActivo === 'Canceladas' && solicitud.estado === 'Cancelada');
  });

  const cantidadPendientes = solicitudes.filter(
    (solicitud) => solicitud.estado === 'Pendiente'
  ).length;

  const cancelarSolicitud = (id) => {
    setSolicitudes((actuales) =>
      actuales.map((solicitud) =>
        solicitud.id === id
          ? { ...solicitud, estado: 'Cancelada', propuesta: false }
          : solicitud
      )
    );
  };

  const nuevaSolicitud = () => {
    alert('La creación de nuevas solicitudes estará disponible próximamente.');
  };

  return (
    <div className="solicitudes-layout">
      <Sidebar
        paginaActiva="Mis solicitudes"
        onNavegar={onNavegar}
      />

      <div className="solicitudes-contenido">
        <Navbar titulo="Mis solicitudes" />

        <main className="solicitudes-main">
          <header className="solicitudes__encabezado">
            <div>
              <h1>Mis solicitudes</h1>
              <p>Seguimiento de tus solicitudes de tutoría</p>
            </div>

            <button
              type="button"
              className="solicitudes__nueva"
              onClick={nuevaSolicitud}
            >
              <span>+</span>
              Nueva solicitud
            </button>
          </header>

          <nav className="solicitudes__tabs">
            {pestañas.map((pestaña) => (
              <button
                type="button"
                key={pestaña}
                className={`solicitudes__tab ${
                  filtroActivo === pestaña
                    ? 'solicitudes__tab--activa'
                    : ''
                }`}
                onClick={() => setFiltroActivo(pestaña)}
              >
                {pestaña}

                {pestaña === 'Pendientes' && cantidadPendientes > 0 && (
                  <span className="solicitudes__contador">
                    {cantidadPendientes}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <section className="solicitudes__lista">
            {solicitudesFiltradas.length > 0 ? (
              solicitudesFiltradas.map((solicitud) => (
                <article
                  className="solicitudes__tarjeta"
                  key={solicitud.id}
                >
                  <div className="solicitudes__avatar">NT</div>

                  <div className="solicitudes__informacion">
                    <h2>{solicitud.materia}</h2>
                    <p>
                      {solicitud.tema} · {solicitud.tutor}
                    </p>
                    <span className="solicitudes__fecha">
                      <span className="solicitudes__icono-calendario">
                        ▢
                      </span>
                      {solicitud.fecha}
                    </span>
                  </div>

                  <div className="solicitudes__acciones">
                    <span
                      className={`solicitudes__estado solicitudes__estado--${solicitud.estado.toLowerCase()}`}
                    >
                      {solicitud.estado}
                    </span>

                    {solicitud.propuesta && (
                      <span className="solicitudes__propuesta">
                        <span>▣</span>
                        Propuesta pendiente
                      </span>
                    )}

                    {solicitud.estado === 'Pendiente' && (
                      <button
                        type="button"
                        className="solicitudes__cancelar"
                        onClick={() => cancelarSolicitud(solicitud.id)}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="solicitudes__vacio">
                No tienes solicitudes en esta categoría.
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default MisSolicitudes;
