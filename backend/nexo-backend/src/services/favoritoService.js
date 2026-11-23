import { CAMPOS_PUBLICOS_TUTOR, Usuario } from '../models/Usuario.js';
import { AppError } from '../utils/AppError.js';
import * as tutorService from './tutorService.js';

export async function listar(idUsuario) {
  const usuario = await Usuario.findById(idUsuario).populate({
    path: 'favoritos',
    // Si alguien deja de ser tutor, deja de aparecer en favoritos
    match: { rol: 'tutor' },
    select: CAMPOS_PUBLICOS_TUTOR,
  });

  return usuario?.favoritos ?? [];
}

export async function agregar(idUsuario, idTutor) {
  if (String(idUsuario) === String(idTutor)) {
    throw new AppError(400, 'No puedes agregarte a ti mismo como favorito');
  }

  // Lanza 404 si no existe o no es tutor
  await tutorService.obtenerPorId(idTutor);

  // $addToSet no duplica: agregar dos veces el mismo tutor no tiene efecto
  await Usuario.updateOne({ _id: idUsuario }, { $addToSet: { favoritos: idTutor } });
  return listar(idUsuario);
}

export async function quitar(idUsuario, idTutor) {
  await Usuario.updateOne({ _id: idUsuario }, { $pull: { favoritos: idTutor } });
  return listar(idUsuario);
}
