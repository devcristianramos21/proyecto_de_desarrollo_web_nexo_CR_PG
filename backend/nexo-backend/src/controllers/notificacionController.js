import * as notificacionService from '../services/notificacionService.js';

export async function listar(req, res) {
  res.json(await notificacionService.listar(req.usuario));
}

export async function marcarLeida(req, res) {
  res.json(await notificacionService.marcarLeida(req.usuario, req.params.id));
}

export async function marcarTodasLeidas(req, res) {
  res.json(await notificacionService.marcarTodasLeidas(req.usuario));
}
