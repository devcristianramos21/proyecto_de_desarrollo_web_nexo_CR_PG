
import './recuperacionContrasena.css';

function ConfirmacionRecuperacion({ correo, onContinuar }) {
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

        <h2>¡Revisa tu correo!</h2>

        <p>
          Si el correo corresponde a una cuenta de NEXO,
          recibirás instrucciones para restablecer tu contraseña.
        </p>

        <div className="recuperacion-correo-enviado">
          {correo}
        </div>

        <p className="recuperacion-ayuda">
          Recuerda revisar también tu carpeta de correo no deseado.
        </p>

        <button
          type="button"
          className="recuperacion-boton-principal"
          onClick={onContinuar}
        >
          Continuar al cambio de contraseña
        </button>
      </section>
    </main>
  );
}

export default ConfirmacionRecuperacion;
