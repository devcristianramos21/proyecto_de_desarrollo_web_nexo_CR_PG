import { EventEmitter } from 'node:events';
import mongoose from 'mongoose';
import { Conversacion } from '../models/Conversacion.js';
import { Mensaje } from '../models/Mensaje.js';
import { Monitoria, TIPOS_GRUPALES } from '../models/Monitoria.js';
import { Usuario } from '../models/Usuario.js';
import { AppError } from '../utils/AppError.js';

// Una relación tutor-estudiante "cuenta" si la monitoría está programada o ya se realizó
const ESTADOS_CON_RELACION = ['programada', 'finalizada'];
const DATOS_USUARIO = 'nombre foto';
const DATOS_MONITORIA = 'tipo materia grupo fecha horaInicio horaFin estado tutor estudiantes';
const LIMITE_POR_DEFECTO = 30;
const LIMITE_MAXIMO = 100;
const NO_ENCONTRADA = 'Conversación no encontrada';

/**
 * Avisa cuando se envía un mensaje: evento 'mensaje' con { conversacion, destinatarios, mensaje }.
 * La capa de tiempo real (Socket.IO) se suscribe aquí; el chat REST funciona sin ella.
 */
export const eventosChat = new EventEmitter();

const id = (valor) => String(valor?._id ?? valor);
const miembrosDeGrupo = (monitoria) => [id(monitoria.tutor), ...monitoria.estudiantes.map(id)];

// ───────────────────────── Reglas de acceso ─────────────────────────

/** ¿Tienen o tuvieron una monitoría juntos, uno como tutor y el otro como estudiante? */
function tienenRelacion(idA, idB) {
  return Monitoria.exists({
    estado: { $in: ESTADOS_CON_RELACION },
    $or: [
      { tutor: idA, estudiantes: idB },
      { tutor: idB, estudiantes: idA },
    ],
  });
}

/**
 * Carga la conversación verificando que el usuario pertenezca a ella.
 * Para escribir, además vuelve a verificar que la relación siga vigente.
 */
async function obtenerConAcceso(usuario, idConversacion, { paraEscribir = false } = {}) {
  const conversacion = await Conversacion.findById(idConversacion);
  if (!conversacion) throw new AppError(404, NO_ENCONTRADA);

  if (conversacion.tipo === 'directa') {
    const participantes = conversacion.participantes.map(id);
    if (!participantes.includes(usuario.id)) throw new AppError(404, NO_ENCONTRADA);

    const otro = participantes.find((p) => p !== usuario.id);
    if (paraEscribir && !(await tienenRelacion(usuario.id, otro))) {
      throw new AppError(403, 'Ya no tienes una monitoría vigente con esta persona; solo puedes leer el historial');
    }
    return { conversacion, destinatarios: participantes };
  }

  const monitoria = await Monitoria.findById(conversacion.monitoria);
  if (!monitoria || !miembrosDeGrupo(monitoria).includes(usuario.id)) throw new AppError(404, NO_ENCONTRADA);
  if (paraEscribir && !ESTADOS_CON_RELACION.includes(monitoria.estado)) {
    throw new AppError(409, `La monitoría está ${monitoria.estado}; el chat del grupo es solo de lectura`);
  }
  return { conversacion, destinatarios: miembrosDeGrupo(monitoria) };
}

// ───────────────────────── Lecturas ─────────────────────────

async function marcarLeida(idConversacion, idUsuario, fecha = new Date()) {
  const { matchedCount } = await Conversacion.updateOne(
    { _id: idConversacion, 'lecturas.usuario': idUsuario },
    { $set: { 'lecturas.$.fecha': fecha } },
  );
  if (!matchedCount) {
    await Conversacion.updateOne({ _id: idConversacion }, { $push: { lecturas: { usuario: idUsuario, fecha } } });
  }
}

function contarNoLeidos(conversacion, idUsuario) {
  const lectura = conversacion.lecturas.find((l) => id(l.usuario) === idUsuario);
  return Mensaje.countDocuments({
    conversacion: conversacion._id,
    autor: { $ne: idUsuario },
    ...(lectura && { createdAt: { $gt: lectura.fecha } }),
  });
}

// ───────────────────────── Formato ─────────────────────────

