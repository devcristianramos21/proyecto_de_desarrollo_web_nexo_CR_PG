import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import './Sidebar.css';

/** Un ítem de la barra lateral. */
export interface ItemMenu {
  texto: string;
  href: string;
  icono: LucideIcon; // el ícono llega como componente
  insignia?: number; // contador opcional (ej. solicitudes pendientes)
  peligro?: boolean; // opcional: pinta el ítem en rojo (ej. cerrar sesión)
}

// PROPS TIPADAS: la interfaz describe qué recibe el componente.
interface SidebarProps {
  nombreSitio: string;
  subtitulo: string;
  rol: string;
  itemsMenu: ItemMenu[];
  itemsInferiores: ItemMenu[];
  hrefActivoInicial: string;
}

export function Sidebar({
  nombreSitio,
  subtitulo,
  rol,
  itemsMenu,
  itemsInferiores,
  hrefActivoInicial,
}: SidebarProps) {
  // ESTADO: guarda cuál ítem está activo y re-renderiza al cambiarlo.
  const [hrefActivo, setHrefActivo] = useState(hrefActivoInicial);

  // Función auxiliar para no repetir el JSX de un ítem en las dos listas.
  const renderItem = (item: ItemMenu) => {
    const Icono = item.icono; // en JSX el componente debe empezar con mayúscula
    const esActivo = item.href === hrefActivo;

    const clases = [
      'sidebar__enlace',
      esActivo ? 'sidebar__enlace--activo' : '',
      item.peligro ? 'sidebar__enlace--peligro' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <li key={item.href}>
        <a
          href={item.href}
          className={clases}
          aria-current={esActivo ? 'page' : undefined}
          onClick={() => setHrefActivo(item.href)}
        >
          <Icono size={18} aria-hidden="true" />
          <span className="sidebar__texto">{item.texto}</span>
          {/* Renderizado condicional: la insignia solo aparece si se envió */}
          {item.insignia !== undefined && (
            <span className="sidebar__insignia">{item.insignia}</span>
          )}
        </a>
      </li>
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__marca">
        <span className="sidebar__logo" aria-hidden="true">
          N
        </span>
        <div>
          <p className="sidebar__nombre">{nombreSitio}</p>
          <p className="sidebar__subtitulo">{subtitulo}</p>
        </div>
      </div>

      <nav aria-label="Navegación principal">
        <p className="sidebar__rol">{rol}</p>
        <ul className="sidebar__lista">{itemsMenu.map(renderItem)}</ul>
      </nav>

      <nav className="sidebar__inferior" aria-label="Opciones de cuenta">
        <ul className="sidebar__lista">{itemsInferiores.map(renderItem)}</ul>
      </nav>
    </aside>
  );
}