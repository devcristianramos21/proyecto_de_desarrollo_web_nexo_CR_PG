
import Sidebar from '../components/layout/sidebar';
import Navbar from '../components/layout/navbar';
import './Calendario.css';

const parciales = [
  {
    id: 1,
    dia: 'LUN',
    numero: '23',
    materia: 'Cálculo Diferencial',
    periodo: 'Esta semana',
    fecha: 'Lun 23 Sep · 8:00 AM · Sem. 2 · Aula 301',
    estado: 'Sin monitoría',
    tipo: 'sin-monitoria',
    accion: 'Buscar tutor',
    color: 'rojo',
  },
  {
    id: 2,
    dia: 'MAR',
    numero: '24',
    materia: 'Álgebra Lineal',
    periodo: 'Esta semana',
    fecha: 'Mar 24 Sep · 10:00 AM · Sem. 3 · Aula 205',
    estado: 'Monitoría disponible',
    tipo: 'con-monitoria',
    accion: 'Inscribirse',
    color: 'rojo',
  },
  {
    id: 3,
    dia: 'JUE',
    numero: '26',
    materia: 'Microeconomía',
    periodo: 'Próxima semana',
    fecha: 'Jue 26 Sep · 9:00 AM · Sem. 3 · Aula 401',
    estado: 'Sin monitoría',
    tipo: 'sin-monitoria',
    accion: 'Buscar tutor',
    color: 'naranja',
  },
  {
    id: 4,
    dia: 'LUN',
    numero: '6',
    materia: 'Cálculo Integral',
    periodo: 'Semana 8',
    fecha: 'Lun 6 Oct · 8:00 AM · Sem. 3 · Aula 301',
    estado: 'Monitoría disponible',
    tipo: 'con-monitoria',
    accion: 'Inscribirse',
    color: 'verde',
  },
];

function Calendario({ onNavegar }) {
  const manejarAccion = (parcial) => {
    if (parcial.accion === 'Buscar tutor') {
      onNavegar?.('Buscar tutores');
      return;
    }

    onNavegar?.('Monitorías');
  };

  const renderParcial = (parcial) => (
    <article
      className={`calendario__parcial calendario__parcial--${parcial.color}`}
      key={parcial.id}
    >
      <div className={`calendario__fecha calendario__fecha--${parcial.color}`}>
        <span>{parcial.dia}</span>
        <strong>{parcial.numero}</strong>
      </div>

      <div className="calendario__detalle">
        <div className="calendario__materia-fila">
          <h3>{parcial.materia}</h3>
          <span
            className={`calendario__periodo calendario__periodo--${parcial.color}`}
          >
            {parcial.periodo}
          </span>
        </div>

        <p>{parcial.fecha}</p>
      </div>

      <div className="calendario__acciones">
        <span
          className={`calendario__estado calendario__estado--${parcial.tipo}`}
        >
          {parcial.tipo === 'con-monitoria' && (
            <span className="calendario__punto-verde" />
          )}
          {parcial.estado}
        </span>

        <button
          type="button"
          className={`calendario__boton ${
            parcial.accion === 'Inscribirse'
              ? 'calendario__boton--principal'
              : 'calendario__boton--secundario'
          }`}
          onClick={() => manejarAccion(parcial)}
        >
          {parcial.accion}
        </button>
      </div>
    </article>
  );

  return (
    <div className="calendario-layout">
      <Sidebar
        paginaActiva="Calendario"
        onNavegar={onNavegar}
      />

      <div className="calendario-contenido">
        <Navbar titulo="Calendario académico" onNavegar={onNavegar} />

        <main className="calendario-main">
          <header className="calendario__encabezado">
            <h1>Calendario académico</h1>
            <p>
              Parciales y evaluaciones — Semestre 2026-2 · Universidad del Rosario
            </p>
          </header>

          <section className="calendario__alerta">
            <span className="calendario__alerta-icono">⚠</span>
            <div>
              <h2>5 parciales en los próximos 7 días</h2>
              <p>
                Cálculo Diferencial (Lun), Álgebra Lineal (Mar), Programación II
                (Mié), Microeconomía (Jue), Estadística (Vie). Revisa las
                monitorías de apoyo disponibles.
              </p>
            </div>
          </section>

          <section className="calendario__resumen">
            <article className="calendario__resumen-card">
              <strong className="resumen-rojo">2</strong>
              <span>Esta semana</span>
            </article>

            <article className="calendario__resumen-card">
              <strong className="resumen-naranja">1</strong>
              <span>Próxima semana</span>
            </article>

            <article className="calendario__resumen-card">
              <strong className="resumen-verde">1</strong>
              <span>Con monitoría</span>
            </article>

            <article className="calendario__resumen-card">
              <strong className="resumen-gris">2</strong>
              <span>Sin monitoría</span>
            </article>
          </section>

          <section className="calendario__semana">
            <h2>SEMANA 7 (23-27 SEP)</h2>
            <div className="calendario__lista">
              {parciales.slice(0, 3).map(renderParcial)}
            </div>
          </section>

          <section className="calendario__semana calendario__semana--siguiente">
            <h2>SEMANA 8 (6-10 OCT)</h2>
            <div className="calendario__lista">
              {parciales.slice(3).map(renderParcial)}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Calendario;
