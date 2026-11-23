
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './horarioConfirmado.css';

function HorarioConfirmado({ onNavegar, solicitud, horario }) {
  const materia = solicitud?.materia || 'Cálculo diferencial';
  const fechaHora = horario || 'Jueves 19 Jun · 3:00 PM — 4:00 PM';
  const modalidad = solicitud?.modalidad || 'Virtual';

  return (
    <div className="horario-confirmado-layout">
      <Sidebar
        paginaActiva="Mis solicitudes"
        onNavegar={onNavegar}
      />

      <div className="horario-confirmado-contenido">
        <Navbar titulo="Horario confirmado" onNavegar={onNavegar} />

        <main className="horario-confirmado-main">
          <section className="horario-confirmado__contenido">

            <div className="horario-confirmado__icono">
              ✓
            </div>

            <h1>Horario Confirmado</h1>

            <p className="horario-confirmado__descripcion">
              Tu tutoría de {materia} quedó confirmada para el
              <strong> {fechaHora}</strong>
            </p>

            <div className="horario-confirmado__aviso">
              <h2>Horario bloqueado</h2>
              <p>
                {fechaHora} · {modalidad}
              </p>
            </div>

            <div className="horario-confirmado__acciones">
              <button
                type="button"
                className="horario-confirmado__boton horario-confirmado__boton--secundario"
                onClick={() => onNavegar?.('Mis solicitudes')}
              >
                Ver mis solicitudes
              </button>

              <button
                type="button"
                className="horario-confirmado__boton horario-confirmado__boton--principal"
                onClick={() => onNavegar?.('Inicio')}
              >
                Ir al inicio
              </button>
            </div>

          </section>
        </main>
      </div>
    </div>
  );
}

export default HorarioConfirmado;
