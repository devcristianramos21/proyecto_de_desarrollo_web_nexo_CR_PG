import { useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './miDisponibilidadTutor.css';

const dias = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

function formatearHora(hora) {
  const [horasTexto, minutos] = hora.split(':');
  const horas = Number(horasTexto);
  const sufijo = horas >= 12 ? 'PM' : 'AM';
  const hora12 = horas % 12 || 12;

  return `${hora12}:${minutos} ${sufijo}`;
}

function MiDisponibilidadTutor({
  onNavegar,
  disponibilidad = [],
  cargando = false,
  errorApi = '',
  onGuardarHorario,
  onEliminarHorario,
}) {
  const [formularioVisible, setFormularioVisible] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [formulario, setFormulario] = useState({
    dia: 'Lunes',
    inicio: '09:00',
    fin: '10:00',
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [idEliminando, setIdEliminando] = useState(null);

  const abrirNuevo = () => {
    setIdEditando(null);
    setFormulario({ dia: 'Lunes', inicio: '09:00', fin: '10:00' });
    setError('');
    setFormularioVisible(true);
  };

  const abrirEdicion = (horario) => {
    setIdEditando(horario.id);
    setFormulario({
      dia: horario.dia,
      inicio: horario.inicio,
      fin: horario.fin,
    });
    setError('');
    setFormularioVisible(true);
  };

  const guardarHorario = async (evento) => {
    evento.preventDefault();
    const inicioMinutos = Number(formulario.inicio.slice(0, 2)) * 60
      + Number(formulario.inicio.slice(3, 5));
    const finMinutos = Number(formulario.fin.slice(0, 2)) * 60
      + Number(formulario.fin.slice(3, 5));

    if (finMinutos - inicioMinutos < 60) {
      setError('Define un rango de al menos 1 hora.');
      return;
    }

    setError('');
    setGuardando(true);
    try {
      if (!onGuardarHorario) throw new Error('No se pudo guardar la disponibilidad.');
      await onGuardarHorario({
        id: idEditando,
        dia: formulario.dia,
        inicio: formulario.inicio,
        fin: formulario.fin,
      });
      setFormularioVisible(false);
      setIdEditando(null);
    } catch (errorGuardado) {
      setError(errorGuardado.message || 'No se pudo guardar la disponibilidad.');
    } finally {
      setGuardando(false);
    }
  };

  const volverAConfiguracion = () => onNavegar?.('Mi perfil');

  const guardarDisponibilidad = () => {
    onNavegar?.('Mi perfil');
  };

  const eliminarHorario = async (id) => {
    setError('');
    setIdEliminando(id);
    try {
      if (!onEliminarHorario) throw new Error('No se pudo eliminar la disponibilidad.');
      await onEliminarHorario(id);
    } catch (errorEliminacion) {
      setError(errorEliminacion.message || 'No se pudo eliminar la disponibilidad.');
    } finally {
      setIdEliminando(null);
    }
  };

  return (
    <div className="disponibilidad-tutor-layout">
      <Sidebar paginaActiva="Mi disponibilidad" onNavegar={onNavegar} />

      <div className="disponibilidad-tutor-contenido">
        <Navbar titulo="Mi disponibilidad" onNavegar={onNavegar} />

        <main className="disponibilidad-tutor-main">
          <header className="disponibilidad-tutor__encabezado">
            <h1>Mi disponibilidad</h1>
            <p>Define los horarios en los que puedes dar tutorías</p>
          </header>

          <section className="disponibilidad-tutor__tarjeta">
            {errorApi && <p className="disponibilidad-tutor__error" role="alert">{errorApi}</p>}
            {error && <p className="disponibilidad-tutor__error" role="alert">{error}</p>}
            <div className="disponibilidad-tutor__tarjeta-cabecera">
              <h2>Horarios registrados</h2>
              {!formularioVisible && (
                <button
                  type="button"
                  className="disponibilidad-tutor__boton disponibilidad-tutor__boton--agregar"
                  onClick={abrirNuevo}
                >
                  <span aria-hidden="true">+</span>
                  Agregar
                </button>
              )}
            </div>

            <div className="disponibilidad-tutor__lista">
              {cargando ? (
                <p role="status">Cargando disponibilidad…</p>
              ) : disponibilidad.map((horario) => (
                <div className="disponibilidad-tutor__fila" key={horario.id}>
                  <div className="disponibilidad-tutor__detalle">
                    <span className="disponibilidad-tutor__punto" />
                    <strong>{horario.dia}</strong>
                    <span>
                      {formatearHora(horario.inicio)} — {formatearHora(horario.fin)}
                    </span>
                  </div>
                  <div className="disponibilidad-tutor__acciones-fila">
                    <button
                      type="button"
                      className="disponibilidad-tutor__accion"
                      onClick={() => abrirEdicion(horario)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="disponibilidad-tutor__accion disponibilidad-tutor__accion--eliminar"
                      onClick={() => eliminarHorario(horario.id)}
                      disabled={idEliminando === horario.id}
                    >
                      {idEliminando === horario.id ? 'Eliminando…' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              ))}
              {!cargando && disponibilidad.length === 0 && (
                <p>No tienes horarios de disponibilidad registrados.</p>
              )}
            </div>

            {formularioVisible && (
              <form className="disponibilidad-tutor__formulario" onSubmit={guardarHorario}>
                <div className="disponibilidad-tutor__campos">
                  <label>
                    Día
                    <select
                      value={formulario.dia}
                      onChange={(evento) =>
                        setFormulario((actual) => ({
                          ...actual,
                          dia: evento.target.value,
                        }))
                      }
                      required
                    >
                      {dias.map((dia) => (
                        <option key={dia} value={dia}>{dia}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Hora inicio
                    <input
                      type="time"
                      value={formulario.inicio}
                      onChange={(evento) => {
                        setFormulario((actual) => ({
                          ...actual,
                          inicio: evento.target.value,
                        }));
                        setError('');
                      }}
                      required
                    />
                  </label>

                  <label>
                    Hora fin
                    <input
                      type="time"
                      value={formulario.fin}
                      onChange={(evento) => {
                        setFormulario((actual) => ({
                          ...actual,
                          fin: evento.target.value,
                        }));
                        setError('');
                      }}
                      required
                    />
                  </label>
                </div>

                <div className="disponibilidad-tutor__acciones-formulario">
                  <button
                    type="button"
                    className="disponibilidad-tutor__boton disponibilidad-tutor__boton--texto"
                    onClick={() => {
                      setFormularioVisible(false);
                      setIdEditando(null);
                      setError('');
                    }}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="disponibilidad-tutor__boton disponibilidad-tutor__boton--guardar"
                    disabled={guardando}
                  >
                    {guardando ? 'Guardando…' : 'Guardar'}
                  </button>
                </div>
              </form>
            )}
          </section>

          <aside className="disponibilidad-tutor__consejo">
            <strong>Consejo:</strong> Define rangos de al menos 1 hora para que los estudiantes puedan solicitar sesiones completas.
          </aside>

          <div className="disponibilidad-tutor__acciones-pagina">
            <button
              type="button"
              className="disponibilidad-tutor__boton disponibilidad-tutor__boton--texto"
              onClick={volverAConfiguracion}
            >
              Volver a configuración
            </button>
            <button
              type="button"
              className="disponibilidad-tutor__boton disponibilidad-tutor__boton--guardar"
              onClick={guardarDisponibilidad}
            >
              Guardar disponibilidad
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MiDisponibilidadTutor;
