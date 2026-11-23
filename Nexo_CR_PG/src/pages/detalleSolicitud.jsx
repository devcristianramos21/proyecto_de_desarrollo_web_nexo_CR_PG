
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './detalleSolicitud.css';

function DetalleSolicitud({ onNavegar, solicitud, onVerPropuesta }) {
  // Datos de ejemplo para completar los campos
  // que todavía no existen en el listado de solicitudes.
  const datosBase = {
    id: 204,
    materia: 'Cálculo diferencial',
    tema: 'Integrales definidas',
    tutor: 'Nombre del tutor',
    programaTutor: 'Ingeniería de Sistemas',
    semestreTutor: '7° semestre',
    calificacion: '4.9',
    modalidad: 'Virtual',
    fecha: '12 de junio de 2025',
    estado: 'Aceptada',
    descripcion:
      'Necesito entender mejor el concepto de integral definida y cómo aplicar el teorema fundamental del cálculo. Tengo parcial la próxima semana.',
    propuesta: true,
    horario: 'Jueves 19 Jun · 3:00 PM — 4:00 PM',
    estadoPropuesta: 'Aceptado',
  };

  const datos = {
    ...datosBase,
    ...(solicitud || {}),
  };

  const estado = datos.estado || 'Pendiente';
  const tienePropuesta = Boolean(datos.propuesta);

  // ========================================
  // NAVEGACIÓN
  // ========================================

  const volver = () => {
    onNavegar?.('Mis solicitudes');
  };

  const enviarMensaje = () => {
    onNavegar?.('Mensajes');
  };

  const verPropuesta = () => {
    onVerPropuesta?.();
  };

  // ========================================
  // VISTA
  // ========================================

  return (
    <div className="detalle-solicitud-layout">
      <Sidebar
        paginaActiva="Mis solicitudes"
        onNavegar={onNavegar}
      />

      <div className="detalle-solicitud-contenido">
        <Navbar titulo="Detalle de solicitud" />

        <main className="detalle-solicitud-main">

          {/* BREADCRUMB */}
          <nav className="detalle-solicitud__breadcrumb">
            <button type="button" onClick={volver}>
              Mis solicitudes
            </button>

            <span>/</span>

            <span>Solicitud #{datos.id || 204}</span>
          </nav>

          {/* ENCABEZADO */}
          <header className="detalle-solicitud__encabezado">
            <h1>Detalle de solicitud</h1>

            <span
              className={`detalle-solicitud__estado detalle-solicitud__estado--${estado.toLowerCase()}`}
            >
              {estado}
            </span>
          </header>

          {/* TARJETA DEL TUTOR */}
          <section className="detalle-solicitud__card detalle-solicitud__tutor">
            <h2 className="detalle-solicitud__titulo-seccion">
              TUTOR
            </h2>

            <div className="detalle-solicitud__tutor-contenido">
              <div className="detalle-solicitud__avatar">
                NT
              </div>

              <div className="detalle-solicitud__tutor-info">
                <h3>{datos.tutor}</h3>

                <p>
                  {datos.programaTutor} · {datos.semestreTutor}
                </p>

                <div className="detalle-solicitud__calificacion">
                  <span>★★★★★</span>
                  <strong>{datos.calificacion}</strong>
                </div>
              </div>

              <button
                type="button"
                className="detalle-solicitud__boton detalle-solicitud__boton--secundario"
                onClick={() =>
                  alert('El perfil del tutor estará disponible próximamente.')
                }
              >
                Ver perfil
              </button>
            </div>
          </section>

          {/* INFORMACIÓN DE LA SOLICITUD */}
          <section className="detalle-solicitud__card detalle-solicitud__informacion">
            <h2 className="detalle-solicitud__titulo-seccion">
              INFORMACIÓN DE LA SOLICITUD
            </h2>

            <div className="detalle-solicitud__filas">

              <div className="detalle-solicitud__fila">
                <span>Materia</span>
                <strong>{datos.materia}</strong>
              </div>

              <div className="detalle-solicitud__fila">
                <span>Tema</span>
                <strong>{datos.tema}</strong>
              </div>

              <div className="detalle-solicitud__fila">
                <span>Modalidad</span>
                <strong>{datos.modalidad}</strong>
              </div>

              <div className="detalle-solicitud__fila">
                <span>Fecha de solicitud</span>
                <strong>{datos.fecha}</strong>
              </div>

              <div className="detalle-solicitud__fila">
                <span>Estado</span>
                <strong>
                  {estado === 'Aceptada'
                    ? 'Aceptada por el tutor'
                    : estado}
                </strong>
              </div>

              <div className="detalle-solicitud__fila detalle-solicitud__fila--descripcion">
                <span>Descripción</span>
                <strong>{datos.descripcion}</strong>
              </div>

            </div>
          </section>

          {/* PROPUESTA DE HORARIO */}
          <section className="detalle-solicitud__card detalle-solicitud__propuesta">
            <h2 className="detalle-solicitud__titulo-seccion">
              PROPUESTA DE HORARIO
            </h2>

            {tienePropuesta ? (
              <>
                <div className="detalle-solicitud__aviso">
                  <span className="detalle-solicitud__aviso-icono">
                    ⓘ
                  </span>

                  <div>
                    <h3>El tutor propuso un horario</h3>

                    <p>
                      Tienes hasta el 14 de junio para aceptar o rechazar
                      la propuesta.
                    </p>
                  </div>
                </div>

                <div className="detalle-solicitud__horario">
                  <div className="detalle-solicitud__horario-info">
                    <span>▣</span>
                    <strong>{datos.horario}</strong>
                  </div>

                  <span className="detalle-solicitud__horario-estado">
                    {datos.estadoPropuesta || 'Pendiente'}
                  </span>
                </div>
              </>
            ) : (
              <div className="detalle-solicitud__sin-propuesta">
                El tutor todavía no ha enviado una propuesta de horario.
              </div>
            )}
          </section>

          {/* ACCIONES */}
          <div className="detalle-solicitud__acciones">

            <button
              type="button"
              className="detalle-solicitud__boton detalle-solicitud__boton--secundario"
              onClick={enviarMensaje}
            >
              Enviar mensaje
            </button>

            {tienePropuesta && (
              <button
                type="button"
                className="detalle-solicitud__boton detalle-solicitud__boton--principal"
                onClick={verPropuesta}
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

export default DetalleSolicitud;
