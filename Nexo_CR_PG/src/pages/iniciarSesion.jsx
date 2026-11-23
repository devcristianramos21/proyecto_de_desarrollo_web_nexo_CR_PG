
import { useState } from 'react';
import './iniciarSesion.css';

function IniciarSesion({
  onCrearCuenta,
  onIngresar,
  onOlvideContrasena,
}) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');

  const manejarIngreso = (e) => {
    e.preventDefault();
    setError('');

    if (!correo.trim() || !contrasena) {
      setError('Completa tu correo y contraseña para continuar.');
      return;
    }

    if (!/^[^\s@]+@urosario\.edu\.co$/i.test(correo.trim())) {
      setError('Ingresa un correo institucional válido de la Universidad del Rosario.');
      return;
    }

    if (onIngresar) {
      onIngresar({
        correo: correo.trim(),
        contrasena,
      });
    } else {
      setError('El inicio de sesión estará disponible próximamente.');
    }
  };

  const manejarOlvido = () => {
    if (onOlvideContrasena) {
      onOlvideContrasena();
    } else {
      setError('La recuperación de contraseña estará disponible próximamente.');
    }
  };

  return (
    <main className="login-pagina">

      {/* LOGO */}
      <div className="login-marca">
        <div className="login-logo">N</div>
        <h1>NEXO</h1>
        <span>UNIVERSIDAD DEL ROSARIO</span>
      </div>

      {/* TARJETA */}
      <section className="login-card">

        <header className="login-encabezado">
          <h2>Bienvenido a NEXO</h2>
          <p>
            Ingresa con tu correo y contraseña para continuar.
          </p>
        </header>

        <form onSubmit={manejarIngreso}>

          {/* CORREO */}
          <div className="login-campo">
            <label htmlFor="login-correo">
              Correo institucional
            </label>

            <input
              id="login-correo"
              type="email"
              placeholder="nombre.apellido@urosario.edu.co"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          {/* CONTRASEÑA */}
          <div className="login-campo">
            <label htmlFor="login-contrasena">
              Contraseña
            </label>

            <div className="login-password-contenedor">
              <input
                id="login-contrasena"
                type={mostrarContrasena ? 'text' : 'password'}
                placeholder="Tu contraseña institucional"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="login-ver-contrasena"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                aria-label={
                  mostrarContrasena
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                }
              >
                {mostrarContrasena ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 7 9 7a15 15 0 0 1-3.1 3.8M6.2 6.2C3.9 7.7 2 12 2 12s3.5 7 10 7a10 10 0 0 0 3-.5" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* RECUPERAR CONTRASEÑA */}
          <div className="login-olvido">
            <button type="button" onClick={manejarOlvido}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          {/* INGRESAR */}
          <button type="submit" className="login-boton">
            Ingresar
          </button>

          {/* CREAR CUENTA */}
          <p className="login-registro">
            ¿Aún no tienes una cuenta?{' '}
            <button type="button" onClick={onCrearCuenta}>
              Crear cuenta
            </button>
          </p>

        </form>
      </section>

      <p className="login-pie">
        Acceso exclusivo para la comunidad Rosarista.
      </p>

    </main>
  );
}

export default IniciarSesion;
