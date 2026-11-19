import mongoose from 'mongoose';
import { ESTADOS_SOLICITUD, SolicitudTutor } from '../models/SolicitudTutor.js';
import { Usuario } from '../models/Usuario.js';
import { AppError } from '../utils/AppError.js';
import { elegirCampos } from '../utils/elegirCampos.js';

const CAMPOS_SOLICITUD = ['materias', 'motivacion'];
const DATOS_ESTUDIANTE = 'nombre correo carrera semestre';

export async function crear(usuario, datos) {
  if (usuario.rol !== 'estudiante') {
    throw new AppError(409, 'Ya eres tutor');
  }

  const pendiente = await SolicitudTutor.exists({ estudiante: usuario.id, estado: 'pendiente' });
  if (pendiente) {
    throw new AppError(409, 'Ya tienes una solicitud pendiente de revisión');
  }

  return SolicitudTutor.create({
    ...elegirCampos(datos, CAMPOS_SOLICITUD),
    estudiante: usuario.id,
  });
}

export async function listarDeEstudiante(idEstudiante) {
  return SolicitudTutor.find({ estudiante: idEstudiante }).sort({ createdAt: -1 });
}

/** Para el administrador. Sin filtro devuelve todas; las más antiguas primero para atenderlas en orden. */
export async function listar({ estado } = {}) {
  const filtro = {};

  if (estado !== undefined) {
    if (!ESTADOS_SOLICITUD.includes(estado)) {
      throw new AppError(400, `El estado debe ser uno de: ${ESTADOS_SOLICITUD.join(', ')}`);
    }
    filtro.estado = estado;
  }

  return SolicitudTutor.find(filtro).populate('estudiante', DATOS_ESTUDIANTE).sort({ createdAt: 1 });
}

async function obtenerPendiente(id, session) {
  const solicitud = await SolicitudTutor.findById(id).session(session);

  if (!solicitud) {
    throw new AppError(404, 'Solicitud no encontrada');
  }
  if (solicitud.estado !== 'pendiente') {
    throw new AppError(409, `La solicitud ya fue ${solicitud.estado}`);
  }

  return solicitud;
}

/**
 * Aprueba la solicitud y convierte al estudiante en tutor con las materias pedidas.
 * Se hace en una transacción: o se guardan los dos cambios o ninguno.
 */
export async function aprobar(id, admin) {
  await mongoose.connection.transaction(async (session) => {
    const solicitud = await obtenerPendiente(id, session);
    const estudiante = await Usuario.findById(solicitud.estudiante).session(session);

    if (!estudiante) {
      throw new AppError(404, 'El estudiante de esta solicitud ya no existe');
    }

    estudiante.rol = 'tutor';
    estudiante.materias = [...new Set([...estudiante.materias, ...solicitud.materias])];
    await estudiante.save({ session });

    solicitud.set({ estado: 'aprobada', revisadaPor: admin.id, fechaRevision: new Date() });
    await solicitud.save({ session });
  });

  return SolicitudTutor.findById(id).populate('estudiante', DATOS_ESTUDIANTE);
}

export async function rechazar(id, admin, { comentario } = {}) {
  const solicitud = await obtenerPendiente(id);

  solicitud.set({
    estado: 'rechazada',
    revisadaPor: admin.id,
    fechaRevision: new Date(),
    comentarioRevision: comentario,
  });
  await solicitud.save();

  return solicitud.populate('estudiante', DATOS_ESTUDIANTE);
}
