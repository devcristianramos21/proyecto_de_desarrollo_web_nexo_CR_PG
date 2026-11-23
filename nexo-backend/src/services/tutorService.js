import { CAMPOS_PUBLICOS_TUTOR, Usuario } from '../models/Usuario.js';
import { AppError } from '../utils/AppError.js';
import { regexBusqueda } from '../utils/escaparRegex.js';
import * as disponibilidadService from './disponibilidadService.js';

/**
 * Busca tutores. Filtros opcionales (sin distinguir mayúsculas ni tildes):
 * - materia: parte del nombre de una materia que dicta ("calculo" encuentra "Cálculo Diferencial")
 * - nombre: parte del nombre del tutor
 */
export async function buscar({ materia, nombre } = {}) {
  const filtro = { rol: 'tutor' };

  if (materia) filtro.materias = regexBusqueda(materia);
  if (nombre) filtro.nombre = regexBusqueda(nombre);

  return Usuario.find(filtro).select(CAMPOS_PUBLICOS_TUTOR).sort({ nombre: 1 });
}

export async function obtenerPorId(id) {
  const tutor = await Usuario.findOne({ _id: id, rol: 'tutor' }).select(CAMPOS_PUBLICOS_TUTOR);

  if (!tutor) {
    throw new AppError(404, 'Tutor no encontrado');
  }

  return tutor;
}

export async function obtenerDisponibilidad(id) {
  await obtenerPorId(id);
  return disponibilidadService.listarDeTutor(id);
}
