
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './Favoritos.css';

function Favoritos({
  onNavegar,
  tutores = [],
  onToggleFavorito,
  onVerPerfilTutor,
  onSolicitarTutoria,
}) {
  const verPerfil = (tutor) => {
    onVerPerfilTutor?.(tutor);
  };

  const solicitarTutoria = (tutor) => {
    onSolicitarTutoria?.(tutor);
  };

  return (
    <div className="favoritos-layout">
      <Sidebar paginaActiva="Favoritos" onNavegar={onNavegar} />

      <div className="favoritos-contenido">
        <Navbar titulo="Favoritos" onNavegar={onNavegar} />

        <main className="favoritos-main">
          <section className="favoritos-encabezado">
            <div>
              <h1>Mis tutores favoritos</h1>
              <p>{tutores.length} tutores guardados</p>
            </div>

            <button
              type="button"
              className="favoritos-buscar"
              onClick={() => onNavegar?.('Buscar tutores')}
            >
              Buscar más tutores
            </button>
          </section>

          {tutores.length > 0 ? (
            <section className="favoritos-grid">
              {tutores.map((tutor) => (
                <article className="favorito-card" key={tutor.id}>
                  <div className="favorito-superior">
                    <div className="favorito-avatar">
                      {tutor.iniciales || 'NT'}
                    </div>

                    <div className="favorito-informacion">
                      <h2>{tutor.nombre}</h2>
                      <p>
                        {tutor.programaLabel || tutor.programa || tutor.especialidad || tutor.programaTutor || 'Programa académico'}
                      </p>

                      <div className="favorito-calificacion">
                        <span className="favorito-estrellas">
                          {tutor.calificacion == null ? '☆☆☆☆☆' : '★★★★★'}
                        </span>
                        <strong>
                          {tutor.calificacion == null
                            ? '—'
                            : Number(tutor.calificacion).toFixed(1)}
                        </strong>
                        <span>({tutor.opiniones ?? tutor.resenas ?? 0})</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="favorito-corazon"
                      aria-label="Quitar de favoritos"
                      title="Quitar de favoritos"
                      onClick={() => onToggleFavorito?.(tutor)}
                    >
                      ♥
                    </button>
                  </div>

                  <div className="favorito-materias">
                    {(tutor.materias || []).map((materia) => (
                      <span key={materia}>{materia}</span>
                    ))}
                  </div>

                  <div className="favorito-disponibilidad">
                    <span
                      className={`favorito-punto favorito-punto--${tutor.estado || (tutor.disponible ? 'disponible' : 'ocupado')}`}
                    />
                    <span>
                      {tutor.disponibilidad || (tutor.disponible ? 'Disponible hoy' : 'Disponibilidad por confirmar')}
                    </span>
                  </div>

                  <div className="favorito-acciones">
                    <button
                      type="button"
                      className="favorito-ver"
                      onClick={() => verPerfil(tutor)}
                    >
                      Ver perfil
                    </button>

                    <button
                      type="button"
                      className="favorito-solicitar"
                      onClick={() => solicitarTutoria(tutor)}
                    >
                      Solicitar
                    </button>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <div className="favoritos-vacio">
              <span>♡</span>
              <h2>Aún no tienes tutores favoritos</h2>
              <p>Busca tutores y guarda tus perfiles favoritos.</p>
              <button
                type="button"
                onClick={() => onNavegar?.('Buscar tutores')}
              >
                Buscar tutores
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Favoritos;
