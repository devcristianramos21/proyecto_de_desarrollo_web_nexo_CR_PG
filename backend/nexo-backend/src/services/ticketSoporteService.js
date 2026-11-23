import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import { TicketSoporte, ESTADOS_TICKET } from '../models/TicketSoporte.js';
import { Usuario } from '../models/Usuario.js';
import { AppError } from '../utils/AppError.js';
import * as notificacionService from './notificacionService.js';

const DATOS_SOLICITANTE = 'nombre correo rol';

function validarTexto(valor, campo, maximo) {
  if (typeof valor !== 'string' || !valor.trim() || valor.trim().length > maximo) {
    throw new AppError(400, 'Datos no válidos', {
      [campo]: `El campo es obligatorio y no puede superar ${maximo} caracteres`,
    });
  }
  return valor.trim();
}

function crearNumeroCaso() {
  return `NEXO-${randomBytes(4).toString('hex').toUpperCase()}`;
}

export async function crear(solicitante, datos) {
  const categoria = validarTexto(datos.categoria, 'categoria', 80);
  const asunto = validarTexto(datos.asunto, 'asunto', 120);
  const descripcion = validarTexto(datos.descripcion, 'descripcion', 3000);
  const caso = crearNumeroCaso();
  const [ticket] = await mongoose.connection.transaction(async (session) => {
    const [nuevoTicket] = await TicketSoporte.create([{
      numeroCaso: caso,
      solicitante: solicitante.id,
      categoria,
      asunto,
      descripcion,
    }], { session });

    await notificacionService.crearParaAdministradores({
      tipo: 'alerta',
      titulo: 'Nueva solicitud de soporte',
      descripcion: `${asunto} · caso ${caso}`,
      accion: 'Revisar caso',
      destino: 'Soporte admin',
    }, { session });
    return [nuevoTicket];
  });

  return ticket;
}

export async function listarMios(usuario) {
  return TicketSoporte.find({ solicitante: usuario.id }).sort({ createdAt: -1 });
}

export async function listar({ estado } = {}) {
  if (estado !== undefined && !ESTADOS_TICKET.includes(estado)) {
    throw new AppError(400, `El estado debe ser uno de: ${ESTADOS_TICKET.join(', ')}`);
  }
  return TicketSoporte.find(estado ? { estado } : {})
    .populate('solicitante', DATOS_SOLICITANTE)
    .sort({ createdAt: -1 });
}

export async function actualizar(id, admin, datos) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(404, 'Solicitud de soporte no encontrada');
  if (datos.estado !== undefined && !ESTADOS_TICKET.includes(datos.estado)) {
    throw new AppError(400, `El estado debe ser uno de: ${ESTADOS_TICKET.join(', ')}`);
  }

  const ticketId = await mongoose.connection.transaction(async (session) => {
    const ticket = await TicketSoporte.findById(id).session(session);
    if (!ticket) throw new AppError(404, 'Solicitud de soporte no encontrada');

    const estadoAnterior = ticket.estado;
    const respuestaAnterior = ticket.respuesta;
    const transiciones = {
      pendiente: ['en_revision', 'resuelto'],
      en_revision: ['resuelto'],
      resuelto: [],
    };
    if (datos.estado && datos.estado !== estadoAnterior
      && !transiciones[estadoAnterior].includes(datos.estado)) {
      throw new AppError(409, `No se puede cambiar el caso de ${estadoAnterior} a ${datos.estado}`);
    }

    if (datos.respuesta !== undefined) {
      if (typeof datos.respuesta !== 'string' || datos.respuesta.trim().length > 2000) {
        throw new AppError(400, 'Datos no válidos', {
          respuesta: 'La respuesta debe tener como máximo 2000 caracteres',
        });
      }
      ticket.respuesta = datos.respuesta.trim();
    }
    if (datos.estado) ticket.estado = datos.estado;
    ticket.atendidoPor = admin.id;
    await ticket.save({ session });

    if (ticket.estado !== estadoAnterior || ticket.respuesta !== respuestaAnterior) {
      await notificacionService.crear([ticket.solicitante], {
        tipo: ticket.estado === 'resuelto' ? 'confirmacion' : 'alerta',
        titulo: ticket.estado === 'resuelto' ? 'Solicitud de soporte resuelta' : 'Actualización de soporte',
        descripcion: ticket.respuesta || `El caso ${ticket.numeroCaso} cambió a ${ticket.estado.replace('_', ' ')}.`,
        accion: 'Ver solicitud',
        destino: 'Soporte',
      }, { session });
    }
    return ticket._id;
  });

  return TicketSoporte.findById(ticketId).populate('solicitante', DATOS_SOLICITANTE);
}
