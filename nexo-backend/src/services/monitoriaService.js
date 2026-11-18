import { Monitoria } from '../models/Monitoria.js';
import { AppError } from '../utils/AppError.js';

// Reglas de negocio de las monitorías. No conoce req ni res: recibe datos y devuelve datos.

export async function listar() {
  return Monitoria.find().sort({ fecha: 1, horaInicio: 1 });
}

export async function obtenerPorId(id) {
  const monitoria = await Monitoria.findById(id);

  if (!monitoria) {
    throw new AppError(404, 'Monitoría no encontrada');
  }

  return monitoria;
}

export async function crear(datos) {
  return Monitoria.create(datos);
}

export async function actualizar(id, datos) {
  const monitoria = await obtenerPorId(id);

  // Se usa save() para que se ejecuten todas las validaciones del modelo.
  monitoria.set(datos);
  return monitoria.save();
}

export async function eliminar(id) {
  const monitoria = await Monitoria.findByIdAndDelete(id);

  if (!monitoria) {
    throw new AppError(404, 'Monitoría no encontrada');
  }
}
