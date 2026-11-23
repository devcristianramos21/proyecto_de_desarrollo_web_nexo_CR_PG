import { AppError } from '../utils/AppError.js';

// Un tutor también es estudiante: puede hacer todo lo que hace un estudiante.
const ROLES_INCLUIDOS = {
  estudiante: ['estudiante'],
  tutor: ['tutor', 'estudiante'],
  admin: ['admin'],
};

/**
 * Restringe una ruta a ciertos roles. Va después de autenticar.
 *
 * @example router.post('/', autenticar, permitir('admin'), crearParcial);
 * @example router.get('/mias', autenticar, permitir('estudiante'), ...); // también entra un tutor
 */
export function permitir(...rolesPermitidos) {
  return (req, _res, next) => {
    const rolesDelUsuario = ROLES_INCLUIDOS[req.usuario?.rol] ?? [];

    if (!rolesPermitidos.some((rol) => rolesDelUsuario.includes(rol))) {
      throw new AppError(403, 'No tienes permiso para realizar esta acción');
    }

    next();
  };
}
