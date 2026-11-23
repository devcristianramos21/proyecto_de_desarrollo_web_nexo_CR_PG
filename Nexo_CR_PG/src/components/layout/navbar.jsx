
import './navbar.css';
import { useUsuario } from './usuarioContext';
import adminBackIcon from '../../pages/admin/assets/nav-back.svg';
import adminNotificationsIcon from '../../pages/admin/assets/nav-notifications.svg';

export default function Navbar({
  titulo = 'Inicio',
  onNavegar,
  variant = 'default',
  showBack = false,
  onBack,
}) {
  const { usuario } = useUsuario();
  const esAdmin = variant === 'admin';

  return (
    <header className={`navbar${esAdmin ? ' navbar--admin' : ''}`}>
      <div className="navbar__encabezado">
        {showBack && (
          <button
            type="button"
            className="navbar__regresar"
            aria-label="Volver al inicio administrativo"
            onClick={onBack}
          >
            <img src={esAdmin ? adminBackIcon : '/assets/Frame.svg'} alt="" />
          </button>
        )}
        <h1 className="navbar__titulo">{titulo}</h1>
      </div>

      <div className="navbar__acciones">
        {!esAdmin && <span className="navbar__rol">{usuario.rol}</span>}

        {/* NOTIFICACIONES */}
        <button
          type="button"
          className="navbar__notificaciones"
          aria-label="Ir a notificaciones"
          title="Notificaciones"
          onClick={() =>
            onNavegar?.(esAdmin ? 'Notificaciones Admin' : 'Notificaciones')
          }
        >
          <img src={esAdmin ? adminNotificationsIcon : '/assets/Frame-2.svg'} alt="" />
          <span className="navbar__punto" />
        </button>

        {/* PERFIL */}
        <button
          type="button"
          className="navbar__avatar"
          aria-label="Ir a mi perfil"
          title="Mi perfil"
          onClick={() => onNavegar?.(esAdmin ? 'Mi perfil admin' : 'Mi perfil')}
        >
          {usuario.iniciales || 'NE'}
        </button>
      </div>
    </header>
  );
}