async function presentar(conversacion, usuario) {
  await conversacion.populate([
    { path: 'participantes', select: DATOS_USUARIO },
    { path: 'monitoria', select: DATOS_MONITORIA },
  ]);

  const resultado = {
    _id: conversacion._id,
    tipo: conversacion.tipo,
    ultimoMensaje: conversacion.ultimoMensaje?.fecha ? conversacion.ultimoMensaje : null,
    noLeidos: await contarNoLeidos(conversacion, usuario.id),
    actualizada: conversacion.ultimoMensaje?.fecha ?? conversacion.createdAt,
  };

  if (conversacion.tipo === 'directa') {
    const otro = conversacion.participantes.find((p) => id(p) !== usuario.id);
    Object.assign(resultado, { titulo: otro?.nombre ?? 'Usuario eliminado', otroParticipante: otro ?? null });
  } else {
    const m = conversacion.monitoria;
    Object.assign(resultado, {
      titulo: m ? `${m.materia}${m.grupo ? ` - Grupo ${m.grupo}` : ''}` : 'Monitoría eliminada',
      monitoria: m && {
        _id: m._id,
        tipo: m.tipo,
        materia: m.materia,
        grupo: m.grupo,
        fecha: m.fecha?.toISOString().slice(0, 10),
        horaInicio: m.horaInicio,
        estado: m.estado,
        miembros: miembrosDeGrupo(m).length,
      },
    });
  }

  return resultado;
}

// ───────────────────────── Operaciones ─────────────────────────

/** Personas con las que el usuario puede abrir un chat directo. */
export async function listarContactos(usuario) {
  const monitorias = await Monitoria.find({
    estado: { $in: ESTADOS_CON_RELACION },
    $or: [{ tutor: usuario.id }, { estudiantes: usuario.id }],
  }).select('tutor estudiantes');

  const ids = new Set();
  for (const m of monitorias) {
    if (id(m.tutor) === usuario.id) m.estudiantes.forEach((e) => ids.add(id(e)));
    else ids.add(id(m.tutor));
  }
  ids.delete(usuario.id);

  return Usuario.find({ _id: { $in: [...ids] } }).select(DATOS_USUARIO).sort({ nombre: 1 });
}

/** Abre (o recupera) la conversación directa con otra persona. */
export async function abrirDirecta(usuario, idOtro) {
  if (!idOtro) throw new AppError(400, 'Datos no válidos', { usuario: 'Indica con quién quieres conversar' });
  if (!mongoose.isValidObjectId(idOtro)) throw new AppError(400, 'Identificador de usuario no válido');
  if (String(idOtro) === usuario.id) throw new AppError(400, 'No puedes abrir una conversación contigo mismo');

  const otro = await Usuario.findOne({ _id: idOtro, rol: { $in: ['estudiante', 'tutor'] } });
  if (!otro) throw new AppError(404, 'Usuario no encontrado');

  if (!(await tienenRelacion(usuario.id, otro.id))) {
    throw new AppError(403, 'Solo puedes escribirle a personas con las que tienes o tuviste una monitoría');
  }

  const clave = [usuario.id, otro.id].sort().join(':');
  // upsert: si dos peticiones llegan a la vez no se crean conversaciones duplicadas
  const conversacion = await Conversacion.findOneAndUpdate(
    { tipo: 'directa', clave },
    { $setOnInsert: { tipo: 'directa', clave, participantes: [usuario.id, otro.id] } },
    { upsert: true, returnDocument: 'after' },
  );

  return presentar(conversacion, usuario);
}

/** Abre (o recupera) el chat del grupo de una monitoría grupal. */
export async function abrirGrupo(usuario, idMonitoria) {
  if (!idMonitoria) throw new AppError(400, 'Datos no válidos', { monitoria: 'Indica la monitoría' });

  const monitoria = await Monitoria.findById(idMonitoria);
  if (!monitoria) throw new AppError(404, 'Monitoría no encontrada');
  if (!TIPOS_GRUPALES.includes(monitoria.tipo)) {
    throw new AppError(400, 'Las monitorías par no tienen chat de grupo; usa un mensaje directo');
  }
  if (!miembrosDeGrupo(monitoria).includes(usuario.id)) {
    throw new AppError(403, 'No participas en esta monitoría');
  }
  if (!ESTADOS_CON_RELACION.includes(monitoria.estado)) {
    throw new AppError(409, `La monitoría está ${monitoria.estado}; su chat no está disponible`);
  }

  const conversacion = await Conversacion.findOneAndUpdate(
    { tipo: 'grupo', monitoria: monitoria._id },
    { $setOnInsert: { tipo: 'grupo', monitoria: monitoria._id } },
    { upsert: true, returnDocument: 'after' },
  );

  return presentar(conversacion, usuario);
}

