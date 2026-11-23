
import { useState } from 'react';
import './sidebar.css';
import ConfirmarCerrarSesion from '../modals/confirmarCerrarSesion';

const opciones = [
  { nombre: 'Inicio', icono: '/assets/home.svg' },
  { nombre: 'Buscar tutores', icono: '/assets/Frame-9.svg' },
  { nombre: 'Monitorías', icono: '/assets/Vector-2.svg' },
  { nombre: 'Calendario', icono: '/assets/Frame-11.svg' },
  { nombre: 'Mis solicitudes', icono: '/assets/Frame-7.svg', badge: '1' },
  { nombre: 'Mis monitorias', icono: '/assets/Frame-6.svg' },
  { nombre: 'Mensajes', icono: '/assets/Frame-5.svg' },
  { nombre: 'Favoritos', icono: '/assets/Frame-4.svg' },
  { nombre: 'Mi perfil', icono: '/assets/Frame-3.svg' },
];

const opcionesInferiores = [
  { nombre: 'Notificaciones', icono: '/assets/Frame-2.svg', badge: '3' },
  { nombre: 'Soporte', icono: '/assets/Frame-1.svg' },
  { nombre: 'Cerrar sesión', icono: '/assets/exit-svgrepo-com 1.svg' },
];

export default function Sidebar({
  paginaActiva = 'Inicio',
  onNavegar,
}) {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const renderOpcion = (opcion) => (
    <button
      type="button"
      key={opcion.nombre}
      className={`sidebar__opcion ${
        paginaActiva === opcion.nombre
          ? 'sidebar__opcion--activa'
          : ''
      }`}
      onClick={() => {
        if (opcion.nombre === 'Cerrar sesión') {
          setMostrarConfirmacion(true);
        } else {
          onNavegar?.(opcion.nombre);
        }
      }}
    >
      <img
        src={opcion.icono}
        alt=""
        className="sidebar__icono"
      />

      <span className="sidebar__nombre">
        {opcion.nombre}
      </span>

      {opcion.badge && (
        <span className="sidebar__badge">
          {opcion.badge}
        </span>
      )}
    </button>
  );

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar__marca">
          <img src="/assets/logo.png" alt="NEXO" />

          <div className="sidebar__marca-texto">
            <strong>NEXO</strong>
            <span>Plataforma monitorías</span>
          </div>
        </div>

        <div className="sidebar__seccion">
          <p className="sidebar__titulo">ESTUDIANTE</p>

          <nav className="sidebar__navegacion">
            {opciones.map(renderOpcion)}
          </nav>
        </div>

        <div className="sidebar__inferior">
          {opcionesInferiores.map(renderOpcion)}
        </div>
      </aside>

      {mostrarConfirmacion && (
        <ConfirmarCerrarSesion
          onCancelar={() => setMostrarConfirmacion(false)}
          onConfirmar={() => {
            setMostrarConfirmacion(false);
            onNavegar?.('Landing');
          }}
        />
      )}
    </>
  );
}
