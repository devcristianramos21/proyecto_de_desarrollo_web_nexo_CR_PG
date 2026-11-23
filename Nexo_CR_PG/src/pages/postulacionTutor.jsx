import { useEffect, useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import {
  crearSolicitudTutor,
  listarMisSolicitudesTutor,
  obtenerMiPerfil,
} from '../services/solicitudesTutor';
import './postulacionTutor.css';

const MAX_MATERIAS = 15;
const MAX_MOTIVACION = 1000;

function mostrarFecha(fecha) {
  if (!fecha) return '';
  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) return '';

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
  }).format(parsed);
}

export default function PostulacionTutor({
  onNavegar,
  onUsuarioActualizado,
  sesionActiva,
  usuario,
}) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [materiasTexto, setMateriasTexto] = useState('');
  const [motivacion, setMotivacion] = useState('');
  const [cargando, setCargando] = useState(Boolean(sesionActiva));
  const [enviando, setEnviando] = useState(false);
  const [intentoCarga, setIntentoCarga] = useState(0);
  const [errorCarga, setErrorCarga] = useState('');
  const [errorEnvio, setErrorEnvio] = useState('');

  useEffect(() => {
    if (!sesionActiva) return undefined;

    let vigente = true;

    Promise.all([
      listarMisSolicitudesTutor(),
      obtenerMiPerfil(),
    ])
      .then(([solicitudesUsuario, perfil]) => {
        if (!Array.isArray(solicitudesUsuario)) {
          throw new Error('El servidor devolvió un listado de solicitudes inválido.');
        }
        if (!vigente) return;

        setSolicitudes(solicitudesUsuario);
        onUsuarioActualizado(perfil);
      })
      .catch((error) => {
        if (vigente) setErrorCarga(error.message);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [sesionActiva, intentoCarga, onUsuarioActualizado]);

  const ultimaSolicitud = solicitudes[0] || null;
  const estado = ultimaSolicitud?.estado;
  const programa = usuario?.carrera || usuario?.programa || 'No registrado';
  const semestre = usuario?.semestre || 'No registrado';
  const esTutor = usuario?.rol === 'tutor' || usuario?.rol === 'Estudiante-Tutor';
  const mostrarFormulario = sesionActiva
    && !cargando
    && !errorCarga
    && estado !== 'pendiente'
    && estado !== 'aprobada'
    && !esTutor;

  const enviarPostulacion = async (evento) => {
    evento.preventDefault();
    setErrorEnvio('');

    const materias = materiasTexto
      .split(/[\n,]/)
      .map((materia) => materia.trim())
      .filter(Boolean);

    if (materias.length === 0) {
      setErrorEnvio('Indica al menos una materia.');
      return;
    }
    if (materias.length > MAX_MATERIAS) {
      setErrorEnvio(`Puedes indicar hasta ${MAX_MATERIAS} materias.`);
      return;
    }
    if (!motivacion.trim()) {
      setErrorEnvio('La motivación es obligatoria.');
      return;
    }

    setEnviando(true);
    try {
      const solicitud = await crearSolicitudTutor({
        materias,
        motivacion: motivacion.trim(),
      });
      setSolicitudes((actuales) => [solicitud, ...actuales]);
      setMateriasTexto('');
      setMotivacion('');
    } catch (error) {
      setErrorEnvio(error.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="postulacion-tutor">
      <Sidebar paginaActiva="Postulación tutor" onNavegar={onNavegar} />
      <main className="postulacion-tutor__principal">
        <Navbar titulo="Quiero ser tutor" onNavegar={onNavegar} />
        <div className="postulacion-tutor__contenido">
          <div className="postulacion-tutor__breadcrumb">
            <button type="button" onClick={() => onNavegar?.('Inicio')}>Inicio</button>
            <span aria-hidden="true">/</span>
            <strong>Quiero ser tutor</strong>
          </div>

          <header className="postulacion-tutor__encabezado">
            <h1>Postulación para ser tutor</h1>
            <p>Comparte las materias que deseas enseñar y tu motivación.</p>
          </header>

          {!sesionActiva && (
            <section className="postulacion-tutor__mensaje" role="alert">
              <strong>Inicia sesión para consultar o enviar una postulación.</strong>
              <button type="button" className="postulacion-tutor__boton-principal" onClick={() => onNavegar?.('Iniciar sesión')}>
                Iniciar sesión
              </button>
            </section>
          )}

          {sesionActiva && cargando && (
            <p className="postulacion-tutor__aviso" role="status">Consultando el estado de tu postulación…</p>
          )}

          {sesionActiva && errorCarga && (
            <section className="postulacion-tutor__mensaje postulacion-tutor__mensaje--error" role="alert">
              <p>{errorCarga}</p>
              <button
                type="button"
                className="postulacion-tutor__boton-secundario"
                onClick={() => {
                  setCargando(true);
                  setErrorCarga('');
                  setIntentoCarga((actual) => actual + 1);
                }}
              >
                Reintentar
              </button>
            </section>
          )}

          {ultimaSolicitud && !cargando && (
            <section className={`postulacion-tutor__estado postulacion-tutor__estado--${estado}`} aria-live="polite">
              <div>
                <span>Estado de tu postulación</span>
                <strong>{estado?.charAt(0).toUpperCase()}{estado?.slice(1)}</strong>
              </div>
              {ultimaSolicitud.createdAt && (
                <p>Enviada el {mostrarFecha(ultimaSolicitud.createdAt)}</p>
              )}
              {estado === 'pendiente' && (
                <p>Tu solicitud está en revisión. No puedes enviar otra mientras esté pendiente.</p>
              )}
              {estado === 'aprobada' && (
                <p>Tu postulación fue aprobada. Ya tienes acceso a las funcionalidades de tutor.</p>
              )}
              {estado === 'rechazada' && ultimaSolicitud.comentarioRevision && (
                <p><strong>Motivo:</strong> {ultimaSolicitud.comentarioRevision}</p>
              )}
            </section>
          )}

          {sesionActiva && !cargando && !errorCarga && esTutor && !ultimaSolicitud && (
            <section className="postulacion-tutor__estado postulacion-tutor__estado--aprobada" role="status">
              <strong>Tu cuenta ya tiene acceso a las funcionalidades de tutor.</strong>
            </section>
          )}

          {mostrarFormulario && (
            <form className="postulacion-tutor__formulario" onSubmit={enviarPostulacion}>
              <div className="postulacion-tutor__perfil">
                <div>
                  <span>Programa académico</span>
                  <strong>{programa}</strong>
                </div>
                <div>
                  <span>Semestre</span>
                  <strong>{semestre}</strong>
                </div>
              </div>

              {estado === 'rechazada' && (
                <p className="postulacion-tutor__aviso">
                  Puedes enviar una nueva postulación después de revisar el motivo del rechazo.
                </p>
              )}

              <label className="postulacion-tutor__campo">
                <span>Materias en las que deseas ser tutor</span>
                <textarea
                  value={materiasTexto}
                  onChange={(evento) => setMateriasTexto(evento.target.value)}
                  placeholder="Escribe una materia por línea"
                  rows={4}
                  required
                />
                <small>Puedes indicar hasta {MAX_MATERIAS} materias.</small>
              </label>

              <label className="postulacion-tutor__campo">
                <span>Motivación para convertirte en tutor</span>
                <textarea
                  value={motivacion}
                  onChange={(evento) => setMotivacion(evento.target.value)}
                  placeholder="Cuéntanos por qué quieres apoyar a otros estudiantes."
                  rows={5}
                  maxLength={MAX_MOTIVACION}
                  required
                />
                <small>{motivacion.length}/{MAX_MOTIVACION}</small>
              </label>

              {errorEnvio && <p className="postulacion-tutor__error" role="alert">{errorEnvio}</p>}

              <div className="postulacion-tutor__acciones">
                <button type="button" className="postulacion-tutor__boton-secundario" onClick={() => onNavegar?.('Inicio')}>
                  Cancelar
                </button>
                <button type="submit" className="postulacion-tutor__boton-principal" disabled={enviando}>
                  {enviando ? 'Enviando…' : 'Enviar postulación'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
