import './detalleMonitoria.css';

const temas = [
  'Espacios vectoriales',
  'Transformaciones lineales',
  'Valores propios',
  'Sistemas de ecuaciones',
];

function DetalleMonitoria({ onVolver, onInscribirse }) {
  return (
    <div className="detalle-layout">
      <aside className="detalle-sidebar">
        <div className="detalle-brand">
          <div className="detalle-logo" aria-hidden="true">N</div>
          <div className="detalle-brand-text">
            <strong>NEXO</strong>
            <small>Plataforma monitorías</small>
          </div>
        </div>

        <nav className="detalle-menu" aria-label="Navegación de estudiante">
          <p className="detalle-sidebar-titulo">ESTUDIANTE</p>
          {[
            'Inicio',
            'Buscar tutores',
            'Monitorias',
            'Calendario',
            'Mis solicitudes',
            'Mis tutorías',
            'Mensajes',
            'Favoritos',
            'Mi perfil',
          ].map((item) => (
            <button
              key={item}
              className={
                item === 'Monitorias'
                  ? 'detalle-menu-item activo'
                  : 'detalle-menu-item'
              }
              type="button"
              aria-current={item === 'Monitorias' ? 'page' : undefined}
            >
              <span className="detalle-menu-icon" aria-hidden="true" />
              <span>{item}</span>
              {item === 'Mis solicitudes' && (
                <span className="detalle-badge">1</span>
              )}
            </button>
          ))}
        </nav>

        <div className="detalle-sidebar-footer">
          <button type="button">
            <span className="detalle-menu-icon" aria-hidden="true" />
            <span>Notificaciones</span>
            <span className="detalle-badge">3</span>
          </button>
          <button type="button">
            <span className="detalle-menu-icon" aria-hidden="true" />
            <span>Soporte</span>
          </button>
          <button className="detalle-cerrar-sesion" type="button">
            <span className="detalle-menu-icon" aria-hidden="true" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <div className="detalle-contenido">
        <header className="detalle-navbar">
          <div className="detalle-navbar-titulo">
            <button
              className="detalle-volver"
              type="button"
              onClick={onVolver}
              aria-label="Volver"
            >
              ←
            </button>
            <strong>Detalle monitoría</strong>
          </div>

          <div className="detalle-navbar-usuario">
            <span className="detalle-rol">Estudiante</span>
            <span className="detalle-notificaciones" aria-hidden="true">
              <span className="detalle-campana" aria-hidden="true" />
              <span className="detalle-notificacion-punto" />
            </span>
            <span className="detalle-avatar-usuario">NE</span>
          </div>
        </header>

        <main className="detalle-main">
          <div className="detalle-migas">
            <span>Monitorías</span>
            <span>/</span>
            <strong>Pre-parcial Álgebra Lineal</strong>
          </div>

          <section className="detalle-encabezado">
            <div className="detalle-encabezado-info">
              <div className="detalle-titulo-fila">
                <h1>Pre-parcial Álgebra Lineal</h1>
                <span className="detalle-tipo">Pre-parcial</span>
                <span className="detalle-estado">Disponible</span>
              </div>
              <p>Dom 21 Sep 2026 · 10:00 AM – 12:00 PM · Presencial</p>
            </div>

            <button
              className="detalle-boton-inscribir"
              type="button"
              onClick={onInscribirse}
            >
              Inscribirse
            </button>
          </section>

          <section className="detalle-aviso">
            <span className="detalle-aviso-icono" aria-hidden="true">i</span>
            <div>
              <strong>Preparación para parcial</strong>
              <p>
                Esta monitoría es la sesión de repaso antes del{' '}
                <b>
                  Parcial de Álgebra Lineal — Martes 24 Sep a las 10:00 AM
                </b>
              </p>
            </div>
          </section>

          <div className="detalle-columnas">
            <div className="detalle-columna-izquierda">
              <section className="detalle-card detalle-descripcion">
                <h2>Sobre esta monitoría</h2>
                <p>
                  Sesión de repaso intensivo. Se cubrirán: espacios vectoriales,
                  transformaciones lineales, valores y vectores propios,
                  sistemas de ecuaciones.
                </p>
                <div className="detalle-temas" aria-label="Temas de la sesión">
                  {temas.map((tema) => (
                    <span className="detalle-tema" key={tema}>{tema}</span>
                  ))}
                </div>
              </section>

              <section className="detalle-card detalle-monitor">
                <h2>Monitor</h2>
                <div className="detalle-monitor-info">
                  <div className="detalle-avatar">FC</div>
                  <div className="detalle-monitor-datos">
                    <strong>Felipe Castro</strong>
                    <p>Matemáticas · 10° semestre</p>
                    <div className="detalle-puntuacion">
                      <span className="detalle-estrellas">★★★★★</span>
                      <b>4.8</b>
                    </div>
                  </div>
                  <button type="button">Ver perfil</button>
                </div>
              </section>
            </div>

            <div className="detalle-columna-derecha">
              <section className="detalle-card detalle-datos">
                <div><span>Tipo</span><strong>Pre-parcial</strong></div>
                <div><span>Fecha</span><strong>Dom 21 Sep 2026</strong></div>
                <div><span>Hora</span><strong>10:00 AM – 12:00 PM</strong></div>
                <div><span>Modalidad</span><strong>Presencial</strong></div>
                <div><span>Lugar</span><strong>Edificio G, Sala 2</strong></div>
              </section>

              <section className="detalle-card detalle-inscripciones">
                <h2>Inscripciones</h2>
                <strong className="detalle-cantidad">14 / 20</strong>

                <div className="detalle-progreso">
                  <span />
                </div>

                <p>✓ Monitoría confirmada (superó umbral de 10)</p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DetalleMonitoria;
