import { Usuario } from '../models/Usuario.js';
import { AppError } from '../utils/AppError.js';
import { verificarToken } from '../utils/token.js';

/**
 * Exige un token válido en el encabezado: Authorization: Bearer <token>
 * Si es válido, deja el usuario en req.usuario para los siguientes middlewares y controladores.
 */
export async function autenticar(req, _res, next) {
  const [esquema, token] = req.headers.authorization?.split(' ') ?? [];

  if (esquema !== 'Bearer' || !token) {
    throw new AppError(401, 'Debes iniciar sesión');
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
