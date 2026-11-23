
import { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './evaluarTutoria.css';

const criteriosIniciales = [
  { id: 1, nombre: 'Claridad en la explicación', valor: 0 },
  { id: 2, nombre: 'Puntualidad', valor: 0 },
  { id: 3, nombre: 'Dominio del tema', valor: 0 },
  { id: 4, nombre: 'Paciencia y disposición', valor: 0 },
];

function EvaluarTutoria({ onNavegar, tutoria, onEnviarEvaluacion }) {
  const [calificacionGeneral, setCalificacionGeneral] = useState(0);
  const [criterios, setCriterios] = useState(criteriosIniciales);
  const [comentario, setComentario] = useState('');
  const [recomendacion, setRecomendacion] = useState(null);

  const datos = {
    tutor: 'Andrés Moreno',
    materia: 'Cálculo Diferencial',
    tema: 'Integrales definidas',
    fecha: 'Mar 10 Sep 2026',
    hora: '10:00 AM – 11:00 AM',
    modalidad: 'Virtual',
    ...(tutoria || {}),
  };

  // ACTUALIZAR CALIFICACIÓN DE UN CRITERIO
  const actualizarCriterio = (id, valor) => {
    setCriterios((actuales) =>
      actuales.map((criterio) =>
        criterio.id === id
          ? { ...criterio, valor }
          : criterio
      )
    );
  };

  // TEXTO SEGÚN CALIFICACIÓN
  const obtenerCalificacion = (valor) => {
    if (valor === 5) return 'Excelente';
    if (valor === 4) return 'Bueno';
    if (valor === 3) return 'Regular';
    if (valor === 2) return 'Malo';
    if (valor === 1) return 'Muy malo';

    return 'Selecciona una calificación';
  };

  // ENVIAR EVALUACIÓN
  const enviarEvaluacion = () => {
    if (!datos.id) {
      alert('No se encontró el identificador de la tutoría.');
      return;
    }

    if (calificacionGeneral === 0) {
      alert('Por favor selecciona una calificación general.');
      return;
    }

    const criteriosCompletos = criterios.every(
      (criterio) => criterio.valor > 0
    );

    if (!criteriosCompletos) {
      alert('Por favor califica todos los criterios específicos.');
      return;
    }

    if (recomendacion === null) {
      alert('Por favor indica si recomendarías a este tutor.');
      return;
    }

    if (!onEnviarEvaluacion) {
      alert('No se pudo enviar la evaluación. Inténtalo nuevamente.');
      return;
    }

    const evaluacion = {
      tutor: datos.tutor,
      calificacionGeneral,
      criterios: criterios.map((criterio) => ({ ...criterio })),
      comentario,
      recomendacion,
    };

    // App.jsx registra la evaluación y abre la pantalla de confirmación.
    onEnviarEvaluacion(datos.id, evaluacion);
  };

  // COMPONENTE DE ESTRELLAS
  const renderEstrellas = (valor, actualizar, nombre) => (
    <div className="evaluar-estrellas" aria-label={nombre}>
      {[1, 2, 3, 4, 5].map((estrella) => (
        <button
          key={estrella}
          type="button"
          className={`evaluar-estrella ${
            estrella <= valor ? 'seleccionada' : ''
          }`}
          onClick={() => actualizar(estrella)}
          aria-label={`${estrella} de 5 estrellas`}
          aria-pressed={valor === estrella}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="evaluar-tutoria-layout">
      <Sidebar
        paginaActiva="Mis monitorias"
        onNavegar={onNavegar}
      />

      <main className="evaluar-tutoria-contenido">
        <Navbar titulo="Evaluar tutor" onNavegar={onNavegar} />

        <div className="evaluar-tutoria-principal">

          {/* BREADCRUMB */}
          <div className="evaluar-migas">
            <button
              type="button"
              onClick={() => onNavegar('Mis monitorias')}
            >
              Mis tutorías
            </button>

            <span>/</span>
            <span>Evaluar tutor</span>
          </div>

          {/* ENCABEZADO */}
          <header className="evaluar-encabezado">
            <h1>Evaluar tutoría</h1>
            <p>
              Tu opinión es valiosa para mejorar la calidad académica
            </p>
          </header>

          <div className="evaluar-columnas">

            {/* COLUMNA IZQUIERDA */}
            <div className="evaluar-columna-izquierda">

              {/* RESUMEN DEL TUTOR */}
              <section className="evaluar-card evaluar-tutor-resumen">
                <div className="evaluar-avatar">
                  {datos.tutor
                    .split(' ')
                    .map((palabra) => palabra[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>

                <div className="evaluar-tutor-datos">
                  <h2>{datos.tutor}</h2>

                  <p>
                    {datos.materia} · {datos.tema}
                  </p>

                  <span>
                    {datos.fecha} · {datos.hora} · {datos.modalidad}
                  </span>
                </div>
              </section>

              {/* CALIFICACIONES */}
              <section className="evaluar-card evaluar-calificaciones">

                <div className="evaluar-general">
                  <h3>Calificación general</h3>

                  {renderEstrellas(
                    calificacionGeneral,
                    setCalificacionGeneral,
                    'Calificación general'
                  )}

                  <p>
                    {obtenerCalificacion(calificacionGeneral)}
                  </p>
                </div>

                <div className="evaluar-especificas">
                  <h3>Calificaciones específicas</h3>

                  {criterios.map((criterio) => (
                    <div
                      className="evaluar-criterio"
                      key={criterio.id}
                    >
                      <span>{criterio.nombre}</span>

                      {renderEstrellas(
                        criterio.valor,
                        (valor) =>
                          actualizarCriterio(criterio.id, valor),
                        criterio.nombre
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* COLUMNA DERECHA */}
            <div className="evaluar-columna-derecha">

              {/* COMENTARIO */}
              <section className="evaluar-comentario">
                <label htmlFor="comentario-tutor">
                  Comentario (opcional)
                </label>

                <textarea
                  id="comentario-tutor"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Comparte tu experiencia con este tutor..."
                />

                <p>
                  Tu comentario será visible en el perfil público del tutor.
                </p>
              </section>

              {/* RECOMENDACIÓN */}
              <section className="evaluar-card evaluar-recomendacion">
                <h3>¿Recomendarías a este tutor?</h3>

                <div className="evaluar-recomendacion-opciones">
                  <button
                    type="button"
                    className={`evaluar-opcion ${
                      recomendacion === true ? 'opcion-si-activa' : ''
                    }`}
                    onClick={() => setRecomendacion(true)}
                    aria-pressed={recomendacion === true}
                  >
                    👍 Sí
                  </button>

                  <button
                    type="button"
                    className={`evaluar-opcion ${
                      recomendacion === false ? 'opcion-no-activa' : ''
                    }`}
                    onClick={() => setRecomendacion(false)}
                    aria-pressed={recomendacion === false}
                  >
                    👎 No
                  </button>
                </div>
              </section>
            </div>
          </div>

          {/* ACCIONES */}
          <div className="evaluar-acciones">
            <button
              type="button"
              className="evaluar-cancelar"
              onClick={() => onNavegar('Mis monitorias')}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="evaluar-enviar"
              onClick={enviarEvaluacion}
            >
              Enviar evaluación
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default EvaluarTutoria;
