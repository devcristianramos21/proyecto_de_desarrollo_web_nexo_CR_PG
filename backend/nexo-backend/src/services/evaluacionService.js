import mongoose from 'mongoose';
import { Evaluacion, CRITERIOS_EVALUACION } from '../models/Evaluacion.js';
import { Monitoria } from '../models/Monitoria.js';
import { AppError } from '../utils/AppError.js';
import * as notificacionService from './notificacionService.js';

function validarCriterios(criterios) {
  if (!Array.isArray(criterios) || criterios.length !== CRITERIOS_EVALUACION.length) {
    throw new AppError(400, 'Debes calificar todos los criterios específicos');
  }

  const nombres = new Set();
  for (const criterio of criterios) {
    if (
      !CRITERIOS_EVALUACION.includes(criterio?.nombre)
      || !Number.isInteger(criterio.valor)
      || criterio.valor < 1
      || criterio.valor > 5
      || nombres.has(criterio.nombre)
    ) {
      throw new AppError(400, 'Los criterios de evaluación no son válidos');
    }
    nombres.add(criterio.nombre);
  }
}

export async function crear(estudiante, datos) {
  if (!mongoose.isValidObjectId(datos.monitoria)) {
    throw new AppError(400, 'Identificador de monitoría no válido');
  }
  if (!Number.isInteger(datos.calificacionGeneral)
    || datos.calificacionGeneral < 1
    || datos.calificacionGeneral > 5) {
    throw new AppError(400, 'La calificación general debe estar entre 1 y 5');
  }
  if (typeof datos.recomendacion !== 'boolean') {
    throw new AppError(400, 'Indica si recomendarías al tutor');
  }
  if (datos.comentario !== undefined
    && (typeof datos.comentario !== 'string' || datos.comentario.trim().length > 1000)) {
    throw new AppError(400, 'El comentario no puede superar los 1000 caracteres');
  }
  validarCriterios(datos.criterios);

  const monitoria = await Monitoria.findById(datos.monitoria);
  if (!monitoria || monitoria.tipo !== 'par' || monitoria.estado !== 'finalizada') {
    throw new AppError(409, 'Solo puedes evaluar una tutoría finalizada');
  }
  if (!monitoria.estudiantes.some((id) => String(id) === estudiante.id)) {
    throw new AppError(404, 'Tutoría no encontrada');
  }
  if (await Evaluacion.exists({ monitoria: monitoria._id, estudiante: estudiante.id })) {
    throw new AppError(409, 'Ya evaluaste esta tutoría');
  }

  let evaluacion;
  try {
    [evaluacion] = await mongoose.connection.transaction(async (session) => {
      const [nuevaEvaluacion] = await Evaluacion.create([{
        monitoria: monitoria._id,
        estudiante: estudiante.id,
        tutor: monitoria.tutor,
        calificacionGeneral: datos.calificacionGeneral,
        criterios: datos.criterios,
        comentario: datos.comentario ?? '',
        recomendacion: datos.recomendacion,
      }], { session });
      await notificacionService.crear([monitoria.tutor], {
        tipo: 'confirmacion',
        titulo: 'Nueva evaluación recibida',
        descripcion: 'Un estudiante calificó una de tus tutorías.',
        accion: 'Ver perfil',
        destino: 'Mi perfil',
      }, { session });
      return [nuevaEvaluacion];
    });
  } catch (error) {
    if (error.code === 11000) throw new AppError(409, 'Ya evaluaste esta tutoría');
    throw error;
  }
  return evaluacion;
}

export async function listarMias(estudiante) {
  return Evaluacion.find({ estudiante: estudiante.id }).select('monitoria createdAt');
}
