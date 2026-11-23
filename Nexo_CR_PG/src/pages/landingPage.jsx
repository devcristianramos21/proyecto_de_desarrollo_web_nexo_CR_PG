
import './landingPage.css';

function LandingPage({ onCrearCuenta, onIniciarSesion }) {
  const materias = [
    'Cálculo diferencial',
    'Programación',
    'Economía',
  ];

  const beneficios = [
    {
      titulo: 'Encuentra el apoyo que necesitas',
      descripcion:
        'Conecta con estudiantes-tutores según la materia, disponibilidad y modalidad que prefieras.',
    },
    {
      titulo: 'Coordina en un solo lugar',
      descripcion:
        'Gestiona solicitudes, horarios, mensajes y seguimiento sin salir de la plataforma.',
    },
    {
      titulo: 'Avanza con acompañamiento',
      descripcion:
        'Fortalece tus conocimientos con tutorías cercanas, seguras y pensadas para tu proceso académico.',
    },
  ];

  return (
    <div className="landing-page">

      {/* ENCABEZADO */}
      <header className="landing-header">
        <div className="landing-logo">
          <div className="landing-logo-icon">N</div>

          <div className="landing-logo-text">
            <strong>NEXO</strong>
            <span>UNIVERSIDAD DEL ROSARIO</span>
          </div>
        </div>

        <button
          type="button"
          className="landing-btn-login"
          onClick={onIniciarSesion}
        >
          Iniciar sesión
        </button>
      </header>

      {/* PORTADA PRINCIPAL */}
      <section className="landing-hero">

        <div className="landing-hero-text">

          <div className="landing-badge">
            <span></span>
            Comunidad de aprendizaje UR
          </div>

          <h1>
            Tu próximo logro
            <br />
            empieza con una
            <br />
            <span>buena conexión.</span>
          </h1>

          <p className="landing-descripcion">
            NEXO conecta a estudiantes de la Universidad del Rosario
            con tutores pares para aprender, compartir conocimiento
            y avanzar juntos.
          </p>

          <div className="landing-acciones">

            {/* CREAR CUENTA */}
            <button
              type="button"
              className="landing-btn-primary"
              onClick={onCrearCuenta}
            >
              Crear una cuenta
              <span>›</span>
            </button>

            {/* INICIAR SESIÓN */}
            <button
              type="button"
              className="landing-btn-secondary"
              onClick={onIniciarSesion}
            >
              Ya tengo una cuenta
            </button>

          </div>

          <p className="landing-nota">
            Acceso exclusivo para la comunidad Rosarista.
          </p>
        </div>

        {/* TARJETA DECORATIVA */}
        <div className="landing-hero-visual">
          <div className="landing-visual-back"></div>

          <div className="landing-visual-card">

            <div className="landing-visual-heading">
              <div>
                <span>TU ESPACIO NEXO</span>
                <h2>Aprender juntos transforma</h2>
              </div>

              <div className="landing-visual-icon">
                ♧
              </div>
            </div>

            <div className="landing-materias">
              {materias.map((materia, index) => (
                <div
                  className="landing-materia"
                  key={materia}
                >
                  <div className="landing-materia-numero">
                    {index + 1}
                  </div>

                  <div className="landing-materia-info">
                    <strong>{materia}</strong>
                    <span>Tutores disponibles esta semana</span>
                  </div>

                  <div className="landing-materia-punto"></div>
                </div>
              ))}
            </div>

            <div className="landing-visual-footer">
              <div className="landing-check">✓</div>

              <div>
                <strong>Encuentra tu tutor ideal</strong>
                <span>Simple, cercano y a tu ritmo</span>
              </div>
            </div>

          </div>
        </div>

        {/* ELEMENTOS DECORATIVOS */}
        <div className="landing-circulo landing-circulo-uno"></div>
        <div className="landing-circulo landing-circulo-dos"></div>

      </section>

      {/* BENEFICIOS */}
      <section className="landing-beneficios">

        <div className="landing-beneficios-encabezado">
          <span>TODO EN UN MISMO LUGAR</span>
          <h2>Una red creada para ayudarte a avanzar</h2>
        </div>

        <div className="landing-beneficios-grid">
          {beneficios.map((beneficio, index) => (
            <article
              className="landing-beneficio-card"
              key={beneficio.titulo}
            >
              <div className="landing-beneficio-icon">

                {index === 0 && (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="m16 16 5 5M10.5 7.5v6M7.5 10.5h6" />
                  </svg>
                )}

                {index === 1 && (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M7 3v4M17 3v4M3 10h18M8 14h2M14 14h2" />
                  </svg>
                )}

                {index === 2 && (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 20h18M5 16l5-5 4 3 7-8M15 6h6v6" />
                  </svg>
                )}

              </div>

              <h3>{beneficio.titulo}</h3>
              <p>{beneficio.descripcion}</p>
            </article>
          ))}
        </div>
      </section>

      {/* PIE DE PÁGINA */}
      <footer className="landing-footer">
        <strong>NEXO · Universidad del Rosario</strong>
        <span>Conecta, aprende, avanza.</span>
      </footer>

    </div>
  );
}

export default LandingPage;
