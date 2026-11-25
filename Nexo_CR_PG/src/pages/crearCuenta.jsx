
import { useState } from 'react';
import './crearCuenta.css';

function CrearCuenta({ onVolver, onIniciarSesion, onCrearCuenta }) {
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    programa: '',
    semestre: '',
  });

  const actualizarCampo = (campo, valor) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const enviarFormulario = (e) => {
    e.preventDefault();

    if (formulario.contrasena.length < 8) {
      alert('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }

    if (!formulario.programa || !formulario.semestre) {
      alert('Por favor selecciona tu programa académico y semestre.');
      return;
    }

    if (onCrearCuenta) {
      onCrearCuenta({
        ...formulario,
        rol: 'estudiante',
      });
    } else {
      alert('El registro estará disponible próximamente.');
    }
  };

  return (
    <main className="crear-cuenta-pagina">
      <button
        type="button"
        className="crear-cuenta-volver"
        onClick={onVolver}
      >
        <span>‹</span>
        Volver al inicio
      </button>

      <div className="crear-cuenta-marca">
        <div className="crear-cuenta-logo">N</div>
        <h1>NEXO</h1>
      </div>

      <section className="crear-cuenta-card">
        <header className="crear-cuenta-encabezado">
          <h2>Crear cuenta</h2>
          <p>Completa tu información para comenzar</p>
        </header>

        <form onSubmit={enviarFormulario}>
          <div className="crear-cuenta-fila">
            <div className="crear-cuenta-campo">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                placeholder="Nombre"
                value={formulario.nombre}
                onChange={(e) => actualizarCampo('nombre', e.target.value)}
                required
              />
            </div>

            <div className="crear-cuenta-campo">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                type="text"
                placeholder="Apellido"
                value={formulario.apellido}
                onChange={(e) => actualizarCampo('apellido', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="crear-cuenta-campo">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              type="email"
              placeholder="correo@ejemplo.com"
              value={formulario.correo}
              onChange={(e) => actualizarCampo('correo', e.target.value)}
              required
            />
          </div>

          <div className="crear-cuenta-campo">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              placeholder="Crea una contraseña segura"
              value={formulario.contrasena}
              onChange={(e) => actualizarCampo('contrasena', e.target.value)}
              minLength={8}
              required
            />
            <small>Mínimo 8 caracteres</small>
          </div>

          <div className="crear-cuenta-fila">
            <div className="crear-cuenta-campo">
              <label htmlFor="programa">Programa académico</label>
              <select
                id="programa"
                value={formulario.programa}
                onChange={(e) => actualizarCampo('programa', e.target.value)}
                required
              >
                <option value="">Seleccionar programa</option>
                <option value="Administración de Empresas">Administración de Empresas</option>
                <option value="Ciencia Política">Ciencia Política</option>
                <option value="Economía">Economía</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Ingeniería">Ingeniería</option>
                <option value="Jurisprudencia">Jurisprudencia</option>
                <option value="Medicina">Medicina</option>
                <option value="Psicología">Psicología</option>
                <option value="Relaciones Internacionales">Relaciones Internacionales</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="crear-cuenta-campo">
              <label htmlFor="semestre">Semestre</label>
              <select
                id="semestre"
                value={formulario.semestre}
                onChange={(e) => actualizarCampo('semestre', e.target.value)}
                required
              >
                <option value="">Semestre</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}° semestre
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="crear-cuenta-submit">
            Crear cuenta
          </button>

          <p className="crear-cuenta-login">
            ¿Ya tienes cuenta?{' '}
            <button type="button" onClick={onIniciarSesion}>
              Iniciar sesión
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}

export default CrearCuenta;
