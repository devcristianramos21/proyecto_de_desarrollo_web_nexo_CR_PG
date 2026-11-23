import { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './detalleSolicitudTutor.css';

function DetalleSolicitudTutor({
  onNavegar,
  solicitud,
  onEnviarMensaje,
  onProponerHorario,
}) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [enviandoPropuesta, setEnviandoPropuesta] = useState(false);
  const [errorPropuesta, setErrorPropuesta] = useState('');
  const [propuestaEnviada, setPropuestaEnviada] = useState(false);

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
  const puedeProponerHorario = solicitud.estado === 'Aceptada'
    && solicitud.estadoPropuesta !== 'Aceptado'
    && !solicitud.propuestaPendiente;

  const enviarPropuestaHorario = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setErrorPropuesta('');
    setEnviandoPropuesta(true);
    try {
      await onProponerHorario(solicitud.id, {
        fechaPrincipal: formData.get('fechaPrincipal'),
        horaInicioPrincipal: formData.get('horaInicioPrincipal'),
        horaFinPrincipal: formData.get('horaFinPrincipal'),
        fechaAlternativa: formData.get('fechaAlternativa'),
        horaInicioAlternativa: formData.get('horaInicioAlternativa'),
        horaFinAlternativa: formData.get('horaFinAlternativa'),
        nota: formData.get('nota'),
      });
      setMostrarFormulario(false);
      setPropuestaEnviada(true);
    } catch (errorApi) {
      setErrorPropuesta(errorApi.message || 'No se pudo enviar la propuesta.');
    } finally {
      setEnviandoPropuesta(false);
    }
  };

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
            <h2>ESTUDIANTE</h2>
            <div className="detalle-solicitud-tutor__perfil-contenido">
              <span className="detalle-solicitud-tutor__avatar">{solicitud.iniciales || 'NE'}</span>
              <div>
                <strong>{solicitud.estudiante}</strong>
                <p>{solicitud.programaEstudiante} · {solicitud.semestreEstudiante}</p>
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

          {puedeProponerHorario && (
            <section className="detalle-solicitud-tutor__card">
              <h2>PROPONER HORARIO</h2>
              {!mostrarFormulario ? (
                <button
                  type="button"
                  className="detalle-solicitud-tutor__boton detalle-solicitud-tutor__boton--principal"
                  onClick={() => setMostrarFormulario(true)}
                >
                  Proponer horario
                </button>
              ) : (
                <form className="detalle-solicitud-tutor__formulario" onSubmit={enviarPropuestaHorario}>
                  <fieldset>
                    <legend>Horario principal</legend>
                    <label>
                      Fecha
                      <input name="fechaPrincipal" type="date" required />
                    </label>
                    <label>
                      Hora de inicio
                      <input name="horaInicioPrincipal" type="time" required />
                    </label>
                    <label>
                      Hora de fin
                      <input name="horaFinPrincipal" type="time" required />
                    </label>
                  </fieldset>
                  <fieldset>
                    <legend>Horario alternativo</legend>
                    <label>
                      Fecha
                      <input name="fechaAlternativa" type="date" required />
                    </label>
                    <label>
                      Hora de inicio
                      <input name="horaInicioAlternativa" type="time" required />
                    </label>
                    <label>
                      Hora de fin
                      <input name="horaFinAlternativa" type="time" required />
                    </label>
                  </fieldset>
                  <label className="detalle-solicitud-tutor__nota">
                    Nota para el estudiante (opcional)
                    <textarea name="nota" maxLength={500} rows={3} />
                  </label>
                  {errorPropuesta && <p role="alert">{errorPropuesta}</p>}
                  <div className="detalle-solicitud-tutor__formulario-acciones">
                    <button
                      type="button"
                      className="detalle-solicitud-tutor__boton detalle-solicitud-tutor__boton--secundario"
                      onClick={() => setMostrarFormulario(false)}
                      disabled={enviandoPropuesta}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="detalle-solicitud-tutor__boton detalle-solicitud-tutor__boton--principal"
                      disabled={enviandoPropuesta}
                    >
                      {enviandoPropuesta ? 'Enviando…' : 'Enviar propuesta'}
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}
          {propuestaEnviada && <p role="status">La propuesta de horario fue enviada.</p>}

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
