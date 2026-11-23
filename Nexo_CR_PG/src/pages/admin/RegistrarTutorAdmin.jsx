import { useState } from 'react';
import AdminShell from './AdminShell';
import './registrarTutorAdmin.css';

const programas = [
  'Ingeniería de Sistemas',
  'Economía',
  'Matemáticas',
  'Psicología',
  'Administración de Empresas',
  'Jurisprudencia',
];

const materiasBase = [
  'Cálculo Diferencial',
  'Álgebra Lineal',
  'Programación II',
  'Estructuras de datos',
  'Psicología Social',
  'Metodología',
];

export default function RegistrarTutorAdmin({ onNavegar, onRegistrar }) {
  const [formulario, setFormulario] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    programa: 'Ingeniería de Sistemas',
    semestre: '5°',
    rol: 'Monitor obligatorio',
  });
  const [materias, setMaterias] = useState(['Cálculo Diferencial']);
  const [materiaNueva, setMateriaNueva] = useState('');
  const [error, setError] = useState('');

  const cambiar = (campo, valor) => {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
    setError('');
  };

  const agregarMateria = () => {
    const materia = materiaNueva.trim();
    if (materia && !materias.includes(materia)) {
      setMaterias((actuales) => [...actuales, materia]);
      setMateriaNueva('');
    }
  };

  const registrar = (evento) => {
    evento.preventDefault();
    if (!/^[^\s@]+@urosario\.edu\.co$/i.test(formulario.correo)) {
      setError('Ingresa un correo institucional @urosario.edu.co.');
      return;
    }

    onRegistrar?.({
      id: Date.now(),
      nombre: `${formulario.nombres.trim()} ${formulario.apellidos.trim()}`.trim(),
      iniciales: `${formulario.nombres.trim()[0] || ''}${formulario.apellidos.trim()[0] || ''}`.toUpperCase(),
      correo: formulario.correo.trim(),
      programa: formulario.programa,
      semestre: `${formulario.semestre} semestre`,
      rol: formulario.rol,
      estado: 'Pendiente',
      validado: false,
      desde: 'Sep 2026',
      materias,
      sesiones: 0,
      calificacion: null,
    });
  };

  return (
    <AdminShell titulo="Registrar tutor / monitor" paginaActiva="Tutores admin" onNavegar={onNavegar}>
      <div className="registrar-tutor-admin">
        <nav className="registrar-tutor-admin__migas" aria-label="Ruta de navegación">
          <button type="button" onClick={() => onNavegar?.('Tutores admin')}>Tutores y monitores</button>
          <span>/</span>
          <strong>Registrar tutor</strong>
        </nav>
        <header className="admin-page-header">
          <div>
            <h1>Registrar tutor / monitor</h1>
            <p>Añade un nuevo tutor o monitor al sistema institucional</p>
          </div>
        </header>

        <form className="registrar-tutor-admin__formulario admin-card" onSubmit={registrar}>
          <h2>INFORMACIÓN PERSONAL</h2>
          <div className="registrar-tutor-admin__grid">
            <label>
              Nombres
              <input className="admin-field" value={formulario.nombres} onChange={(evento) => cambiar('nombres', evento.target.value)} placeholder="Ej. Andrés Felipe" required />
            </label>
            <label>
              Apellidos
              <input className="admin-field" value={formulario.apellidos} onChange={(evento) => cambiar('apellidos', evento.target.value)} placeholder="Ej. Moreno Castillo" required />
            </label>
            <label className="registrar-tutor-admin__completo">
              Correo institucional
              <input className="admin-field" type="email" value={formulario.correo} onChange={(evento) => cambiar('correo', evento.target.value)} placeholder="nombre.apellido@urosario.edu.co" required />
            </label>
            <label>
              Programa académico
              <select className="admin-select" value={formulario.programa} onChange={(evento) => cambiar('programa', evento.target.value)}>
                {programas.map((programa) => <option key={programa}>{programa}</option>)}
              </select>
            </label>
            <label>
              Semestre
              <select className="admin-select" value={formulario.semestre} onChange={(evento) => cambiar('semestre', evento.target.value)}>
                {Array.from({ length: 10 }, (_, index) => <option key={index + 1}>{index + 1}°</option>)}
              </select>
            </label>
          </div>

          <h2>TIPO Y MATERIAS</h2>
          <fieldset className="registrar-tutor-admin__roles">
            <legend>Tipo de rol</legend>
            <div>
              {['Monitor obligatorio', 'Monitor par', 'Tutor libre'].map((rol) => (
                <label key={rol}>
                  <input type="radio" name="rol-tutor" checked={formulario.rol === rol} onChange={() => cambiar('rol', rol)} />
                  <span>{rol}</span>
                </label>
              ))}
            </div>
            <small>{formulario.rol === 'Monitor obligatorio' ? 'Asignado por la universidad, grupos de 20-25 estudiantes.' : formulario.rol === 'Monitor par' ? 'Apoyo académico entre pares, grupos pequeños.' : 'Tutorías individuales según disponibilidad.'}</small>
          </fieldset>

          <div className="registrar-tutor-admin__materias">
            <strong>Materias que puede enseñar</strong>
            <div className="registrar-tutor-admin__chips">
              {materias.map((materia) => (
                <button type="button" key={materia} onClick={() => setMaterias((actuales) => actuales.filter((item) => item !== materia))}>
                  {materia} <span aria-label={`Quitar ${materia}`}>×</span>
                </button>
              ))}
            </div>
            <div className="registrar-tutor-admin__agregar-materia">
              <input list="materias-admin-lista" className="admin-field" value={materiaNueva} onChange={(evento) => setMateriaNueva(evento.target.value)} onKeyDown={(evento) => evento.key === 'Enter' && (evento.preventDefault(), agregarMateria())} placeholder="Agregar materia..." />
              <datalist id="materias-admin-lista">{materiasBase.map((materia) => <option key={materia} value={materia} />)}</datalist>
              <button type="button" className="admin-secondary-button" onClick={agregarMateria}>Agregar</button>
            </div>
          </div>

          <aside className="registrar-tutor-admin__aviso">
            <span aria-hidden="true">ⓘ</span>
            <p>Al registrar, se enviará un correo automático al tutor con sus credenciales de acceso institucionales. El estado inicial será <strong>Pendiente de validación</strong>.</p>
          </aside>

          {error && <p className="admin-error" role="alert">{error}</p>}
          <div className="registrar-tutor-admin__acciones">
            <button type="button" className="admin-text-button" onClick={() => onNavegar?.('Tutores admin')}>Cancelar</button>
            <button type="submit" className="admin-primary-button">Registrar tutor</button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
