
import { useState } from 'react';
import './sidebar.css';
import ConfirmarCerrarSesion from '../modals/confirmarCerrarSesion';
import { useUsuario } from './usuarioContext';
import adminHomeIcon from '../../pages/admin/assets/nav-home-inactive.svg';
import adminHomeActiveIcon from '../../pages/admin/assets/nav-home.svg';
import adminNotificationsIcon from '../../pages/admin/assets/nav-notifications.svg';
import adminCalendarIcon from '../../pages/admin/assets/nav-calendar.svg';
import adminMonitoriasIcon from '../../pages/admin/assets/nav-monitorias.svg';
import adminTutorsIcon from '../../pages/admin/assets/nav-tutors.svg';
import adminTutorsActiveIcon from '../../pages/admin/assets/nav-tutors-active.svg';
import adminStudentsIcon from '../../pages/admin/assets/nav-students.svg';
import adminReportsIcon from '../../pages/admin/assets/nav-reports.svg';
import adminSupportIcon from '../../pages/admin/assets/nav-support.svg';
import adminProfileIcon from '../../pages/admin/assets/nav-profile.svg';
import adminLogoutIcon from '../../pages/admin/assets/nav-logout.svg';

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

const opcionesTutor = [
  {
    nombre: 'Solicitudes recibidas',
    destino: 'Solicitudes recibidas',
    icono: '/assets/Frame-7.svg',
  },
  {
    nombre: 'Monitorias',
    destino: 'Monitorías asignadas',
    icono: '/assets/Vector-2.svg',
  },
  {
    nombre: 'Mi disponibilidad',
    destino: 'Mi disponibilidad',
    icono: '/assets/Frame-11.svg',
  },
];

const seccionesAdministrador = [
  {
    titulo: 'ADMINISTRADOR',
    opciones: [
      { nombre: 'Inicio', destino: 'Home Admin', icono: adminHomeIcon, iconoActivo: adminHomeActiveIcon },
      { nombre: 'Notificaciones', destino: 'Notificaciones Admin', icono: adminNotificationsIcon, badge: '3' },
    ],
  },
  {
    titulo: 'GESTIÓN ACADÉMICA',
    opciones: [
      { nombre: 'Calendario académico', destino: 'Calendario Admin', icono: adminCalendarIcon },
      { nombre: 'Monitorias', destino: 'Monitorias admin', icono: adminMonitoriasIcon },
    ],
  },
  {
    titulo: 'PERSONAS',
    opciones: [
      { nombre: 'Tutores y monitores', destino: 'Tutores admin', icono: adminTutorsIcon, iconoActivo: adminTutorsActiveIcon, badge: '3' },
      { nombre: 'Estudiantes', destino: 'Estudiantes admin', icono: adminStudentsIcon },
    ],
  },
  {
    titulo: 'SISTEMA',
    opciones: [
      { nombre: 'Reportes', destino: 'Reportes admin', icono: adminReportsIcon },
      { nombre: 'Soporte', destino: 'Soporte admin', icono: adminSupportIcon },
    ],
  },
];

const opcionesInferioresAdministrador = [
  { nombre: 'Mi perfil', destino: 'Mi perfil admin', icono: adminProfileIcon },
  { nombre: 'Cerrar sesión', icono: adminLogoutIcon },
];

export default function Sidebar({
  paginaActiva = 'Inicio',
  onNavegar,
  onCerrarSesion,
}) {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const { usuario, solicitudesTutor = [] } = useUsuario();
  const esTutor = usuario?.rol === 'Estudiante-Tutor';
  const esAdmin = usuario?.rol === 'Administrador';
  const solicitudesPendientes = solicitudesTutor.filter(
    (solicitud) => solicitud.estado === 'Pendiente'
  ).length;

  const renderOpcion = (opcion) => {
    const activa = paginaActiva === opcion.nombre || paginaActiva === opcion.destino;

    return (
      <button
        type="button"
        key={opcion.destino || opcion.nombre}
        className={`sidebar__opcion ${activa ? 'sidebar__opcion--activa' : ''}`}
        title={opcion.nombre}
        onClick={() => {
          if (opcion.nombre === 'Cerrar sesión') {
            if (esAdmin && onCerrarSesion) {
              onCerrarSesion();
            } else {
              setMostrarConfirmacion(true);
            }
          } else {
            onNavegar?.(opcion.destino || opcion.nombre);
          }
        }}
      >
        <img
          src={activa && opcion.iconoActivo ? opcion.iconoActivo : opcion.icono}
          alt=""
          className={`sidebar__icono${esAdmin && activa && !opcion.iconoActivo ? ' sidebar__icono--admin-activa' : ''}`}
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
  };

  return (
    <>
      <aside className={`sidebar${esAdmin ? ' sidebar--admin' : ''}`}>
        <div className="sidebar__marca">
          <img src="/assets/logo.png" alt="NEXO" />

          <div className="sidebar__marca-texto">
            <strong>NEXO</strong>
            <span>Plataforma monitorías</span>
          </div>
        </div>

        {esAdmin ? (
          <>
            <div className="sidebar__admin-secciones">
              {seccionesAdministrador.map((seccion) => (
                <div className="sidebar__seccion" key={seccion.titulo}>
                  <p className="sidebar__titulo">{seccion.titulo}</p>
                  <nav className="sidebar__navegacion">
                    {seccion.opciones.map(renderOpcion)}
                  </nav>
                </div>
              ))}
            </div>
            <div className="sidebar__inferior">
              {opcionesInferioresAdministrador.map(renderOpcion)}
            </div>
          </>
        ) : (
          <>
            <div className="sidebar__seccion">
              <p className="sidebar__titulo">ESTUDIANTE</p>
              <nav className="sidebar__navegacion">
                {opciones.map(renderOpcion)}
              </nav>
            </div>

            {esTutor && (
              <div className="sidebar__seccion sidebar__seccion--tutor">
                <p className="sidebar__titulo">TUTOR</p>
                <nav className="sidebar__navegacion">
                  {opcionesTutor.map((opcion) =>
                    renderOpcion({
                      ...opcion,
                      badge:
                        opcion.destino === 'Solicitudes recibidas' &&
                        solicitudesPendientes > 0
                          ? String(solicitudesPendientes)
                          : undefined,
                    })
                  )}
                </nav>
              </div>
            )}

            <div className="sidebar__inferior">
              {opcionesInferiores.map(renderOpcion)}
            </div>
          </>
        )}
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
