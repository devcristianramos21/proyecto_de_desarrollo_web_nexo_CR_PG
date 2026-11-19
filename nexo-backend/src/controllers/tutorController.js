import * as tutorService from '../services/tutorService.js';

export async function buscarTutores(req, res) {
  const { materia, nombre } = req.query;
  res.json(await tutorService.buscar({ materia, nombre }));
}

export async function verTutor(req, res) {
  res.json(await tutorService.obtenerPorId(req.params.id));
}

export async function verDisponibilidadDeTutor(req, res) {
  res.json(await tutorService.obtenerDisponibilidad(req.params.id));
}
