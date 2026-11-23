import * as monitoriaService from '../services/monitoriaService.js';

// Los controladores solo traducen HTTP; las reglas están en monitoriaService.
// req.usuario lo deja el middleware autenticar.

// Consultas
export async function listarTodas(req, res) {
  const { tipo, estado, materia, tutor } = req.query;
  res.json(await monitoriaService.listarTodas(req.usuario, { tipo, estado, materia, tutor }));
}

export async function listarDisponibles(req, res) {
  const { tipo, materia } = req.query;
  res.json(await monitoriaService.listarDisponibles(req.usuario, { tipo, materia }));
}

export async function listarMisTutorias(req, res) {
  res.json(await monitoriaService.listarComoEstudiante(req.usuario, { estado: req.query.estado }));
}

export async function listarComoTutor(req, res) {
  res.json(await monitoriaService.listarComoTutor(req.usuario, { estado: req.query.estado }));
}

export async function verMonitoria(req, res) {
  res.json(await monitoriaService.obtenerDetalle(req.usuario, req.params.id));
}

export async function verCalendario(req, res) {
  const { desde, hasta } = req.query;
  res.json(await monitoriaService.calendario(req.usuario, { desde, hasta }));
}

// Monitorías par
export async function solicitarPar(req, res) {
  res.status(201).json(await monitoriaService.solicitarPar(req.usuario, req.body ?? {}));
}

export async function aceptarSolicitud(req, res) {
  res.json(await monitoriaService.responderSolicitud(req.usuario, req.params.id, { aceptar: true }));
}

export async function rechazarSolicitud(req, res) {
  const motivo = req.body?.motivo;
  res.json(await monitoriaService.responderSolicitud(req.usuario, req.params.id, { aceptar: false, motivo }));
}

export async function proponerHorario(req, res) {
  res.json(await monitoriaService.proponerHorario(req.usuario, req.params.id, req.body ?? {}));
}

export async function responderPropuestaHorario(req, res) {
  res.json(await monitoriaService.responderPropuestaHorario(req.usuario, req.params.id, req.body ?? {}));
}

// Monitorías grupales (administrador)
export async function crearGrupal(req, res) {
  res.status(201).json(await monitoriaService.crearGrupal(req.usuario, req.body ?? {}));
}

export async function actualizarGrupal(req, res) {
  res.json(await monitoriaService.actualizarGrupal(req.usuario, req.params.id, req.body ?? {}));
}

export async function agregarEstudiantes(req, res) {
  res.json(await monitoriaService.agregarEstudiantes(req.usuario, req.params.id, req.body?.estudiantes));
}

export async function quitarEstudiante(req, res) {
  res.json(await monitoriaService.quitarEstudiante(req.usuario, req.params.id, req.params.estudianteId));
}

// Inscripciones
export async function inscribirse(req, res) {
  res.json(await monitoriaService.inscribirse(req.usuario, req.params.id));
}

export async function cancelarInscripcion(req, res) {
  res.json(await monitoriaService.cancelarInscripcion(req.usuario, req.params.id));
}

export async function cambiarGrupo(req, res) {
  res.json(await monitoriaService.cambiarGrupo(req.usuario, req.params.id, req.body?.destino));
}

// Cancelar y finalizar
export async function cancelarMonitoria(req, res) {
  res.json(await monitoriaService.cancelar(req.usuario, req.params.id, req.body ?? {}));
}

export async function finalizarMonitoria(req, res) {
  res.json(await monitoriaService.finalizar(req.usuario, req.params.id));
}
