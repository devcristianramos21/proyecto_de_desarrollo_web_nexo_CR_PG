
import { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './CentroSoporte.css';

const preguntasFrecuentes = [
  {
    id: 1,
    pregunta: '¿Cómo propongo un horario como tutor?',
    respuesta:
      'Desde la sección Mis tutorías puedes consultar tus monitorías y gestionar los horarios disponibles para tus estudiantes.',
  },
  {
    id: 2,
    pregunta: '¿Puedo cancelar una tutoría ya confirmada?',
    respuesta:
      'Puedes consultar tus tutorías confirmadas desde Mis tutorías. Si necesitas cancelar una sesión, revisa sus opciones de gestión y notifica al estudiante.',
  },
  {
    id: 3,
    pregunta: '¿Cuántas tutorías activas puedo tener?',
    respuesta:
      'La cantidad de tutorías activas depende de la disponibilidad y de las condiciones de tu cuenta. Puedes consultar tus sesiones en Mis tutorías.',
  },
  {
    id: 4,
    pregunta: '¿Cómo dejo una reseña de mi tutor?',
    respuesta:
      'Después de completar una tutoría, podrás acceder a la opción de dejar una reseña desde el detalle de la sesión.',
  },
];

const solicitudesIniciales = [];

export default function CentroSoporte({ onNavegar }) {
  const [pestanaActiva, setPestanaActiva] = useState('nueva');
  const [tipoSituacion, setTipoSituacion] = useState('Problema técnico');
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);

  const enviarSolicitud = (event) => {
    event.preventDefault();

    const nuevaSolicitud = {
      id: Date.now(),
      tipo: tipoSituacion,
      asunto: asunto.trim(),
      descripcion: descripcion.trim(),
      fecha: new Date().toLocaleDateString('es-CO'),
      estado: 'Pendiente',
    };

    setSolicitudes((actuales) => [nuevaSolicitud, ...actuales]);
    setAsunto('');
    setDescripcion('');
    setTipoSituacion('Problema técnico');
    setPestanaActiva('mis');

    alert('¡Tu solicitud de soporte fue registrada correctamente!');
  };

  const cambiarPregunta = (id) => {
    setPreguntaAbierta((actual) => (actual === id ? null : id));
  };

  return (
    <div className="centro-soporte">
      <Sidebar
        paginaActiva="Soporte"
        onNavegar={onNavegar}
      />

      <main className="centro-soporte__principal">
        <Navbar titulo="Centro de soporte" />

        <div className="centro-soporte__contenido">

          {/* ENCABEZADO */}

          <header className="centro-soporte__encabezado">
            <h1>Centro de soporte</h1>
            <p>Estamos aquí para ayudarte</p>
          </header>

          {/* PESTAÑAS */}

          <nav className="centro-soporte__pestanas">
            <button
              type="button"
              className={
                pestanaActiva === 'nueva'
                  ? 'centro-soporte__pestana centro-soporte__pestana--activa'
                  : 'centro-soporte__pestana'
              }
              onClick={() => setPestanaActiva('nueva')}
            >
              Nueva solicitud
            </button>

            <button
              type="button"
              className={
                pestanaActiva === 'mis'
                  ? 'centro-soporte__pestana centro-soporte__pestana--activa'
                  : 'centro-soporte__pestana'
              }
              onClick={() => setPestanaActiva('mis')}
            >
              Mis solicitudes
            </button>
          </nav>

          {/* NUEVA SOLICITUD */}

          {pestanaActiva === 'nueva' && (
            <section className="centro-soporte__formulario-card">
              <div className="centro-soporte__formulario-encabezado">
                <h2>¿En qué podemos ayudarte?</h2>
                <p>Completa el formulario y te respondemos pronto</p>
              </div>

              <form
                className="centro-soporte__formulario"
                onSubmit={enviarSolicitud}
              >
                <div className="centro-soporte__campo">
                  <label htmlFor="tipo-situacion">
                    Tipo de situación
                  </label>

                  <select
                    id="tipo-situacion"
                    value={tipoSituacion}
                    onChange={(event) =>
                      setTipoSituacion(event.target.value)
                    }
                  >
                    <option>Problema técnico</option>
                    <option>Problema con una tutoría</option>
                    <option>Problema con una solicitud</option>
                    <option>Problema con mi cuenta</option>
                    <option>Otro</option>
                  </select>
                </div>

                <div className="centro-soporte__campo">
                  <label htmlFor="asunto">Asunto</label>

                  <input
                    id="asunto"
                    type="text"
                    value={asunto}
                    onChange={(event) => setAsunto(event.target.value)}
                    placeholder="Describe brevemente el problema..."
                    required
                  />
                </div>

                <div className="centro-soporte__campo">
                  <label htmlFor="descripcion">
                    Descripción detallada
                  </label>

                  <textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(event) =>
                      setDescripcion(event.target.value)
                    }
                    placeholder="Cuéntanos con detalle qué ocurrió, cuándo y qué intentaste hacer..."
                    required
                  />
                </div>

                <p className="centro-soporte__ayuda">
                  Cuanta más información proporciones, más rápido podremos ayudarte.
                </p>

                <button
                  type="submit"
                  className="centro-soporte__enviar"
                >
                  Enviar solicitud
                </button>
              </form>
            </section>
          )}

          {/* MIS SOLICITUDES */}

          {pestanaActiva === 'mis' && (
            <section className="centro-soporte__mis-solicitudes">
              <h2>Mis solicitudes</h2>

              {solicitudes.length > 0 ? (
                <div className="centro-soporte__solicitudes-lista">
                  {solicitudes.map((solicitud) => (
                    <article
                      className="centro-soporte__solicitud"
                      key={solicitud.id}
                    >
                      <div>
                        <h3>{solicitud.asunto}</h3>
                        <p>{solicitud.tipo}</p>
                        <span>Enviada el {solicitud.fecha}</span>
                      </div>

                      <span className="centro-soporte__estado">
                        {solicitud.estado}
                      </span>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="centro-soporte__sin-solicitudes">
                  <p>Aún no has enviado solicitudes de soporte.</p>
                  <button
                    type="button"
                    onClick={() => setPestanaActiva('nueva')}
                  >
                    Crear nueva solicitud
                  </button>
                </div>
              )}
            </section>
          )}

          {/* PREGUNTAS FRECUENTES */}

          <section className="centro-soporte__faq">
            <h2>PREGUNTAS FRECUENTES</h2>

            <div className="centro-soporte__faq-card">
              {preguntasFrecuentes.map((item) => (
                <article
                  className="centro-soporte__faq-item"
                  key={item.id}
                >
                  <button
                    type="button"
                    className="centro-soporte__faq-pregunta"
                    aria-expanded={preguntaAbierta === item.id}
                    onClick={() => cambiarPregunta(item.id)}
                  >
                    <span>{item.pregunta}</span>

                    <span
                      className={`centro-soporte__chevron ${
                        preguntaAbierta === item.id
                          ? 'centro-soporte__chevron--abierto'
                          : ''
                      }`}
                    >
                      ›
                    </span>
                  </button>

                  {preguntaAbierta === item.id && (
                    <div className="centro-soporte__faq-respuesta">
                      {item.respuesta}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
