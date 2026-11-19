import * as solicitudTutorService from '../services/solicitudTutorService.js';

export async function crearSolicitud(req, res) {
  const solicitud = await solicitudTutorService.crear(req.usuario, req.body ?? {});
  res.status(201).json(solicitud);
}

export async function listarMisSolicitudes(req, res) {
  res.json(await solicitudTutorService.listarDeEstudiante(req.usuario.id));
}

export async function listarSolicitudes(req, res) {
  res.json(await solicitudTutorService.listar({ estado: req.query.estado }));
}

export async function aprobarSolicitud(req, res) {
  res.json(await solicitudTutorService.aprobar(req.params.id, req.usuario));
}

export async function rechazarSolicitud(req, res) {
  res.json(await solicitudTutorService.rechazar(req.params.id, req.usuario, req.body ?? {}));
}