/** Bandeja: conversaciones directas y chats de los grupos del usuario, la más reciente primero. */
export async function listarConversaciones(usuario) {
  const misGrupos = await Monitoria.find({
    tipo: { $in: TIPOS_GRUPALES },
    estado: { $in: ESTADOS_CON_RELACION },
    $or: [{ tutor: usuario.id }, { estudiantes: usuario.id }],
  }).select('_id');

  // Cada grupo del usuario tiene su chat aunque nadie haya escrito todavía
  if (misGrupos.length) {
    await Conversacion.bulkWrite(
      misGrupos.map((m) => ({
        updateOne: {
          filter: { tipo: 'grupo', monitoria: m._id },
          update: { $setOnInsert: { tipo: 'grupo', monitoria: m._id } },
          upsert: true,
        },
      })),
    );
  }

  const conversaciones = await Conversacion.find({
    $or: [
      { tipo: 'directa', participantes: usuario.id },
      { tipo: 'grupo', monitoria: { $in: misGrupos.map((m) => m._id) } },
    ],
  });

  const lista = await Promise.all(conversaciones.map((c) => presentar(c, usuario)));
  return lista.sort((a, b) => b.actualizada - a.actualizada);
}

/**
 * Mensajes de una conversación, en orden cronológico.
 * Paginación hacia atrás: pasa en "antes" la fecha (createdAt) del mensaje más antiguo que ya tienes.
 */
export async function listarMensajes(usuario, idConversacion, { antes, limite } = {}) {
  const { conversacion } = await obtenerConAcceso(usuario, idConversacion);

  const cantidad = limite === undefined ? LIMITE_POR_DEFECTO : Number(limite);
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > LIMITE_MAXIMO) {
    throw new AppError(400, `El límite debe ser un número entre 1 y ${LIMITE_MAXIMO}`);
  }

  const filtro = { conversacion: conversacion._id };
  if (antes !== undefined) {
    const fecha = new Date(antes);
    if (Number.isNaN(fecha.getTime())) throw new AppError(400, '"antes" debe ser una fecha válida');
    filtro.createdAt = { $lt: fecha };
  }

  const mensajes = await Mensaje.find(filtro)
    .sort({ createdAt: -1, _id: -1 })
    .limit(cantidad + 1)
    .populate('autor', DATOS_USUARIO);

  const hayMas = mensajes.length > cantidad;

  // Abrir la conversación (primera página) la marca como leída
  if (antes === undefined) await marcarLeida(conversacion._id, usuario.id);

  return { mensajes: mensajes.slice(0, cantidad).reverse(), hayMas };
}

/** Ids de los miembros de una conversación, verificando que el usuario pertenezca a ella. */
export async function obtenerDestinatarios(usuario, idConversacion) {
  if (!mongoose.isValidObjectId(idConversacion)) throw new AppError(404, NO_ENCONTRADA);
  const { destinatarios } = await obtenerConAcceso(usuario, idConversacion);
  return destinatarios;
}

export async function enviarMensaje(usuario, idConversacion, { texto } = {}) {
  if (typeof texto !== 'string' || !texto.trim()) {
    throw new AppError(400, 'Datos no válidos', { texto: 'El mensaje no puede estar vacío' });
  }

  const { conversacion, destinatarios } = await obtenerConAcceso(usuario, idConversacion, { paraEscribir: true });

  const mensaje = await Mensaje.create({ conversacion: conversacion._id, autor: usuario.id, texto });
  await mensaje.populate('autor', DATOS_USUARIO);

  await Conversacion.updateOne(
    { _id: conversacion._id },
    { ultimoMensaje: { texto: mensaje.texto.slice(0, 100), autor: usuario.id, fecha: mensaje.createdAt } },
  );
  // Quien escribe ya leyó hasta su propio mensaje
  await marcarLeida(conversacion._id, usuario.id, mensaje.createdAt);

  eventosChat.emit('mensaje', { conversacion: id(conversacion), destinatarios, mensaje: mensaje.toObject() });
  return mensaje;
}
