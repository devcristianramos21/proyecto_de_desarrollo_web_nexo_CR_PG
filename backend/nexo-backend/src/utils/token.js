import jwt from 'jsonwebtoken';

// El token solo lleva el id del usuario. El rol se lee de la base en cada petición,
// así un cambio de rol (por ejemplo, al aprobar una solicitud de tutor) aplica de inmediato.

export function generarToken(usuario) {
  return jwt.sign({ sub: usuario.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRA_EN || '7d',
  });
}

/** Devuelve el contenido del token o lanza un error si es inválido o expiró. */
export function verificarToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
