
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './confirmacionEvaluacion.css';

function ConfirmacionEvaluacion({ onNavegar, calificacion = 4 }) {
  return (
    <div className="confirmacion-evaluacion-layout">
      <Sidebar
        paginaActiva="Mis tutorías"
        onNavegar={onNavegar}
      />

      <main className="confirmacion-evaluacion-contenido">
        <Navbar titulo="Evaluar tutor" />

        <section className="confirmacion-evaluacion-principal">
          <div className="confirmacion-evaluacion-tarjeta">

            <div className="confirmacion-evaluacion-icono">
              ⭐
            </div>

            <h1>¡Gracias por tu evaluación!</h1>

            <p>
              Tu evaluación ayuda a mantener la calidad del sistema
              de tutorías de la Universidad del Rosario.
            </p>

            <div
              className="confirmacion-evaluacion-estrellas"
              aria-label={`Calificación de ${calificacion} sobre 5`}
            >
              {[1, 2, 3, 4, 5].map((estrella) => (
                <span
                  key={estrella}
                  className={
                    estrella <= calificacion
                      ? 'estrella-activa'
                      : 'estrella-inactiva'
                  }
                >
                  ★
                </span>
              ))}
            </div>

            <div className="confirmacion-evaluacion-acciones">
              <button
                type="button"
                className="btn-confirmacion-mis-tutorias"
                onClick={() => onNavegar('Mis monitorias')}
              >
                Mis tutorías
              </button>

              <button
                type="button"
                className="btn-confirmacion-inicio"
                onClick={() => onNavegar('Inicio')}
              >
                Ir al inicio
              </button>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}

export default ConfirmacionEvaluacion;
