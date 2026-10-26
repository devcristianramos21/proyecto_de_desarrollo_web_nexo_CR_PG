import {
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  GraduationCap,
  House,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Search,
  Star,
  User,
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import type { ItemMenu } from './components/Sidebar';

const NOMBRE_SITIO = 'NEXO';

// Datos del menú: más adelante podrían cambiar según el rol (estudiante, tutor...)
const ITEMS_MENU: ItemMenu[] = [
  { texto: 'Inicio', href: '#inicio', icono: House },
  { texto: 'Buscar tutores', href: '#buscar-tutores', icono: Search },
  { texto: 'Monitorías', href: '#monitorias', icono: BookOpen },
  { texto: 'Calendario', href: '#calendario', icono: Calendar },
  { texto: 'Mis solicitudes', href: '#mis-solicitudes', icono: ClipboardList, insignia: 1 },
  { texto: 'Mis tutorías', href: '#mis-tutorias', icono: GraduationCap },
  { texto: 'Mensajes', href: '#mensajes', icono: MessageSquare },
  { texto: 'Favoritos', href: '#favoritos', icono: Star },
  { texto: 'Mi perfil', href: '#mi-perfil', icono: User },
];

const ITEMS_INFERIORES: ItemMenu[] = [
  { texto: 'Notificaciones', href: '#notificaciones', icono: Bell, insignia: 0 },
  { texto: 'Soporte', href: '#soporte', icono: LifeBuoy },
  { texto: 'Cerrar sesión', href: '#cerrar-sesion', icono: LogOut, peligro: true },
];

/**
 * COMPONENTE RAÍZ: define el layout general (barra lateral + contenido)
 * y envía a cada componente sus datos por props.
 */
function App() {
  return (
    <div className="app">
      <Sidebar
        nombreSitio={NOMBRE_SITIO}
        subtitulo="Plataforma monitorías"
        rol="ESTUDIANTE"
        itemsMenu={ITEMS_MENU}
        itemsInferiores={ITEMS_INFERIORES}
        hrefActivoInicial="#inicio"
      />

      <main className="app__contenido">
        <h1>Inicio</h1>
        <p>Aquí irá el resto de la página.</p>
      </main>
    </div>
  );
}

export default App;