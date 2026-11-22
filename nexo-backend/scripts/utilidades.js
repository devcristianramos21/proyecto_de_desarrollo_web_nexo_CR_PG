// Funciones compartidas por los scripts de mantenimiento (seed y limpieza).
import { Conversacion } from '../src/models/Conversacion.js';
import { Disponibilidad } from '../src/models/Disponibilidad.js';
import { Mensaje } from '../src/models/Mensaje.js';
import { Monitoria } from '../src/models/Monitoria.js';
import { Parcial } from '../src/models/Parcial.js';
import { SolicitudTutor } from '../src/models/SolicitudTutor.js';
import { Usuario } from '../src/models/Usuario.js';

/** Usuarios cuyo correo empieza por el prefijo dado (ej. "prueba.", "demo."). */
export function buscarPorPrefijo(prefijo) {
  const escapado = prefijo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return Usuario.find({ correo: new RegExp(`^${escapado}`) }).select('_id correo rol');
}

/**
 * Cuenta (simular = true) o borra todo lo que depende de esos usuarios.
 * Las monitorías de otras personas donde estaban inscritos no se borran: solo se les quita de la lista.
 */
export async function borrarUsuariosYDependencias(ids, { simular = false } = {}) {
  const monitoriasPropias = await Monitoria.find({
    $or: [{ tutor: { $in: ids } }, { creadaPor: { $in: ids } }],
  }).select('_id');
  const idsMonitorias = monitoriasPropias.map((m) => m._id);

  const conversaciones = await Conversacion.find({
    $or: [{ participantes: { $in: ids } }, { monitoria: { $in: idsMonitorias } }],
  }).select('_id');
  const idsConversaciones = conversaciones.map((c) => c._id);

  const filtroMensajes = { $or: [{ conversacion: { $in: idsConversaciones } }, { autor: { $in: ids } }] };

  if (simular) {
    return {
      usuarios: ids.length,
      monitorias: idsMonitorias.length,
      inscripcionesEnOtrasMonitorias: await Monitoria.countDocuments({ _id: { $nin: idsMonitorias }, estudiantes: { $in: ids } }),
      parciales: await Parcial.countDocuments({ creadoPor: { $in: ids } }),
      solicitudes: await SolicitudTutor.countDocuments({ estudiante: { $in: ids } }),
      franjas: await Disponibilidad.countDocuments({ tutor: { $in: ids } }),
      conversaciones: idsConversaciones.length,
      mensajes: await Mensaje.countDocuments(filtroMensajes),
    };
  }

  const resultado = {
    mensajes: (await Mensaje.deleteMany(filtroMensajes)).deletedCount,
    conversaciones: (await Conversacion.deleteMany({ _id: { $in: idsConversaciones } })).deletedCount,
    monitorias: (await Monitoria.deleteMany({ _id: { $in: idsMonitorias } })).deletedCount,
    inscripcionesEnOtrasMonitorias: (await Monitoria.updateMany({ estudiantes: { $in: ids } }, { $pull: { estudiantes: { $in: ids } } })).modifiedCount,
    parciales: (await Parcial.deleteMany({ creadoPor: { $in: ids } })).deletedCount,
    solicitudes: (await SolicitudTutor.deleteMany({ estudiante: { $in: ids } })).deletedCount,
    franjas: (await Disponibilidad.deleteMany({ tutor: { $in: ids } })).deletedCount,
  };
  await Usuario.updateMany({ favoritos: { $in: ids } }, { $pull: { favoritos: { $in: ids } } });
  await Conversacion.updateMany({ 'lecturas.usuario': { $in: ids } }, { $pull: { lecturas: { usuario: { $in: ids } } } });
  resultado.usuarios = (await Usuario.deleteMany({ _id: { $in: ids } })).deletedCount;

  return resultado;
}

export function imprimirResumen(titulo, resumen) {
  console.log(titulo);
  for (const [clave, valor] of Object.entries(resumen)) console.log(`  - ${clave}: ${valor}`);
}
