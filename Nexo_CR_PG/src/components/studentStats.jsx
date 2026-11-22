import './studentStats.css';

export default function studentStats({
  tutoriasActivas,
  sesionesCompletadas,
  solicitudesPendientes,
}) {
  const estadisticas = [
    {
      id: 1,
      valor: tutoriasActivas,
      etiqueta: 'Tutorías activas',
    },
    {
      id: 2,
      valor: sesionesCompletadas,
      etiqueta: 'Sesiones completadas',
    },
    {
      id: 3,
      valor: solicitudesPendientes,
      etiqueta: 'Solicitudes pendientes',
    },
  ];

  return (
    <section className="student-stats" aria-label="Resumen del estudiante">
      {estadisticas.map((estadistica) => (
        <div className="student-stats__item" key={estadistica.id}>
          <span className="student-stats__valor">
            {estadistica.valor}
          </span>

          <span className="student-stats__etiqueta">
            {estadistica.etiqueta}
          </span>
        </div>
      ))}
    </section>
  );
}