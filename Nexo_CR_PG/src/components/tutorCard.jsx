import './TutorCard.css';

export default function TutorCard({
  nombre,
  iniciales,
  especialidad,
  semestre,
  calificacion,
  resenas,
  materias,
  disponible,
  favorito,
  onToggleFavorito,
  onVerPerfil,
  onSolicitar,
}) {
  return (
    <article className="tutor-card">
      <div className="tutor-card__encabezado">
        <div className="tutor-card__avatar" aria-hidden="true">
          {iniciales}
        </div>

        <div className="tutor-card__identidad">
          <h3 className="tutor-card__nombre">{nombre}</h3>

          <p className="tutor-card__especialidad">
            {especialidad} · {semestre} semestre
          </p>
        </div>

        <button
          type="button"
          className={`tutor-card__favorito ${
            favorito ? 'tutor-card__favorito--activo' : ''
          }`}
          onClick={onToggleFavorito}
          aria-label={
            favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'
          }
          aria-pressed={favorito}
        >
          {favorito ? '♥' : '♡'}
        </button>
      </div>

      <div className="tutor-card__calificacion">
        <span aria-hidden="true">★★★★★</span>
        <strong>{calificacion.toFixed(1)}</strong>
        <span className="tutor-card__resenas">({resenas})</span>
      </div>

      <div className="tutor-card__materias">
        {materias.map((materia) => (
          <span className="tutor-card__etiqueta" key={materia}>
            {materia}
          </span>
        ))}
      </div>

      <p className="tutor-card__disponibilidad">
        <span
          className={`tutor-card__indicador ${
            disponible ? 'tutor-card__indicador--disponible' : ''
          }`}
          aria-hidden="true"
        />

        {disponible ? 'Disponible hoy' : 'No disponible hoy'}
      </p>

      <div className="tutor-card__acciones">
        <button
          type="button"
          className="tutor-card__boton tutor-card__boton--secundario"
          onClick={onVerPerfil}
        >
          Ver perfil
        </button>

        <button
          type="button"
          className="tutor-card__boton tutor-card__boton--principal"
          onClick={onSolicitar}
          disabled={!disponible}
        >
          Solicitar
        </button>
      </div>
    </article>
  );
}