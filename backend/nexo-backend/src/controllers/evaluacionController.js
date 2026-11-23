import * as evaluacionService from '../services/evaluacionService.js';

export async function crear(req, res) {
  res.status(201).json(await evaluacionService.crear(req.usuario, req.body ?? {}));
}

export async function listarMias(req, res) {
  res.json(await evaluacionService.listarMias(req.usuario));
}
