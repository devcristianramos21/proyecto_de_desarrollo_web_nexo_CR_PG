
import './navbar.css';

export default function Navbar({
  titulo = 'Inicio',
  onNavegar,
}) {
  return (
    <header className="navbar">
      <h1 className="navbar__titulo">{titulo}</h1>

      <div className="navbar__acciones">
        <span className="navbar__rol">Estudiante</span>

        {/* NOTIFICACIONES */}
        <button
          type="button"
          className="navbar__notificaciones"
          aria-label="Ir a notificaciones"
          title="Notificaciones"
          onClick={() => onNavegar?.('Notificaciones')}
        >
          <img src="/assets/Frame-2.svg" alt="" />
          <span className="navbar__punto" />
        </button>

        {/* PERFIL */}
        <button
          type="button"
          className="navbar__avatar"
          aria-label="Ir a mi perfil"
          title="Mi perfil"
          onClick={() => onNavegar?.('Mi perfil')}
        >
          NE
        </button>
      </div>
    </header>
  );
}
