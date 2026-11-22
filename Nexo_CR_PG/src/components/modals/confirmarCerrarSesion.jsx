
import './ConfirmarCerrarSesion.css';

export default function ConfirmarCerrarSesion({
  onCancelar,
  onConfirmar,
}) {
  return (
    <div
      className="cerrar-sesion-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancelar?.();
        }
      }}
    >
      <section
        className="cerrar-sesion-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cerrar-sesion-titulo"
      >
        <h2 id="cerrar-sesion-titulo">
          Cerrar sesión
        </h2>

        <p>
          Estás seguro de que deseas cerrar sesión? Tendrás que volver
          a ingresar con tus credenciales institucionales.
        </p>

        <div className="cerrar-sesion-acciones">
          <button
            type="button"
            className="cerrar-sesion-cancelar"
            onClick={onCancelar}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="cerrar-sesion-confirmar"
            onClick={onConfirmar}
          >
            Sí, cerrar sesión
          </button>
        </div>
      </section>
    </div>
  );
}
