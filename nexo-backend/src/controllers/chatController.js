import * as chatService from '../services/chatService.js';

export async function listarContactos(req, res) {
  res.json(await chatService.listarContactos(req.usuario));
}

export async function listarConversaciones(req, res) {
  res.json(await chatService.listarConversaciones(req.usuario));
}

export async function abrirDirecta(req, res) {
  res.json(await chatService.abrirDirecta(req.usuario, req.body?.usuario));
}

export async function abrirGrupo(req, res) {
  res.json(await chatService.abrirGrupo(req.usuario, req.body?.monitoria));
}

export async function listarMensajes(req, res) {
  const { antes, limite } = req.query;
  res.json(await chatService.listarMensajes(req.usuario, req.params.id, { antes, limite }));
}

export async function enviarMensaje(req, res) {
  res.status(201).json(await chatService.enviarMensaje(req.usuario, req.params.id, req.body ?? {}));
}
