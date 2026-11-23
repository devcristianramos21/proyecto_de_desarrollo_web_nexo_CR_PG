import * as authService from '../services/authService.js';
import {
  NOMBRE_COOKIE_SESION,
  opcionesCookieSesion,
} from '../config/cookieSesion.js';

export async function registro(req, res) {
  const resultado = await authService.registrar(req.body ?? {});
  responderSesion(req, res, resultado, 201);
}

export async function login(req, res) {
  responderSesion(req, res, await authService.iniciarSesion(req.body ?? {}));
}

export function logout(_req, res) {
  res.clearCookie(NOMBRE_COOKIE_SESION, opcionesCookieSesion());
  res.json({ mensaje: 'Sesión cerrada' });
}

function responderSesion(req, res, resultado, status = 200) {
  if (req.get('Origin')) {
    res.cookie(NOMBRE_COOKIE_SESION, resultado.token, opcionesCookieSesion());
    return res.status(status).json({ usuario: resultado.usuario });
  }

  return res.status(status).json(resultado);
}
