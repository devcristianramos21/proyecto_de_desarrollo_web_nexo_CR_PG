import { useState } from 'react';
import AdminShell from './AdminShell';
import './reportesAdmin.css';

const meses = [
  { nombre: 'Ago', tutoria: 48, monitoria: 12 },
  { nombre: 'Sep', tutoria: 74, monitoria: 18 },
  { nombre: 'Oct', tutoria: 89, monitoria: 22 },
  { nombre: 'Nov', tutoria: 105, monitoria: 24 },
];

const materias = [
  { nombre: 'Cálculo Diferencial', total: 142, color: 'azul' },
  { nombre: 'Álgebra Lineal', total: 98, color: 'rojo' },
  { nombre: 'Programación II', total: 76, color: 'oro' },
  { nombre: 'Microeconomía', total: 65, color: 'oro' },
  { nombre: 'Estadística', total: 54, color: 'oro' },
  { nombre: 'Bases de Datos', total: 42, color: 'oro' },
];

export default function ReportesAdmin({ onNavegar }) {
  const [semestre, setSemestre] = useState('2026-2');

  return (
    <AdminShell titulo="Reportes y estadísticas" paginaActiva="Reportes admin" onNavegar={onNavegar}>
      <div className="reportes-admin">
        <header className="admin-page-header reportes-admin__encabezado">
          <div>
            <h1>Reportes y estadísticas</h1>
            <p>Semestre {semestre} · Universidad del Rosario</p>
          </div>
          <div className="reportes-admin__controles">
            <label className="reportes-admin__semestre">
              <span className="visually-hidden">Semestre</span>
              <select value={semestre} onChange={(evento) => setSemestre(evento.target.value)}>
                <option>2026-2</option>
                <option>2026-1</option>
              </select>
            </label>
            <button type="button" className="admin-secondary-button" onClick={() => window.print()}>Exportar PDF</button>
          </div>
        </header>

        <section className="admin-kpis reportes-admin__kpis" aria-label="Indicadores del semestre">
          <article className="admin-card admin-kpi"><strong>316</strong><span>Sesiones totales<br />↑ 24% vs. semestre anterior</span></article>
          <article className="admin-card admin-kpi admin-kpi--orange"><strong>4.7</strong><span>Satisfacción promedio<br />Basado en 248 evaluaciones</span></article>
          <article className="admin-card admin-kpi admin-kpi--green"><strong>87%</strong><span>Tasa de confirmación<br />Monitorías sobre umbral</span></article>
          <article className="admin-card admin-kpi admin-kpi--gold"><strong>1.284</strong><span>Estudiantes alcanzados<br />Con al menos 1 sesión</span></article>
        </section>

        <div className="reportes-admin__graficos">
          <section className="admin-card reportes-admin__grafico-meses">
            <h2>Sesiones por mes</h2>
            <div className="reportes-admin__columnas">
              {meses.map((mes) => (
                <div className="reportes-admin__mes" key={mes.nombre}>
                  <strong>{mes.tutoria}</strong>
                  <div className="reportes-admin__barras">
                    <span className="reportes-admin__barra reportes-admin__barra--tutoria" style={{ height: `${mes.tutoria / 1.15}px` }} />
                    <span className="reportes-admin__barra reportes-admin__barra--monitoria" style={{ height: `${mes.monitoria / 1.15}px` }} />
                  </div>
                  <small>{mes.nombre}</small>
                </div>
              ))}
            </div>
            <div className="reportes-admin__leyenda">
              <span><i className="reportes-admin__leyenda-tutoria" />Tutorías</span>
              <span><i className="reportes-admin__leyenda-monitoria" />Monitorías</span>
            </div>
          </section>

          <section className="admin-card reportes-admin__tutores">
            <h2>Tutores destacados</h2>
            {[
              ['Felipe Castro', '67 sesiones', '4.8'],
              ['Andrés Moreno', '48 sesiones', '4.9'],
              ['Valentina Gómez', '31 sesiones', '4.7'],
            ].map(([nombre, sesiones, calificacion], index) => (
              <article className="reportes-admin__tutor" key={nombre}>
                <b>{index + 1}</b>
                <div><strong>{nombre}</strong><span>{sesiones}</span></div>
                <strong className="reportes-admin__estrellas">★ {calificacion}</strong>
              </article>
            ))}
          </section>
        </div>

        <section className="admin-card reportes-admin__materias">
          <h2>Materias con mayor demanda</h2>
          {materias.map((materia) => (
            <div className="reportes-admin__materia" key={materia.nombre}>
              <span>{materia.nombre}</span>
              <div><i className={`reportes-admin__demanda reportes-admin__demanda--${materia.color}`} style={{ width: `${materia.total / 142 * 100}%` }} /></div>
              <strong>{materia.total}</strong>
            </div>
          ))}
        </section>
      </div>
    </AdminShell>
  );
}
