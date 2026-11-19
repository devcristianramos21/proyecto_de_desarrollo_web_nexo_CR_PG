import * as disponibilidadService from '../services/disponibilidadService.js';

// Todas las acciones son sobre las franjas del tutor que inició sesión

export async function listarMiDisponibilidad(req, res) {
  res.json(await disponibilidadService.listarDeTutor(req.usuario.id));
}

export async function crearFranja(req, res) {
  const franja = await disponibilidadService.crear(req.usuario.id, req.body ?? {});
  res.status(201).json(franja);
}

export async function actualizarFranja(req, res) {
  res.json(await disponibilidadService.actualizar(req.usuario.id, req.params.id, req.body ?? {}));
}

export async function eliminarFranja(req, res) {
  await disponibilidadService.eliminar(req.usuario.id, req.params.id);
  res.json({ mensaje: 'Franja eliminada' });
}
