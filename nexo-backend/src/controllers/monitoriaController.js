import * as monitoriaService from '../services/monitoriaService.js';

// Los controladores solo traducen HTTP: leen la petición, llaman al service y responden.
// Los errores los atiende el middleware manejadorErrores.

export async function listarMonitorias(_req, res) {
  res.json(await monitoriaService.listar());
}

export async function obtenerMonitoria(req, res) {
  res.json(await monitoriaService.obtenerPorId(req.params.id));
}

export async function crearMonitoria(req, res) {
  const monitoria = await monitoriaService.crear(req.body ?? {});
  res.status(201).json(monitoria);
}

export async function actualizarMonitoria(req, res) {
  res.json(await monitoriaService.actualizar(req.params.id, req.body ?? {}));
}

export async function eliminarMonitoria(req, res) {
  await monitoriaService.eliminar(req.params.id);
  res.json({ mensaje: 'Monitoría eliminada' });
}
