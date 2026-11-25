import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import {
  listarMonitoriasDisponibles,
  obtenerCalendario,
} from '../services/modulosIntegrados';
import './calendario.css';

function fechaLocal(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function leerFecha(fecha) {
  const resultado = new Date(`${String(fecha).slice(0, 10)}T12:00:00`);
  return Number.isNaN(resultado.getTime()) ? null : resultado;
}

function idDe(valor) {
  return String(valor?._id ?? valor?.id ?? valor ?? '');
}

function diaDe(fecha) {
  return fecha
    ? new Intl.DateTimeFormat('es-CO', { weekday: 'short' })
        .format(fecha)
        .replace('.', '')
        .toUpperCase()
    : '';
}

function mesCorto(fecha) {
  return new Intl.DateTimeFormat('es-CO', { month: 'short' })
    .format(fecha)
    .replace('.', '')
    .toUpperCase();
}

function numeroSemana(fecha) {
  const utc = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  const dia = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - dia);
  const inicioAnio = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  return Math.ceil(((utc - inicioAnio) / 86400000 + 1) / 7);
}

function inicioSemana(fecha) {
  const inicio = new Date(fecha);
  const dia = inicio.getDay() || 7;
  inicio.setDate(inicio.getDate() - dia + 1);
  inicio.setHours(0, 0, 0, 0);
  return inicio;
}

function etiquetaSemana(fecha) {
  const inicio = inicioSemana(fecha);
  const fin = new Date(inicio);
  fin.setDate(inicio.getDate() + 4);
  return `SEMANA ${numeroSemana(fecha)} (${inicio.getDate()}-${fin.getDate()} ${mesCorto(fin)})`;
}

function obtenerPeriodo(fecha, hoy) {
  const diferencia = Math.floor(
    (inicioSemana(fecha) - inicioSemana(hoy)) / 86400000
  );
  if (diferencia === 0) return 'Esta semana';
  if (diferencia === 7) return 'Próxima semana';
  return `Semana ${numeroSemana(fecha)}`;
}

