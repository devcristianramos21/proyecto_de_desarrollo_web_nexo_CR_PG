import { Usuario } from '../models/Usuario.js';
import { AppError } from '../utils/AppError.js';
import { verificarToken } from '../utils/token.js';
import {
  leerCookie,
  NOMBRE_COOKIE_SESION,
} from '../config/cookieSesion.js';
import { origenFrontendPermitido } from '../config/origenesFrontend.js';

const METODOS_CON_CAMBIOS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Exige un token válido en el encabezado: Authorization: Bearer <token>
 * Si es válido, deja el usuario en req.usuario para los siguientes middlewares y controladores.
 */
export async function autenticar(req, _res, next) {
  const [esquema, tokenCabecera] = req.headers.authorization?.split(' ') ?? [];
  const tokenCookie = leerCookie(req.headers.cookie, NOMBRE_COOKIE_SESION);
  const token = (esquema === 'Bearer' && tokenCabecera)
    || tokenCookie;

  if (!token) {
    throw new AppError(401, 'Debes iniciar sesión');
  }

  if (
    tokenCookie
    && METODOS_CON_CAMBIOS.has(req.method)
    && (
      !origenFrontendPermitido(req.get('Origin'))
      || req.get('X-NEXO-Requested-With') !== 'XMLHttpRequest'
    )
  ) {
    throw new AppError(403, 'La solicitud no superó la validación CSRF');
  }

  let contenido;
  try {
    contenido = verificarToken(token);
  } catch (error) {
    const mensaje =
      error.name === 'TokenExpiredError'
        ? 'Tu sesión expiró, inicia sesión de nuevo'
        : 'Token no válido';
    throw new AppError(401, mensaje);
  }

  // Se consulta en cada petición para tener el rol actualizado y detectar cuentas eliminadas
  const usuario = await Usuario.findById(contenido.sub);

  if (!usuario) {
    throw new AppError(401, 'La cuenta ya no existe');
  }

  req.usuario = usuario;
  next();
}
