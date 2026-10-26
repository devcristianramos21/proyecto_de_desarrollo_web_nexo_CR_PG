import './UpcomingExam.css';

export default function UpcomingExam({
  titulo,
  fecha,
  descripcion,
  onVerCalendario,
  onInscribirse,
}) {
  return (
    <section className="upcoming-exam">
      <div className="upcoming-exam__icono" aria-hidden="true">
        ▦
      </div>

      <div className="upcoming-exam__contenido">
        <h3 className="upcoming-exam__titulo">{titulo}</h3>

        <p className="upcoming-exam__descripcion">
          {fecha} · {descripcion}
        </p>
      </div>

      <div className="upcoming-exam__acciones">
        <button
          type="button"
          className="upcoming-exam__boton upcoming-exam__boton--secundario"
          onClick={onVerCalendario}
        >
          Ver calendario
        </button>

        <button
          type="button"
          className="upcoming-exam__boton upcoming-exam__boton--principal"
          onClick={onInscribirse}
        >
          Inscribirme
        </button>
      </div>
    </section>
  );
}