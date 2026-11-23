import { useMemo, useState } from 'react';
import AdminShell from './AdminShell';
import searchIcon from './assets/search.svg';
import './estudiantesAdmin.css';

export default function EstudiantesAdmin({ onNavegar, estudiantes = [] }) {
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('Todos');

  const filtrados = useMemo(() => estudiantes.filter((estudiante) => {
    const texto = `${estudiante.nombre} ${estudiante.correo}`.toLowerCase();
    return texto.includes(busqueda.trim().toLowerCase())
      && (estado === 'Todos' || estudiante.estado === estado);
  }), [estudiantes, busqueda, estado]);

  return (
    <AdminShell titulo="Gestión de estudiantes" paginaActiva="Estudiantes admin" onNavegar={onNavegar}>
      <div className="estudiantes-admin">
        <header className="admin-page-header">
          <div>
            <h1>Gestión de estudiantes</h1>
            <p>Directorio de estudiantes registrados en la plataforma</p>
          </div>
        </header>

        <section className="admin-kpis estudiantes-admin__kpis" aria-label="Estadísticas de estudiantes">
          <article className="admin-card admin-kpi"><strong>1.284</strong><span>Total registrados</span></article>
          <article className="admin-card admin-kpi admin-kpi--green"><strong>847</strong><span>Activos este semestre</span></article>
          <article className="admin-card admin-kpi admin-kpi--gold"><strong>3.2</strong><span>Tutorías promedio/semestre</span></article>
          <article className="admin-card admin-kpi admin-kpi--blue"><strong>1.8</strong><span>Monitorías promedio/semestre</span></article>
        </section>

        <div className="estudiantes-admin__filtros">
          <label className="estudiantes-admin__busqueda">
            <img className="estudiantes-admin__busqueda-icono" src={searchIcon} alt="" />
            <input
              type="search"
              placeholder="Buscar por nombre o correo..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              aria-label="Buscar estudiantes"
            />
          </label>
          <select value={estado} onChange={(evento) => setEstado(evento.target.value)} aria-label="Filtrar por estado">
            <option>Todos</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>

        <div className="estudiantes-admin__tabla-wrap admin-card">
          <table className="estudiantes-admin__tabla">
            <thead>
              <tr>
                <th>ESTUDIANTE</th>
                <th>PROGRAMA</th>
                <th>SEM.</th>
                <th>TUTORÍAS</th>
                <th>MONITORÍAS</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((estudiante) => (
                <tr key={estudiante.id}>
                  <td>
                    <strong>{estudiante.nombre}</strong>
                    <small>{estudiante.correo}</small>
                  </td>
                  <td>{estudiante.programa}</td>
                  <td><strong>{estudiante.semestre}</strong></td>
                  <td className="estudiantes-admin__numero">{estudiante.tutorias}</td>
                  <td className="estudiantes-admin__numero estudiantes-admin__numero--oro">{estudiante.monitorias}</td>
                  <td><span className={`estudiantes-admin__estado estudiantes-admin__estado--${estudiante.estado.toLowerCase()}`}>{estudiante.estado}</span></td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr><td className="estudiantes-admin__vacio" colSpan="6">No hay estudiantes que coincidan con la búsqueda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
