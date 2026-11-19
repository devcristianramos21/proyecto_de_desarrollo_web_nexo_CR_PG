import { Usuario } from '../models/Usuario.js';
import { AppError } from '../utils/AppError.js';
import { elegirCampos } from '../utils/elegirCampos.js';

// Información básica que el usuario puede editar de su propio perfil.
// Correo, rol y contraseña quedan fuera a propósito.
const CAMPOS_PERFIL = ['nombre', 'carrera', 'semestre', 'foto', 'biografia'];
// Un tutor además puede ajustar las materias que dicta
const CAMPOS_PERFIL_TUTOR = [...CAMPOS_PERFIL, 'materias'];

export async function obtenerPerfil(idUsuario) {
  const usuario = await Usuario.findById(idUsuario);

  if (!usuario) {
    throw new AppError(404, 'Usuario no encontrado');
  }

  return usuario;
}

export async function actualizarPerfil(idUsuario, datos) {
  const usuario = await obtenerPerfil(idUsuario);

  const permitidos = usuario.rol === 'tutor' ? CAMPOS_PERFIL_TUTOR : CAMPOS_PERFIL;
  usuario.set(elegirCampos(datos, permitidos));
  return usuario.save();
}

export async function cambiarPassword(idUsuario, { passwordActual, passwordNueva } = {}) {
  if (!passwordActual || !passwordNueva) {
    throw new AppError(400, 'La contraseña actual y la nueva son obligatorias');
  }

  const usuario = await Usuario.findById(idUsuario).select('+password');

  if (!usuario) {
    throw new AppError(404, 'Usuario no encontrado');
  }

  if (!(await usuario.compararPassword(String(passwordActual)))) {
    throw new AppError(400, 'La contraseña actual no es correcta');
  }

  // El hook pre('save') del modelo valida la longitud y la cifra
  usuario.password = String(passwordNueva);
  await usuario.save();
}
