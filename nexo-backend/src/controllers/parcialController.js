import * as monitoriaService from '../services/monitoriaService.js';
import * as parcialService from '../services/parcialService.js';

export async function listarParciales(req, res) {
  const { materia, desde, hasta } = req.query;
  res.json(await parcialService.listar({ materia, desde, hasta }));
}

export async function verParcial(req, res) {
  res.json(await parcialService.obtenerPorId(req.params.id));
}

export async function listarPreparciales(req, res) {
  res.json(await monitoriaService.listarPreparcialesDe(req.usuario, req.params.id));
}

export async function crearParcial(req, res) {
  res.status(201).json(await parcialService.crear(req.usuario, req.body ?? {}));
}

export async function actualizarParcial(req, res) {
  res.json(await parcialService.actualizar(req.params.id, req.body ?? {}));
}

export async function eliminarParcial(req, res) {
  await parcialService.eliminar(req.params.id);
  res.json({ mensaje: 'Parcial eliminado' });
}
