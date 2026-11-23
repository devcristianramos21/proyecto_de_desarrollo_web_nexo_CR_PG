import * as usuarioService from '../services/usuarioService.js';

// req.usuario lo deja el middleware autenticar

export async function verMiPerfil(req, res) {
  res.json(await usuarioService.obtenerPerfil(req.usuario.id));
}

export async function actualizarMiPerfil(req, res) {
  res.json(await usuarioService.actualizarPerfil(req.usuario.id, req.body ?? {}));
}

export async function cambiarMiPassword(req, res) {
  await usuarioService.cambiarPassword(req.usuario.id, req.body ?? {});
  res.json({ mensaje: 'Contraseña actualizada' });
}
