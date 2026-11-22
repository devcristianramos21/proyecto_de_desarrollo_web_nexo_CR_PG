
import { useState } from 'react';

import HomeEstudiante from './pages/homeEstudiantes';
import BuscarTutores from './pages/buscarTutores';
import Monitorias from './pages/monitorias';
import Calendario from './pages/calendario';
import MisSolicitudes from './pages/misSolicitudes';
import MisMonitorias from './pages/misMonitorias';
import Mensajes from './pages/mensajes';
import Favoritos from './pages/favoritos';
import MiPerfil from './pages/miPerfil';
import Notificaciones from './pages/notificaciones';
import CentroSoporte from './pages/centroSoporte';

function App() {
  const [pantalla, setPantalla] = useState('Inicio');

  const navegar = (destino) => {
    const pantallasDisponibles = [
      'Inicio',
      'Buscar tutores',
      'Monitorías',
      'Calendario',
      'Mis solicitudes',
      'Mis monitorias',
      'Mensajes',
      'Favoritos',
      'Mi perfil',
      'Notificaciones',
      'Soporte',
    ];

    if (pantallasDisponibles.includes(destino)) {
      setPantalla(destino);
    }
  };

  return (
    <>
      {pantalla === 'Inicio' && (
        <HomeEstudiante onNavegar={navegar} />
      )}

      {pantalla === 'Buscar tutores' && (
        <BuscarTutores onNavegar={navegar} />
      )}

      {pantalla === 'Monitorías' && (
        <Monitorias onNavegar={navegar} />
      )}

      {pantalla === 'Calendario' && (
        <Calendario onNavegar={navegar} />
      )}

      {pantalla === 'Mis solicitudes' && (
        <MisSolicitudes onNavegar={navegar} />
      )}

      {pantalla === 'Mis monitorias' && (
        <MisMonitorias onNavegar={navegar} />
      )}

      {pantalla === 'Mensajes' && (
        <Mensajes onNavegar={navegar} />
      )}

      {pantalla === 'Favoritos' && (
        <Favoritos onNavegar={navegar} />
      )}

      {pantalla === 'Mi perfil' && (
        <MiPerfil onNavegar={navegar} />
      )}

      {pantalla === 'Notificaciones' && (
        <Notificaciones onNavegar={navegar} />
      )}

      {pantalla === 'Soporte' && (
        <CentroSoporte onNavegar={navegar} />
      )}
    </>
  );
}

export default App;
