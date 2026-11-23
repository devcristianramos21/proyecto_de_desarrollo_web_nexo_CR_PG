import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './detalleSolicitudTutor.css';

function DetalleSolicitudTutor({
  onNavegar,
  solicitud,
  onEnviarMensaje,
}) {
  if (!solicitud) {
    return (
      <div className="detalle-solicitud-tutor-layout">
        <Sidebar paginaActiva="Solicitudes recibidas" onNavegar={onNavegar} />
        <div className="detalle-solicitud-tutor-contenido">
          <Navbar titulo="Detalle de solicitud" onNavegar={onNavegar} />
          <main className="detalle-solicitud-tutor-main">
            <button
              type="button"
              className="detalle-solicitud-tutor__volver"
              onClick={() => onNavegar?.('Solicitudes recibidas')}
            >
              Volver a solicitudes
            </button>
          </main>
        </div>
      </div>
    );
  }

  const estadoClase = solicitud.estado.toLowerCase();

  return (
    <div className="detalle-solicitud-tutor-layout">
      <Sidebar paginaActiva="Solicitudes recibidas" onNavegar={onNavegar} />

      <div className="detalle-solicitud-tutor-contenido">
        <Navbar titulo="Detalle de solicitud" onNavegar={onNavegar} />

        <main className="detalle-solicitud-tutor-main">
          <nav className="detalle-solicitud-tutor__breadcrumb">
            <button
              type="button"
              onClick={() => onNavegar?.('Solicitudes recibidas')}
            >
              Solicitudes recibidas
            </button>
            <span>/</span>
            <strong>Solicitud #{solicitud.id}</strong>
          </nav>

          <header className="detalle-solicitud-tutor__encabezado">
            <h1>Detalle de solicitud</h1>
            <span className={`detalle-solicitud-tutor__estado detalle-solicitud-tutor__estado--${estadoClase}`}>
              {solicitud.estado}
            </span>
          </header>

          <section className="detalle-solicitud-tutor__card detalle-solicitud-tutor__perfil">
            <h2>TUTOR</h2>
            <div className="detalle-solicitud-tutor__perfil-contenido">
              <span className="detalle-solicitud-tutor__avatar">NT</span>
              <div>
                <strong>Nombre del tutor</strong>
                <p>Ingeniería de Sistemas · 7° semestre</p>
                <span className="detalle-solicitud-tutor__calificacion">★★★★★ <b>4.9</b></span>
              </div>
            </div>
          </section>

          <section className="detalle-solicitud-tutor__card">
            <h2>INFORMACIÓN DE LA SOLICITUD</h2>
            <dl className="detalle-solicitud-tutor__datos">
              <div><dt>Materia</dt><dd>{solicitud.materia}</dd></div>
              <div><dt>Tema</dt><dd>{solicitud.tema}</dd></div>
              <div><dt>Modalidad</dt><dd>{solicitud.modalidad}</dd></div>
              <div><dt>Fecha de solicitud</dt><dd>{solicitud.fecha}</dd></div>
              <div><dt>Estado</dt><dd>{solicitud.estado}</dd></div>
              <div className="detalle-solicitud-tutor__descripcion">
                <dt>Descripción</dt>
                <dd>{solicitud.descripcion}</dd>
              </div>
            </dl>
          </section>

          {solicitud.propuesta && solicitud.horario && (
            <section className="detalle-solicitud-tutor__card">
              <h2>PROPUESTA DE HORARIO</h2>
              <div className="detalle-solicitud-tutor__propuesta">
                <strong>El tutor propuso un horario</strong>
                <span>{solicitud.horario}</span>
                <b>{solicitud.estadoPropuesta || 'Por confirmar'}</b>
              </div>
            </section>
          )}

          <div className="detalle-solicitud-tutor__acciones">
            <button
              type="button"
              className="detalle-solicitud-tutor__boton detalle-solicitud-tutor__boton--secundario"
              onClick={() => onEnviarMensaje?.(solicitud)}
            >
              Enviar mensaje
            </button>
            {solicitud.propuesta && (
              <button
                type="button"
                className="detalle-solicitud-tutor__boton detalle-solicitud-tutor__boton--principal"
                disabled
                title="Falta el frame de Figma para ver la propuesta en el contexto del tutor."
              >
                Ver propuesta completa
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DetalleSolicitudTutor;
