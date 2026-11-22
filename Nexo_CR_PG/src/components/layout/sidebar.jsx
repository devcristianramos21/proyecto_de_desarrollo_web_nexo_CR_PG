
import './sidebar.css';

const opciones = [
  { nombre: 'Inicio', icono: '/assets/Frame.svg' },
  { nombre: 'Buscar tutores', icono: '/assets/Frame-1.svg' },
  { nombre: 'Monitorías', icono: '/assets/Frame-2.svg' },
  { nombre: 'Calendario', icono: '/assets/Frame-3.svg' },
  { nombre: 'Mis solicitudes', icono: '/assets/Frame-4.svg', badge: '1' },
  { nombre: 'Mis monitorias', icono: '/assets/Frame-5.svg' },
  { nombre: 'Mensajes', icono: '/assets/Frame-6.svg' },
  { nombre: 'Favoritos', icono: '/assets/Frame-7.svg' },
  { nombre: 'Mi perfil', icono: '/assets/Frame-8.svg' },
];

const opcionesInferiores = [
  { nombre: 'Notificaciones', icono: '/assets/Frame-9.svg', badge: '3' },
  { nombre: 'Soporte', icono: '/assets/Frame-10.svg' },
  { nombre: 'Cerrar sesión', icono: '/assets/exit-svgrepo-com 1.svg' },
];

export default function Sidebar({ paginaActiva = 'Inicio', onNavegar }) {
  const renderOpcion = (opcion) => (
    <button
      type="button"
      key={opcion.nombre}
      className={`sidebar__opcion ${
        paginaActiva === opcion.nombre ? 'sidebar__opcion--activa' : ''
      }`}
      onClick={() => onNavegar?.(opcion.nombre)}
    >
      <img src={opcion.icono} alt="" className="sidebar__icono" />

      <span className="sidebar__nombre">{opcion.nombre}</span>

      {opcion.badge && (
        <span className="sidebar__badge">{opcion.badge}</span>
      )}
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar__marca">
        <img src="/assets/logo-nexo.png" alt="NEXO" />
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
  );
}
