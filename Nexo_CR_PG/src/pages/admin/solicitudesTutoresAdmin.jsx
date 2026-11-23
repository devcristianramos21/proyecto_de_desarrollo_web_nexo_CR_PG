import { useEffect, useState } from 'react';
import AdminShell from './AdminShell';
import {
  aprobarSolicitudTutor,
  listarSolicitudesTutorAdmin,
  rechazarSolicitudTutor,
} from '../../services/solicitudesTutor';
import './solicitudesTutoresAdmin.css';

const FILTROS = [
  { texto: 'Pendientes', estado: 'pendiente' },
  { texto: 'Aprobadas', estado: 'aprobada' },
  { texto: 'Rechazadas', estado: 'rechazada' },
  { texto: 'Todas', estado: '' },
];

function mostrarFecha(fecha) {
  if (!fecha) return '—';
  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) return '—';

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
  }).format(parsed);
}

export default function SolicitudesTutoresAdmin({ onNavegar }) {
  const [estadoFiltro, setEstadoFiltro] = useState('pendiente');
  const [solicitudes, setSolicitudes] = useState([]);
  const [detalleId, setDetalleId] = useState(null);
  const [rechazoId, setRechazoId] = useState(null);
  const [comentario, setComentario] = useState('');
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);
  const [intentoCarga, setIntentoCarga] = useState(0);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    let vigente = true;

    listarSolicitudesTutorAdmin(estadoFiltro)
      .then((resultado) => {
        if (!Array.isArray(resultado)) {
          throw new Error('El servidor devolvió un listado de solicitudes inválido.');
        }
        if (vigente) setSolicitudes(resultado);
      })
      .catch((errorCarga) => {
        if (vigente) setError(errorCarga.message);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [estadoFiltro, intentoCarga]);

  const actualizarSolicitud = (solicitudActualizada) => {
    setSolicitudes((actuales) => {
      if (estadoFiltro && estadoFiltro !== solicitudActualizada.estado) {
        return actuales.filter((solicitud) => solicitud._id !== solicitudActualizada._id);
      }

      return actuales.map((solicitud) => (
        solicitud._id === solicitudActualizada._id
          ? solicitudActualizada
          : solicitud
      ));
    });
  };

  const seleccionarFiltro = (estado) => {
    setCargando(true);
    setError('');
    if (estado === estadoFiltro) {
      setIntentoCarga((actual) => actual + 1);
      return;
    }
    setEstadoFiltro(estado);
  };

  const reintentarCarga = () => {
    setCargando(true);
    setError('');
    setIntentoCarga((actual) => actual + 1);
  };

  const aprobar = async (solicitud) => {
    setError('');
    setMensaje('');
    setProcesandoId(solicitud._id);
    try {
      const actualizada = await aprobarSolicitudTutor(solicitud._id);
      actualizarSolicitud(actualizada);
      setMensaje('Postulación aprobada. El backend actualizó el rol del usuario.');
    } catch (errorAprobacion) {
      setError(errorAprobacion.message);
    } finally {
      setProcesandoId(null);
    }
  };

  const rechazar = async (evento, solicitud) => {
    evento.preventDefault();
    const motivo = comentario.trim();
    if (!motivo) {
      setError('Escribe el motivo del rechazo.');
      return;
    }

    setError('');
    setMensaje('');
    setProcesandoId(solicitud._id);
    try {
      const actualizada = await rechazarSolicitudTutor(solicitud._id, motivo);
      actualizarSolicitud(actualizada);
      setRechazoId(null);
      setComentario('');
      setMensaje('Postulación rechazada y motivo registrado.');
    } catch (errorRechazo) {
      setError(errorRechazo.message);
    } finally {
      setProcesandoId(null);
    }
  };

  return (
    <AdminShell
      titulo="Solicitudes de tutores"
      paginaActiva="Solicitudes de tutores admin"
      onNavegar={onNavegar}
    >
      <div className="solicitudes-tutores-admin">
        <header className="admin-page-header solicitudes-tutores-admin__encabezado">
          <div>
            <h1>Solicitudes de tutores</h1>
            <p>Revisa las postulaciones y registra la decisión administrativa.</p>
          </div>
        </header>

        <nav className="solicitudes-tutores-admin__filtros" aria-label="Filtrar postulaciones">
          {FILTROS.map((filtro) => (
            <button
              type="button"
              key={filtro.texto}
              className={estadoFiltro === filtro.estado
                ? 'solicitudes-tutores-admin__filtro solicitudes-tutores-admin__filtro--activo'
                : 'solicitudes-tutores-admin__filtro'}
              aria-pressed={estadoFiltro === filtro.estado}
              onClick={() => seleccionarFiltro(filtro.estado)}
            >
              {filtro.texto}
            </button>
          ))}
        </nav>

        {error && (
          <div className="admin-alert solicitudes-tutores-admin__error" role="alert">
            <p>{error}</p>
            <button type="button" className="admin-secondary-button" onClick={reintentarCarga}>
              Reintentar
            </button>
          </div>
        )}
        {mensaje && <p className="admin-toast" role="status">{mensaje}</p>}
        {cargando && <p className="solicitudes-tutores-admin__aviso" role="status">Cargando solicitudes…</p>}

        {!cargando && !error && (
          <section className="solicitudes-tutores-admin__lista" aria-live="polite">
            {solicitudes.map((solicitud) => {
              const estudiante = solicitud.estudiante || {};
              const estaAbierta = detalleId === solicitud._id;
              const estado = solicitud.estado;

              return (
                <article className="solicitudes-tutores-admin__tarjeta admin-card" key={solicitud._id}>
                  <div className="solicitudes-tutores-admin__resumen">
                    <div className="solicitudes-tutores-admin__persona">
                      <strong>{estudiante.nombre || 'Estudiante no disponible'}</strong>
                      <span>{estudiante.correo || 'Sin correo'}</span>
                      <small>{estudiante.carrera || 'Programa no registrado'} · Semestre {estudiante.semestre || '—'}</small>
                    </div>
                    <div className="solicitudes-tutores-admin__estado-y-fecha">
                      <span className={`solicitudes-tutores-admin__estado solicitudes-tutores-admin__estado--${estado}`}>
                        {estado?.charAt(0).toUpperCase()}{estado?.slice(1)}
                      </span>
                      <small>{mostrarFecha(solicitud.createdAt)}</small>
                    </div>
                    <button
                      type="button"
                      className="admin-secondary-button"
                      aria-expanded={estaAbierta}
                      onClick={() => setDetalleId((actual) => actual === solicitud._id ? null : solicitud._id)}
                    >
                      {estaAbierta ? 'Ocultar detalle' : 'Ver detalle'}
                    </button>
                  </div>

                  {estaAbierta && (
                    <div className="solicitudes-tutores-admin__detalle">
                      <div>
                        <strong>Materias propuestas</strong>
                        <ul>
                          {(solicitud.materias || []).map((materia) => <li key={materia}>{materia}</li>)}
                        </ul>
                      </div>
                      <div>
                        <strong>Motivación</strong>
                        <p>{solicitud.motivacion}</p>
                      </div>
                      {estado === 'rechazada' && solicitud.comentarioRevision && (
                        <div>
                          <strong>Motivo del rechazo</strong>
                          <p>{solicitud.comentarioRevision}</p>
                        </div>
                      )}

                      {estado === 'pendiente' && (
                        <div className="solicitudes-tutores-admin__acciones">
                          <button
                            type="button"
                            className="admin-primary-button"
                            disabled={procesandoId === solicitud._id}
                            onClick={() => aprobar(solicitud)}
                          >
                            {procesandoId === solicitud._id ? 'Procesando…' : 'Aprobar'}
                          </button>
                          <button
                            type="button"
                            className="admin-secondary-button"
                            disabled={procesandoId === solicitud._id}
                            onClick={() => {
                              setRechazoId((actual) => actual === solicitud._id ? null : solicitud._id);
                              setComentario('');
                              setError('');
                            }}
                          >
                            Rechazar
                          </button>
                        </div>
                      )}

                      {rechazoId === solicitud._id && estado === 'pendiente' && (
                        <form className="solicitudes-tutores-admin__formulario-rechazo" onSubmit={(evento) => rechazar(evento, solicitud)}>
                          <label>
                            Motivo del rechazo
                            <textarea
                              className="admin-textarea"
                              value={comentario}
                              onChange={(evento) => setComentario(evento.target.value)}
                              maxLength={500}
                              rows={3}
                              required
                            />
                          </label>
                          <div>
                            <button type="button" className="admin-text-button" onClick={() => setRechazoId(null)}>Cancelar</button>
                            <button type="submit" className="admin-primary-button" disabled={procesandoId === solicitud._id}>
                              Confirmar rechazo
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
            {solicitudes.length === 0 && (
              <p className="solicitudes-tutores-admin__vacio admin-card">No hay postulaciones para este estado.</p>
            )}
          </section>
        )}
      </div>
    </AdminShell>
  );
}
