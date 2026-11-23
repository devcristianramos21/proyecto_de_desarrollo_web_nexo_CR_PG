
import { useState } from 'react';
import './recuperacionContrasena.css';

function NuevaContrasena({ onActualizar }) {
  const [contrasena, setContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');

  const enviarFormulario = (e) => {
    e.preventDefault();

    if (contrasena.length < 8) {
      alert('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }

    if (contrasena !== confirmacion) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    onActualizar();
  };

  return (
    <main className="recuperacion-pagina">
      <div className="recuperacion-marca">
        <div className="recuperacion-logo">N</div>
        <h1>NEXO</h1>
      </div>

      <section className="recuperacion-card">
        <div className="recuperacion-icono">🔒</div>

        <header className="recuperacion-encabezado">
          <h2>Crea una nueva contraseña</h2>
          <p>
            Elige una contraseña segura para proteger tu cuenta de NEXO.
          </p>
        </header>

        <form onSubmit={enviarFormulario}>
          <div className="recuperacion-campo">
            <label htmlFor="nueva-contrasena">
              Nueva contraseña
            </label>

            <input
              id="nueva-contrasena"
              type="password"
              placeholder="Ingresa tu nueva contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              minLength={8}
              required
            />

            <small>Mínimo 8 caracteres</small>
          </div>

          <div className="recuperacion-campo">
            <label htmlFor="confirmar-contrasena">
              Confirmar contraseña
            </label>

            <input
              id="confirmar-contrasena"
              type="password"
              placeholder="Escribe nuevamente tu contraseña"
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            className="recuperacion-boton-principal"
          >
            Cambiar contraseña
          </button>
        </form>
      </section>
    </main>
  );
}

export default NuevaContrasena;
