
import { useState } from 'react';
import './recuperacionContrasena.css';

function RecuperarContrasena({ onVolver, onContinuar }) {
  const [correo, setCorreo] = useState('');

  const enviarFormulario = (e) => {
    e.preventDefault();

    if (!correo.toLowerCase().endsWith('@urosario.edu.co')) {
      alert('Por favor ingresa tu correo institucional de la Universidad del Rosario.');
      return;
    }

    onContinuar(correo);
  };

  return (
    <main className="recuperacion-pagina">
      <button
        type="button"
        className="recuperacion-volver"
        onClick={onVolver}
      >
        <span>‹</span> Volver al inicio de sesión
      </button>

      <div className="recuperacion-marca">
        <div className="recuperacion-logo">N</div>
        <h1>NEXO</h1>
      </div>

      <section className="recuperacion-card">
        <div className="recuperacion-icono">✉</div>

        <header className="recuperacion-encabezado">
          <h2>Recupera tu contraseña</h2>
          <p>
            No te preocupes, te ayudaremos a recuperar el acceso
            a tu cuenta.
          </p>
        </header>

        <form onSubmit={enviarFormulario}>
          <div className="recuperacion-campo">
            <label htmlFor="correo-recuperacion">
              Correo institucional
            </label>

            <input
              id="correo-recuperacion"
              type="email"
              placeholder="nombre.apellido@urosario.edu.co"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="recuperacion-boton-principal"
          >
            Enviar instrucciones
          </button>
        </form>

        <p className="recuperacion-pie">
          ¿Recordaste tu contraseña?{' '}
          <button type="button" onClick={onVolver}>
            Iniciar sesión
          </button>
        </p>
      </section>
    </main>
  );
}

export default RecuperarContrasena;
