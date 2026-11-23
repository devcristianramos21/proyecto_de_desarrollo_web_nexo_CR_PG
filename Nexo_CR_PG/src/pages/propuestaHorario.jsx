
import { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './propuestaHorario.css';

function PropuestaHorario({ onNavegar, solicitud, onConfirmar }) {
  const [estado, setEstado] = useState('Por confirmar');
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('principal');

  const datos = {
    materia: 'Cálculo diferencial',
    tema: 'Integrales',
    tutor: 'Nombre del tutor',
    horarioPrincipal: 'Jueves 19 Jun · 3:00 PM — 4:00 PM',
    horarioAlternativo: 'Viernes 20 Jun · 5:00 PM — 6:00 PM',
    modalidad: 'Virtual',
    notaTutor:
      'Hola, propongo el jueves a las 3 PM para nuestra sesión. Si no te queda bien, el viernes a las 5 PM también estoy disponible.',
    ...(solicitud || {}),
  };

  const volver = () => {
    onNavegar?.('Detalle solicitud');
  };

  // HORARIO ELEGIDO
  const horarioElegido =
    horarioSeleccionado === 'principal'
      ? datos.horarioPrincipal
      : datos.horarioAlternativo;

  // ACEPTAR HORARIO
  const aceptarHorario = () => {
    if (estado !== 'Por confirmar') return;

    setEstado('Aceptado');

    onConfirmar?.({
      solicitud: datos,
      horario: horarioElegido,
    });
  };

  // RECHAZAR HORARIO
  const rechazarHorario = () => {
    if (estado !== 'Por confirmar') return;

    setEstado('Rechazado');
  };

  // PROPONER OTRO HORARIO
  const proponerOtro = () => {
    alert('La opción para proponer otro horario estará disponible próximamente.');
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
        <Navbar titulo="Propuesta de horario" />

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
              <h2>Responde antes del 14 de junio</h2>
              <p>
                La propuesta vence en 2 horas. Acepta, rechaza o propón otro horario.
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
              disabled={estado !== 'Por confirmar'}
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
              disabled={estado !== 'Por confirmar'}
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
              disabled={estado !== 'Por confirmar'}
            >
              <span>✓</span>
              Aceptar horario
            </button>

            <button
              type="button"
              className="propuesta-horario__boton propuesta-horario__boton--rechazar"
              onClick={rechazarHorario}
              disabled={estado !== 'Por confirmar'}
            >
              Rechazar
            </button>

            <button
              type="button"
              className="propuesta-horario__boton propuesta-horario__boton--proponer"
              onClick={proponerOtro}
              disabled={estado !== 'Por confirmar'}
            >
              Proponer otro horario
            </button>

          </div>
        </main>
      </div>
    </div>
  );
}

export default PropuestaHorario;
