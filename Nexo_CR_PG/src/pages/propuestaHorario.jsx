
import { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './propuestaHorario.css';

function PropuestaHorario({
  onNavegar,
  solicitud,
  onConfirmar,
  onRechazar,
}) {
  const [estado, setEstado] = useState(
    solicitud?.estadoPropuesta === 'Aceptado' ||
      solicitud?.estadoPropuesta === 'Rechazado'
      ? solicitud.estadoPropuesta
      : 'Por confirmar'
  );
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('principal');
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');

  const datos = {
    materia: '',
    tema: '',
    tutor: '',
    horarioPrincipal: '',
    horarioAlternativo: '',
    modalidad: '',
    notaTutor: '',
    ...(solicitud || {}),
  };

  const volver = () => {
    onNavegar?.('Detalle solicitud');
  };

  // ACEPTAR HORARIO
  const aceptarHorario = async () => {
    if (estado !== 'Por confirmar') return;

    setProcesando(true);
    setError('');
    try {
      if (!onConfirmar) throw new Error('No se pudo enviar la respuesta al servidor.');
      await onConfirmar({
        solicitud: datos,
        horario: horarioSeleccionado,
      });
      setEstado('Aceptado');
    } catch (errorApi) {
      setError(errorApi.message || 'No se pudo confirmar el horario.');
    } finally {
      setProcesando(false);
    }
  };

  // RECHAZAR HORARIO
  const rechazarHorario = async () => {
    if (estado !== 'Por confirmar') return;

    setProcesando(true);
    setError('');
    try {
      if (!onRechazar) throw new Error('No se pudo enviar la respuesta al servidor.');
      await onRechazar(datos);
      setEstado('Rechazado');
    } catch (errorApi) {
      setError(errorApi.message || 'No se pudo rechazar la propuesta.');
    } finally {
      setProcesando(false);
    }
  };

  // SELECCIONAR HORARIO
  const seleccionarHorario = (horario) => {
    if (estado !== 'Por confirmar') return;

    setHorarioSeleccionado(horario);
  };

  return (
    <div className="propuesta-horario-layout">
      <Sidebar
        paginaActiva="Mis solicitudes"
        onNavegar={onNavegar}
      />

      <div className="propuesta-horario-contenido">
        <Navbar titulo="Propuesta de horario" onNavegar={onNavegar} />

        <main className="propuesta-horario-main">

          {/* BREADCRUMB */}
          <nav className="propuesta-horario__breadcrumb">
            <button type="button" onClick={volver}>
              Mis solicitudes
            </button>
            <span>/</span>
            <strong>Propuesta de horario</strong>
          </nav>

          {/* ENCABEZADO */}
          <header className="propuesta-horario__encabezado">
            <h1>Propuesta de horario</h1>
            <p>El tutor propuso estos horarios para tu tutoría</p>
          </header>

          {/* AVISO */}
          <section className="propuesta-horario__aviso">
            <span className="propuesta-horario__aviso-icono">⚠</span>
            <div>
              <h2>Propuesta pendiente</h2>
              <p>
                Revisa las opciones disponibles y confirma o rechaza la propuesta.
              </p>
            </div>
          </section>

          {/* TARJETA DE PROPUESTA */}
          <section className="propuesta-horario__tarjeta">

            <div className="propuesta-horario__tarjeta-encabezado">
              <div>
                <h2>{datos.materia} · {datos.tema}</h2>
                <p>Propuesta de {datos.tutor}</p>
              </div>

              <span
                className={`propuesta-horario__estado ${
                  estado === 'Aceptado'
                    ? 'propuesta-horario__estado--aceptado'
                    : estado === 'Rechazado'
                      ? 'propuesta-horario__estado--rechazado'
                      : ''
                }`}
              >
                {estado}
              </span>
            </div>

            {/* HORARIO PRINCIPAL */}
            <button
              type="button"
              className={`propuesta-horario__opcion ${
                horarioSeleccionado === 'principal'
                  ? 'propuesta-horario__opcion--seleccionada'
                  : ''
              }`}
              onClick={() => seleccionarHorario('principal')}
              disabled={estado !== 'Por confirmar' || procesando}
              aria-pressed={horarioSeleccionado === 'principal'}
            >
              <span className="propuesta-horario__opcion-info">
                <span className="propuesta-horario__calendario">▣</span>
                <span>{datos.horarioPrincipal}</span>
              </span>

              <span className="propuesta-horario__etiqueta">
                Horario principal
              </span>
            </button>

            {/* HORARIO ALTERNATIVO */}
            <button
              type="button"
              className={`propuesta-horario__opcion ${
                horarioSeleccionado === 'alternativo'
                  ? 'propuesta-horario__opcion--seleccionada'
                  : ''
              }`}
              onClick={() => seleccionarHorario('alternativo')}
              disabled={estado !== 'Por confirmar' || procesando}
              aria-pressed={horarioSeleccionado === 'alternativo'}
            >
              <span className="propuesta-horario__opcion-info">
                <span className="propuesta-horario__calendario">▣</span>
                <span>{datos.horarioAlternativo}</span>
              </span>

              <span className="propuesta-horario__etiqueta">
                Alternativo
              </span>
            </button>

          </section>

          {/* NOTA DEL TUTOR */}
          <section className="propuesta-horario__nota">
            <h2>NOTA DEL TUTOR</h2>
            <p>{datos.notaTutor}</p>
          </section>

          {/* ACCIONES */}
          <div className="propuesta-horario__acciones">

            <button
              type="button"
              className="propuesta-horario__boton propuesta-horario__boton--aceptar"
              onClick={aceptarHorario}
              disabled={estado !== 'Por confirmar' || procesando}
            >
              <span>✓</span>
              {procesando ? 'Guardando…' : 'Aceptar horario'}
            </button>

            <button
              type="button"
              className="propuesta-horario__boton propuesta-horario__boton--rechazar"
              onClick={rechazarHorario}
              disabled={estado !== 'Por confirmar' || procesando}
            >
              Rechazar
            </button>

            <button
              type="button"
              className="propuesta-horario__boton propuesta-horario__boton--proponer"
              disabled
              title="No hay un frame para proponer otro horario en la referencia Figma."
            >
              Proponer otro horario
            </button>

          </div>
          {error && <p role="alert">{error}</p>}
        </main>
      </div>
    </div>
  );
}

export default PropuestaHorario;
