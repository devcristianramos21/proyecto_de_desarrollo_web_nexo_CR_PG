import { useState } from 'react';
import AdminShell from './AdminShell';
import './perfilAdmin.css';

export default function PerfilAdmin({ onNavegar, perfil }) {
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const actualizar = (evento) => {
    evento.preventDefault();
    if (!contrasenaActual || !nuevaContrasena) {
      setError('Completa ambos campos para continuar.');
      return;
    }
    if (nuevaContrasena.length < 8) {
      setError('La nueva contraseña debe tener mínimo 8 caracteres.');
      return;
    }

    setError('');
    setContrasenaActual('');
    setNuevaContrasena('');
    setMensaje('Cambio de contraseña simulado; no se modificaron credenciales reales.');
    window.setTimeout(() => setMensaje(''), 5000);
  };

  return (
    <AdminShell titulo="Mi perfil" paginaActiva="Mi perfil admin" onNavegar={onNavegar}>
      <div className="perfil-admin">
        <header className="admin-page-header">
          <div>
            <h1>Mi perfil</h1>
            <p>Cuenta institucional de administrador</p>
          </div>
        </header>

        <section className="admin-card perfil-admin__cuenta">
          <div className="perfil-admin__identidad">
            <span className="perfil-admin__avatar">AD</span>
            <div>
              <h2>{perfil.nombre}</h2>
              <p>{perfil.correo}</p>
              <span>Acceso de administrador</span>
            </div>
          </div>
          <dl className="perfil-admin__datos">
            <div><dt>Nombre completo</dt><dd>{perfil.nombre}</dd></div>
            <div><dt>Correo</dt><dd>{perfil.correo}</dd></div>
            <div><dt>Rol</dt><dd>{perfil.rol}</dd></div>
            <div><dt>Departamento</dt><dd>{perfil.departamento}</dd></div>
            <div><dt>Institución</dt><dd>{perfil.institucion}</dd></div>
          </dl>
        </section>

        <form className="admin-card perfil-admin__password" onSubmit={actualizar}>
          <h2>Cambiar contraseña</h2>
          <label>
            Contraseña actual
            <input className="admin-field" type="password" autoComplete="current-password" placeholder="Tu contraseña institucional actual" value={contrasenaActual} onChange={(evento) => setContrasenaActual(evento.target.value)} required />
          </label>
          <label>
            Nueva contraseña
            <input className="admin-field" type="password" autoComplete="new-password" placeholder="Nueva contraseña" value={nuevaContrasena} onChange={(evento) => setNuevaContrasena(evento.target.value)} minLength="8" required />
          </label>
          {error && <p className="admin-error" role="alert">{error}</p>}
          <button type="submit" className="admin-primary-button">Actualizar contraseña</button>
        </form>
        {mensaje && <div className="admin-toast" role="status">{mensaje}</div>}
      </div>
    </AdminShell>
  );
}
