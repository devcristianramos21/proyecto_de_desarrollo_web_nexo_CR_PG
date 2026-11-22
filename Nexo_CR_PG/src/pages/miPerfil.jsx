
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './MiPerfil.css';

const estadisticas = [
  {
    id: 1,
    valor: '12',
    etiqueta: 'Tutorías completadas',
  },
  {
    id: 2,
    valor: '3',
    etiqueta: 'Tutores favoritos',
  },
  {
    id: 3,
    valor: '4.8',
    etiqueta: 'Mi calificación promedio',
  },
];

const informacionPersonal = [
  {
    etiqueta: 'Nombre',
    valor: 'Nombre del estudiante',
  },
  {
    etiqueta: 'Correo electrónico',
    valor: 'correo@ejemplo.com',
  },
  {
    etiqueta: 'Programa académico',
    valor: 'Ingeniería de Sistemas',
  },
  {
    etiqueta: 'Semestre',
    valor: '5°',
  },
  {
    etiqueta: 'Rol',
    valor: 'Estudiante',
  },
];

export default function MiPerfil({ onNavegar }) {
  const mostrarMensaje = (mensaje) => {
    alert(mensaje);
  };

  return (
    <div className="perfil-estudiante">
      <Sidebar
        paginaActiva="Mi perfil"
        onNavegar={onNavegar}
      />

      <main className="perfil-estudiante__principal">
        <Navbar titulo="Mi perfil" />

        <div className="perfil-estudiante__contenido">

          {/* ENCABEZADO */}

          <header className="perfil-estudiante__encabezado">
            <h1>Mi perfil</h1>
            <p>Información de tu cuenta</p>
          </header>

          {/* TARJETAS SUPERIORES */}

          <section className="perfil-estudiante__resumen">

            {/* INFORMACIÓN DEL ESTUDIANTE */}

            <article className="perfil-estudiante__tarjeta">
              <div className="perfil-estudiante__avatar">
                NE
              </div>

              <div className="perfil-estudiante__datos">
                <h2>Nombre del estudiante</h2>

                <p>Ingeniería de Sistemas · 5° semestre</p>

                <div className="perfil-estudiante__badges">
                  <span className="perfil-estudiante__badge perfil-estudiante__badge--rol">
                    <span className="perfil-estudiante__punto"></span>
                    Estudiante
                  </span>

                  <span className="perfil-estudiante__badge perfil-estudiante__badge--miembro">
                    Miembro desde 2024
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="perfil-estudiante__boton-editar"
                onClick={() =>
                  mostrarMensaje('Próximamente podrás editar tu perfil.')
                }
              >
                Editar perfil
              </button>
            </article>

            {/* SEGURIDAD */}

            <article className="perfil-estudiante__seguridad">
              <h2>Seguridad</h2>

              <div className="perfil-estudiante__seguridad-contenido">
                <div>
                  <h3>Contraseña</h3>
                  <p>Última actualización hace 30 días</p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    mostrarMensaje('Próximamente podrás cambiar tu contraseña.')
                  }
                >
                  Cambiar contraseña
                </button>
              </div>
            </article>

          </section>

          {/* ESTADÍSTICAS */}

          <section className="perfil-estudiante__estadisticas">
            {estadisticas.map((estadistica) => (
              <article
                className="perfil-estudiante__estadistica"
                key={estadistica.id}
              >
                <strong>{estadistica.valor}</strong>
                <span>{estadistica.etiqueta}</span>
              </article>
            ))}
          </section>

          {/* INFORMACIÓN PERSONAL */}

          <section className="perfil-estudiante__informacion">
            <h2>Información personal</h2>

            <div className="perfil-estudiante__filas">
              {informacionPersonal.map((dato) => (
                <div
                  className="perfil-estudiante__fila"
                  key={dato.etiqueta}
                >
                  <span>{dato.etiqueta}</span>
                  <strong>{dato.valor}</strong>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
