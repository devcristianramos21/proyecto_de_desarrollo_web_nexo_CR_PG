import { useState } from 'react';
import Sidebar from '../../components/layout/sidebar';
import Navbar from '../../components/layout/navbar';
import ConfirmarCerrarSesion from '../../components/modals/confirmarCerrarSesion';
import './adminShell.css';

export default function AdminShell({
  titulo,
  paginaActiva,
  onNavegar,
  children,
  mostrarRegreso = true,
}) {
  const [mostrarCierre, setMostrarCierre] = useState(false);

  return (
    <div className="admin-shell">
      <Sidebar
        paginaActiva={paginaActiva}
        onNavegar={onNavegar}
        onCerrarSesion={() => setMostrarCierre(true)}
      />
      <div className="admin-shell__contenido">
        <Navbar
          titulo={titulo}
          variant="admin"
          showBack={mostrarRegreso}
          onBack={() => onNavegar?.('__back__')}
          onNavegar={onNavegar}
        />
        <main className="admin-shell__main">{children}</main>
      </div>
      {mostrarCierre && (
        <ConfirmarCerrarSesion
          onCancelar={() => setMostrarCierre(false)}
          onConfirmar={() => {
            setMostrarCierre(false);
            onNavegar?.('Landing');
          }}
        />
      )}
    </div>
  );
}
