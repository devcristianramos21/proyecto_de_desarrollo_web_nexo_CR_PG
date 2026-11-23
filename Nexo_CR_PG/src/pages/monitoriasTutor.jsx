import { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './monitoriasTutor.css';

function MonitoriasTutor({
  onNavegar,
  monitorias = [],
  cargando = false,
  onVerDetalle,
  onMensajeEstudiantes,
}) {
  const [pestanaActiva, setPestanaActiva] = useState('Activas');
  const monitoriasFiltradas = monitorias.filter((monitoria) =>
    pestanaActiva === 'Activas'
      ? monitoria.estado === 'Activa' || monitoria.estado === 'Programada'
      : ['Finalizada', 'Cancelada', 'Rechazada'].includes(monitoria.estado)
  );

  return (
    <div className="monitorias-tutor-layout">
      <Sidebar paginaActiva="Monitorías asignadas" onNavegar={onNavegar} />

      <div className="monitorias-tutor-contenido">
        <Navbar titulo="Mis monitorías" onNavegar={onNavegar} />

        <main className="monitorias-tutor-main">
          <header className="monitorias-tutor__encabezado">
            <h1>Mis monitorías</h1>
            <p>Monitorías institucionales asignadas por la Universidad del Rosario</p>
          </header>

          <nav className="monitorias-tutor__tabs" aria-label="Filtrar monitorías">
            {['Activas', 'Historial'].map((pestana) => (
              <button
                type="button"
                key={pestana}
                className={`monitorias-tutor__tab ${
                  pestanaActiva === pestana ? 'monitorias-tutor__tab--activa' : ''
                }`}
                onClick={() => setPestanaActiva(pestana)}
              >
                {pestana}
              </button>
            ))}
          </nav>

          <section className="monitorias-tutor__lista" aria-live="polite">
            {cargando ? (
              <p role="status">Cargando monitorías…</p>
            ) : monitoriasFiltradas.length > 0 ? monitoriasFiltradas.map((monitoria) => {
              const porcentaje = monitoria.cupo
                ? Math.min((monitoria.inscritos / monitoria.cupo) * 100, 100)
                : 0;

              return (
                <article className="monitorias-tutor__tarjeta" key={monitoria.id}>
                  <div className="monitorias-tutor__fila">
                    <div className="monitorias-tutor__informacion">
                      <div className="monitorias-tutor__titulo-fila">
                        <h2>{monitoria.titulo}</h2>
                        <span className="monitorias-tutor__tipo">{monitoria.tipo}</span>
                        <span className="monitorias-tutor__estado">{monitoria.estado}</span>
                      </div>
                      <p>{monitoria.programa} · {monitoria.horario}</p>
                    </div>

                    <div className="monitorias-tutor__acciones">
                      <button
                        type="button"
                        className="monitorias-tutor__boton monitorias-tutor__boton--secundario"
                        onClick={() => onVerDetalle?.(monitoria)}
                      >
                        Ver detalle
                      </button>
                      <button
                        type="button"
                        className="monitorias-tutor__boton monitorias-tutor__boton--secundario"
                        onClick={() => onMensajeEstudiantes?.(monitoria)}
                      >
                        Mensaje a estudiantes
                      </button>
                    </div>
                  </div>

                  <div className="monitorias-tutor__progreso">
                    <div
                      className="monitorias-tutor__progreso-barra"
                      role="progressbar"
                      aria-label={`Inscripciones para ${monitoria.titulo}`}
                      aria-valuenow={monitoria.inscritos}
                      aria-valuemin={0}
                      aria-valuemax={monitoria.cupo}
                    >
                      <span style={{ width: `${porcentaje}%` }} />
                    </div>
                    <span>{monitoria.inscritos}/{monitoria.cupo} estudiantes</span>
                  </div>

                  <div className="monitorias-tutor__proxima">
                    <strong>Próxima sesión</strong>
                    <span>{monitoria.proximaSesion}</span>
                  </div>
                </article>
              );
            }) : (
              <p>No hay monitorías en esta sección.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default MonitoriasTutor;
