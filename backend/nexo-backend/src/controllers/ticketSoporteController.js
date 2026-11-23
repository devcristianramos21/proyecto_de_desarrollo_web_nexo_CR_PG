import * as ticketSoporteService from '../services/ticketSoporteService.js';

export async function crear(req, res) {
  res.status(201).json(await ticketSoporteService.crear(req.usuario, req.body ?? {}));
}

export async function listarMios(req, res) {
  res.json(await ticketSoporteService.listarMios(req.usuario));
}

export async function listar(req, res) {
  res.json(await ticketSoporteService.listar({ estado: req.query.estado }));
}

export async function actualizar(req, res) {
  res.json(await ticketSoporteService.actualizar(req.params.id, req.usuario, req.body ?? {}));
}