function textoFecha(fecha, hora) {
  const dia = new Intl.DateTimeFormat('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(fecha).replace('.', '');
  return `${dia}${hora ? ` · ${hora}` : ''}`;
}

function obtenerHoraMonitoria(monitoria) {
  if (!monitoria.horaInicio || !monitoria.horaFin) return '';
  return `${monitoria.horaInicio} — ${monitoria.horaFin}`;
}

function Calendario({ onNavegar, onVerMonitoria, onInscribirMonitoria }) {
  const [parciales, setParciales] = useState([]);
  const [monitoriasUsuario, setMonitoriasUsuario] = useState([]);
  const [monitoriasDisponibles, setMonitoriasDisponibles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [inscribiendo, setInscribiendo] = useState('');

  useEffect(() => {
    let vigente = true;
    const hoy = new Date();
    const desde = fechaLocal(hoy);
    const hastaFecha = new Date(hoy);
    hastaFecha.setDate(hastaFecha.getDate() + 90);
    const hasta = fechaLocal(hastaFecha);

    Promise.all([
      obtenerCalendario(desde, hasta),
      listarMonitoriasDisponibles({ tipo: 'preparcial' }),
    ])
      .then(([calendario, disponibles]) => {
        if (!vigente) return;
        setParciales(calendario.parciales);
        setMonitoriasUsuario(calendario.monitorias);
        setMonitoriasDisponibles(disponibles);
        setError('');
      })
      .catch((err) => {
        if (vigente) setError(err.message);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, []);

  const hoy = useMemo(() => new Date(), []);
  const parcialesConMonitorias = useMemo(
    () =>
      parciales
        .map((parcial) => {
          const grupos = monitoriasDisponibles.filter(
            (monitoria) => idDe(monitoria.parcial) === idDe(parcial._id)
          );
          return { ...parcial, grupos };
        })
        .filter((parcial) => leerFecha(parcial.fecha))
        .sort((a, b) => a.fecha.localeCompare(b.fecha)),
    [parciales, monitoriasDisponibles]
  );

  const parcialesProximosSieteDias = parcialesConMonitorias.filter((parcial) => {
    const fecha = leerFecha(parcial.fecha);
    const diferencia = (fecha - new Date(fechaLocal(hoy) + 'T00:00:00')) / 86400000;
    return diferencia >= 0 && diferencia < 7;
  });
  const parcialesEstaSemana = parcialesConMonitorias.filter(
    (parcial) => inicioSemana(leerFecha(parcial.fecha)).getTime() === inicioSemana(hoy).getTime()
  );
  const parcialesProximaSemana = parcialesConMonitorias.filter(
    (parcial) => {
      const inicioProxima = inicioSemana(hoy);
      inicioProxima.setDate(inicioProxima.getDate() + 7);
      return inicioSemana(leerFecha(parcial.fecha)).getTime() === inicioProxima.getTime();
    }
  );
  const parcialesConApoyo = parcialesConMonitorias.filter((parcial) => parcial.grupos.length);

  const eventos = useMemo(() => {
    const eventosParciales = parcialesConMonitorias.map((parcial) => ({
      clave: `parcial-${idDe(parcial._id)}`,
      tipoEvento: 'parcial',
      fecha: parcial.fecha,
      materia: parcial.materia,
      nombre: parcial.nombre,
      hora: parcial.hora,
      grupos: parcial.grupos,
    }));
    const eventosMonitorias = monitoriasUsuario
      .filter((monitoria) => leerFecha(monitoria.fecha))
      .map((monitoria) => ({
        clave: `monitoria-${idDe(monitoria._id)}`,
        tipoEvento: 'monitoria',
        fecha: monitoria.fecha,
        materia: monitoria.materia,
        nombre: monitoria.tipo === 'preparcial'
          ? 'Monitoría pre-parcial'
          : 'Monitoría',
        hora: obtenerHoraMonitoria(monitoria),
        monitoria,
      }));

    return [...eventosParciales, ...eventosMonitorias].sort(
      (a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora)
    );
  }, [parcialesConMonitorias, monitoriasUsuario]);

  const semanas = useMemo(() => {
    const grupos = new Map();
    eventos.forEach((evento) => {
      const fecha = leerFecha(evento.fecha);
      const clave = fechaLocal(inicioSemana(fecha));
      if (!grupos.has(clave)) {
        grupos.set(clave, { etiqueta: etiquetaSemana(fecha), eventos: [] });
      }
      grupos.get(clave).eventos.push(evento);
    });
    return [...grupos.values()];
  }, [eventos]);

  const inscribir = async (monitoria) => {
    const id = idDe(monitoria._id);
    if (!id || !onInscribirMonitoria || inscribiendo) return;

    setInscribiendo(id);
    setError('');
    try {
      const actualizada = await onInscribirMonitoria(id);
      if (!actualizada) return;
      setMonitoriasDisponibles((actuales) =>
        actuales.map((item) =>
          idDe(item._id) === id ? actualizada : item
        )
      );
      setMonitoriasUsuario((actuales) => [
        ...actuales.filter((item) => idDe(item._id) !== id),
        actualizada,
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setInscribiendo('');
    }
  };

  const renderParcial = (evento) => {
    const fecha = leerFecha(evento.fecha);
    const diasHasta = Math.floor(
      (fecha - new Date(fechaLocal(hoy) + 'T00:00:00')) / 86400000
    );
    const color = evento.grupos.length
      ? 'verde'
      : diasHasta <= 7
        ? 'rojo'
        : 'naranja';
    const estado = evento.grupos.length
      ? 'Monitoría disponible'
      : 'Sin monitoría';

    return (
      <article
        className={`calendario__parcial calendario__parcial--${color}`}
        key={evento.clave}
      >
        <div className={`calendario__fecha calendario__fecha--${color}`}>
          <span>{diaDe(fecha)}</span>
          <strong>{fecha.getDate()}</strong>
        </div>

        <div className="calendario__detalle">
          <div className="calendario__materia-fila">
            <h3>{evento.materia}</h3>
            <span className={`calendario__periodo calendario__periodo--${color}`}>
              {obtenerPeriodo(fecha, hoy)}
            </span>
          </div>
          <p>
            {evento.nombre} · {textoFecha(fecha, evento.hora)}
          </p>
        </div>

        <div className="calendario__acciones">
          <span className={`calendario__estado calendario__estado--${evento.grupos.length ? 'con-monitoria' : 'sin-monitoria'}`}>
            {evento.grupos.length > 0 && <span className="calendario__punto-verde" />}
            {estado}
          </span>

          {evento.grupos.length ? (
            evento.grupos.map((monitoria) => {
              const monitoriaId = idDe(monitoria._id);
              const inscrita = monitoria.inscrito;
              const sinCupos = monitoria.cuposDisponibles < 1;
              return (
                <button
                  type="button"
                  className="calendario__boton calendario__boton--principal"
                  key={monitoriaId}
                  title={`Monitoría ${monitoria.grupo || monitoria.tutor?.nombre || ''}`}
                  aria-label={`Inscribirse en la monitoría pre-parcial de ${evento.materia}`}
                  disabled={inscrita || sinCupos || inscribiendo === monitoriaId}
                  onClick={() => inscribir(monitoria)}
                >
                  {inscribiendo === monitoriaId
                    ? 'Inscribiendo…'
                    : inscrita
                      ? 'Inscrito'
                      : sinCupos
                        ? 'Sin cupos'
                        : 'Inscribirse'}
                </button>
              );
            })
          ) : (
            <button
              type="button"
              className="calendario__boton calendario__boton--secundario"
              onClick={() => onNavegar?.('Buscar tutores')}
            >
              Buscar tutor
            </button>
          )}
        </div>
      </article>
    );
  };

  const renderMonitoria = (evento) => {
    const fecha = leerFecha(evento.fecha);
    const nombreTutor = evento.monitoria.tutor?.nombre;

    return (
      <article
        className="calendario__parcial calendario__parcial--verde"
        key={evento.clave}
      >
        <div className="calendario__fecha calendario__fecha--verde">
          <span>{diaDe(fecha)}</span>
          <strong>{fecha.getDate()}</strong>
        </div>
        <div className="calendario__detalle">
          <div className="calendario__materia-fila">
            <h3>{evento.materia}</h3>
            <span className="calendario__periodo calendario__periodo--verde">
              {evento.nombre}
            </span>
          </div>
          <p>
            {textoFecha(fecha, evento.hora)}
            {nombreTutor ? ` · ${nombreTutor}` : ''}
          </p>
        </div>
        <div className="calendario__acciones">
          <span className="calendario__estado calendario__estado--con-monitoria">
            <span className="calendario__punto-verde" />
            Programada
          </span>
          <button
            type="button"
            className="calendario__boton calendario__boton--secundario"
            onClick={() => onVerMonitoria?.(evento.monitoria)}
          >
            Ver monitoría
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="calendario-layout">
      <Sidebar paginaActiva="Calendario" onNavegar={onNavegar} />

      <div className="calendario-contenido">
        <Navbar titulo="Calendario académico" onNavegar={onNavegar} />

        <main className="calendario-main">
          <header className="calendario__encabezado">
            <h1>Calendario académico</h1>
            <p>Parciales y monitorías — Universidad del Rosario</p>
          </header>

          {error && (
            <p className="calendario__error" role="alert">
              {error}
            </p>
          )}

          {!cargando && parcialesProximosSieteDias.length > 0 && (
            <section className="calendario__alerta">
              <span className="calendario__alerta-icono">⚠</span>
              <div>
                <h2>
                  {parcialesProximosSieteDias.length} parcial
                  {parcialesProximosSieteDias.length === 1 ? '' : 'es'} en los
                  próximos 7 días
                </h2>
                <p>
                  {parcialesProximosSieteDias
                    .map((parcial) => parcial.materia)
                    .join(', ')}
                  . Revisa las monitorías de apoyo disponibles.
                </p>
              </div>
            </section>
          )}

          <section className="calendario__resumen">
            <article className="calendario__resumen-card">
              <strong className="resumen-rojo">
                {cargando ? '—' : parcialesEstaSemana.length}
              </strong>
              <span>Esta semana</span>
            </article>
            <article className="calendario__resumen-card">
              <strong className="resumen-naranja">
                {cargando ? '—' : parcialesProximaSemana.length}
              </strong>
              <span>Próxima semana</span>
            </article>
            <article className="calendario__resumen-card">
              <strong className="resumen-verde">
                {cargando ? '—' : parcialesConApoyo.length}
              </strong>
              <span>Con monitoría</span>
            </article>
            <article className="calendario__resumen-card">
              <strong className="resumen-gris">
                {cargando ? '—' : parcialesConMonitorias.length - parcialesConApoyo.length}
              </strong>
              <span>Sin monitoría</span>
            </article>
          </section>

          {cargando ? (
            <p className="calendario__estado-vacio" role="status">
              Cargando calendario…
            </p>
          ) : semanas.length ? (
            semanas.map((semana) => (
              <section className="calendario__semana" key={semana.etiqueta}>
                <h2>{semana.etiqueta}</h2>
                <div className="calendario__lista">
                  {semana.eventos.map((evento) =>
                    evento.tipoEvento === 'parcial'
                      ? renderParcial(evento)
                      : renderMonitoria(evento)
                  )}
                </div>
              </section>
            ))
          ) : !error ? (
            <p className="calendario__estado-vacio">
              No hay parciales ni monitorías en los próximos 90 días.
            </p>
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default Calendario;
