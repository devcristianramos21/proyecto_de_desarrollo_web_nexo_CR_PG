import * as favoritoService from '../services/favoritoService.js';

// Cada acción devuelve la lista actualizada de tutores favoritos

export async function listarFavoritos(req, res) {
  res.json(await favoritoService.listar(req.usuario.id));
}

export async function agregarFavorito(req, res) {
  res.json(await favoritoService.agregar(req.usuario.id, req.params.tutorId));
}

export async function quitarFavorito(req, res) {
  res.json(await favoritoService.quitar(req.usuario.id, req.params.tutorId));
}
