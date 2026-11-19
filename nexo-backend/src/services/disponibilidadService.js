import { Disponibilidad, ordenarPorDia } from '../models/Disponibilidad.js';
import { AppError } from '../utils/AppError.js';
import { elegirCampos } from '../utils/elegirCampos.js';

const CAMPOS_FRANJA = ['diaSemana', 'horaInicio', 'horaFin'];

export async function listarDeTutor(idTutor) {
  return ordenarPorDia(await Disponibilidad.find({ tutor: idTutor }));
}

// Se busca por id y tutor a la vez: una franja ajena responde 404, sin revelar que existe
async function obtenerPropia(idTutor, id) {
  const franja = await Disponibilidad.findOne({ _id: id, tutor: idTutor });

  if (!franja) {
    throw new AppError(404, 'Franja de disponibilidad no encontrada');
  }

  return franja;
}

/** Rechaza la franja si se cruza con otra del mismo tutor el mismo día. */
async function verificarQueNoSeCruce(franja) {
  const cruce = await Disponibilidad.exists({
    _id: { $ne: franja._id },
    tutor: franja.tutor,
    diaSemana: franja.diaSemana,
    horaInicio: { $lt: franja.horaFin },
    horaFin: { $gt: franja.horaInicio },
  });

  if (cruce) {
    throw new AppError(409, 'Esta franja se cruza con otra de tus franjas ese mismo día');
  }
}

// Primero se valida el formato (para comparar horas válidas) y luego el cruce
async function validarYGuardar(franja) {
  await franja.validate();
  await verificarQueNoSeCruce(franja);
  return franja.save();
}

export async function crear(idTutor, datos) {
  const franja = new Disponibilidad({ ...elegirCampos(datos, CAMPOS_FRANJA), tutor: idTutor });
  return validarYGuardar(franja);
}

export async function actualizar(idTutor, id, datos) {
  const franja = await obtenerPropia(idTutor, id);
  franja.set(elegirCampos(datos, CAMPOS_FRANJA));
  return validarYGuardar(franja);
}

export async function eliminar(idTutor, id) {
  const franja = await obtenerPropia(idTutor, id);
  await franja.deleteOne();
}
