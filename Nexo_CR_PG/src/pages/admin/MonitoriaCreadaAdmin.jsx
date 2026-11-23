import AdminShell from './AdminShell';
import successIcon from './assets/notification-success.svg';
import './monitoriaCreadaAdmin.css';

export default function MonitoriaCreadaAdmin({ onNavegar }) {
  return (
    <AdminShell titulo="Crear monitoría" paginaActiva="Monitorias" onNavegar={onNavegar} mostrarRegreso={false}>
      <div className="monitoria-creada-admin">
        <div className="monitoria-creada-admin__icono" aria-hidden="true">
          <img src={successIcon} alt="" />
        </div>
        <h1>Monitoría creada</h1>
        <p>La monitoría fue creada y está abierta para inscripciones. Los estudiantes elegibles serán notificados.</p>
        <div>
          <button type="button" className="admin-secondary-button" onClick={() => onNavegar?.('Monitorias admin')}>Ver monitorías</button>
          <button type="button" className="admin-primary-button" onClick={() => onNavegar?.('Crear monitoria admin')}>Crear otra</button>
        </div>
      </div>
    </AdminShell>
  );
}
