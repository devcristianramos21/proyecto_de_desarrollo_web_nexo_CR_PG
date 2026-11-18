import { Monitoria } from '../models/Monitoria.js';

// Los errores de validación o de base de datos los atiende el manejador de errores de server.js.

export async function listarMonitorias(_req, res) {
  const monitorias = await Monitoria.find().sort({ fecha: 1, horaInicio: 1 });
  res.json(monitorias);
}

export async function obtenerMonitoria(req, res) {
  const monitoria = await Monitoria.findById(req.params.id);

  if (!monitoria) {
    return res.status(404).json({ mensaje: 'Monitoría no encontrada' });
  }

  res.json(monitoria);
}

export async function crearMonitoria(req, res) {
  const monitoria = await Monitoria.create(req.body ?? {});
  res.status(201).json(monitoria);
}

export async function actualizarMonitoria(req, res) {
  const monitoria = await Monitoria.findById(req.params.id);

  if (!monitoria) {
    return res.status(404).json({ mensaje: 'Monitoría no encontrada' });
  }

  // Se usa save() para que se ejecuten todas las validaciones del modelo.
  monitoria.set(req.body ?? {});
  await monitoria.save();

  res.json(monitoria);
}

export async function eliminarMonitoria(req, res) {
  const monitoria = await Monitoria.findByIdAndDelete(req.params.id);

  if (!monitoria) {
    return res.status(404).json({ mensaje: 'Monitoría no encontrada' });
  }

  res.json({ mensaje: 'Monitoría eliminada' });
}
