import mongoose from 'mongoose';
import { Notificacion } from '../models/Notificacion.js';
import { Usuario } from '../models/Usuario.js';
import { AppError } from '../utils/AppError.js';

export async function crear(destinatarios, datos, { session } = {}) {
  const usuarios = [...new Set(destinatarios.map(String))].filter((id) =>
    mongoose.isValidObjectId(id)
  );
  if (usuarios.length === 0) return [];

  const documentos = usuarios.map((usuario) => ({
    usuario,
    tipo: datos.tipo,
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    accion: datos.accion ?? '',
    destino: datos.destino ?? '',
  }));
  return Notificacion.insertMany(documentos, session ? { session } : undefined);
}

export async function crearParaAdministradores(datos, { session } = {}) {
  let consulta = Usuario.find({ rol: 'admin' }).select('_id');
  if (session) consulta = consulta.session(session);
  const administradores = await consulta;
  return crear(administradores.map((admin) => admin.id), datos, { session });
}

export async function listar(usuario) {
  return Notificacion.find({ usuario: usuario.id }).sort({ createdAt: -1 }).limit(100);
}

export async function marcarLeida(usuario, id) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(404, 'Notificación no encontrada');

  const notificacion = await Notificacion.findOneAndUpdate(
    { _id: id, usuario: usuario.id },
    { leida: true },
    { returnDocument: 'after', runValidators: true },
  );
  if (!notificacion) throw new AppError(404, 'Notificación no encontrada');
  return notificacion;
}

export async function marcarTodasLeidas(usuario) {
  const resultado = await Notificacion.updateMany(
    { usuario: usuario.id, leida: false },
    { $set: { leida: true } },
  );
  return { modificadas: resultado.modifiedCount };
}
