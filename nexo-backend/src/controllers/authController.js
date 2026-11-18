import * as authService from '../services/authService.js';

export async function registro(req, res) {
  const resultado = await authService.registrar(req.body ?? {});
  res.status(201).json(resultado);
}

export async function login(req, res) {
  res.json(await authService.iniciarSesion(req.body ?? {}));
}
