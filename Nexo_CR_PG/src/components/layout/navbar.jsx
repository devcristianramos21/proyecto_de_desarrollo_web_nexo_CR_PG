
import './navbar.css';

export default function Navbar({ titulo = 'Inicio' }) {
  return (
    <header className="navbar">
      <h1 className="navbar__titulo">{titulo}</h1>

      <div className="navbar__acciones">
        <span className="navbar__rol">Estudiante</span>

        <button
          type="button"
          className="navbar__notificaciones"
          aria-label="Notificaciones"
        >
          <img src="/assets/Vector.svg" alt="" />
          <span className="navbar__punto" />
        </button>

        <div className="navbar__avatar" aria-label="Usuario NE">
          NE
        </div>
      </div>
    </header>
  );
}
