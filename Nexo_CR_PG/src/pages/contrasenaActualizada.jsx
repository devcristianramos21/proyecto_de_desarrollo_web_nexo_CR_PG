
import './recuperacionContrasena.css';

function ContrasenaActualizada({ onIniciarSesion }) {
  return (
    <main className="recuperacion-pagina">
      <div className="recuperacion-marca">
        <div className="recuperacion-logo">N</div>
        <h1>NEXO</h1>
      </div>

      <section className="recuperacion-card recuperacion-confirmacion">
        <div className="recuperacion-icono recuperacion-icono-exito">
          ✓
        </div>

        <h2>¡Contraseña actualizada!</h2>

        <p>
          Tu contraseña se ha cambiado correctamente.
          Ya puedes ingresar nuevamente a NEXO.
        </p>

        <button
          type="button"
          className="recuperacion-boton-principal"
          onClick={onIniciarSesion}
        >
          Iniciar sesión
        </button>
      </section>
    </main>
  );
}

export default ContrasenaActualizada;
