import mongoose from 'mongoose';
import { ESTADOS_ACTIVOS, Monitoria } from '../models/Monitoria.js';
import { Parcial } from '../models/Parcial.js';
import { AppError } from '../utils/AppError.js';
import { elegirCampos } from '../utils/elegirCampos.js';
import { regexBusqueda } from '../utils/escaparRegex.js';
import { aTextoFecha, hoyEnColombia, momentoEnColombia, parsearFecha } from '../utils/fechas.js';
import { esHoraValida } from '../utils/horas.js';

const CAMPOS_PARCIAL = ['materia', 'nombre', 'descripcion'];
const NO_ENCONTRADO = 'Parcial no encontrado';

// ───────────────────────── Reglas compartidas con las preparcial ─────────────────────────

/** Momento en que empieza el parcial (si no tiene hora, desde el inicio del día). */
export function inicioDelParcial(parcial) {
  return momentoEnColombia(parcial.fecha, parcial.hora ?? '00:00');
}

/** Una preparcial debe terminar antes de que empiece su parcial. */
export function terminaAntesDelParcial({ fecha, horaFin }, parcial) {
  return momentoEnColombia(fecha, horaFin) <= inicioDelParcial(parcial);
}

/** Busca el parcial de una preparcial; 400 si no se indicó, 404 si no existe. */
export async function obtenerParaPreparcial(idParcial) {
  if (!idParcial) {
    throw new AppError(400, 'Datos no válidos', {
      parcial: 'Una monitoría preparcial debe indicar el parcial para el que prepara',
    });
  }
  if (!mongoose.isValidObjectId(idParcial)) throw new AppError(400, 'Identificador de parcial no válido');

  const parcial = await Parcial.findById(idParcial);
  if (!parcial) throw new AppError(404, NO_ENCONTRADO);

  return parcial;
}

// ───────────────────────── Formato ─────────────────────────

export function presentar(parcial) {
  return { ...parcial.toObject({ versionKey: false }), fecha: aTextoFecha(parcial.fecha) };
}

// ───────────────────────── Validaciones ─────────────────────────

function leerFechaYHora({ fecha, hora }) {
  const dia = parsearFecha(fecha);
  const errores = {};

  if (!dia) errores.fecha = 'La fecha debe tener el formato AAAA-MM-DD';
  else if (dia < hoyEnColombia()) errores.fecha = 'La fecha del parcial no puede estar en el pasado';
  if (hora !== undefined && hora !== null && !esHoraValida(hora)) {
    errores.hora = 'La hora debe tener el formato HH:mm';
  }

  if (Object.keys(errores).length) throw new AppError(400, 'Datos no válidos', errores);
  return { fecha: dia, hora: hora ?? undefined };
}

// Preparciales vigentes de un parcial
function preparcialesActivas(idParcial) {
  return Monitoria.find({ tipo: 'preparcial', parcial: idParcial, estado: { $in: ESTADOS_ACTIVOS } });
}

// ───────────────────────── Operaciones ─────────────────────────

/** Lista de parciales. Filtros opcionales: materia (parte del nombre), desde y hasta (AAAA-MM-DD). */
export async function listar({ materia, desde, hasta } = {}) {
  const filtro = {};

  if (materia) filtro.materia = regexBusqueda(materia);
  for (const [valor, operador, nombre] of [[desde, '$gte', 'desde'], [hasta, '$lte', 'hasta']]) {
    if (valor === undefined) continue;
    const fecha = parsearFecha(valor);
    if (!fecha) throw new AppError(400, `"${nombre}" debe tener el formato AAAA-MM-DD`);
    filtro.fecha = { ...filtro.fecha, [operador]: fecha };
  }

  const parciales = await Parcial.find(filtro).sort({ fecha: 1, hora: 1 });
  return parciales.map(presentar);
}

export async function obtenerPorId(id) {
  const parcial = await Parcial.findById(id);
  if (!parcial) throw new AppError(404, NO_ENCONTRADO);
  return presentar(parcial);
}

export async function crear(admin, datos) {
  const parcial = await Parcial.create({
    ...elegirCampos(datos, CAMPOS_PARCIAL),
    ...leerFechaYHora(datos),
    creadoPor: admin.id,
  });
  return presentar(parcial);
}

export async function actualizar(id, datos) {
  const parcial = await Parcial.findById(id);
  if (!parcial) throw new AppError(404, NO_ENCONTRADO);

  parcial.set(elegirCampos(datos, CAMPOS_PARCIAL));

  if (datos.fecha !== undefined || datos.hora !== undefined) {
    parcial.set(
      leerFechaYHora({
        fecha: datos.fecha ?? aTextoFecha(parcial.fecha),
        hora: datos.hora !== undefined ? datos.hora : parcial.hora,
      }),
    );

    // Si el parcial se adelanta, ninguna preparcial puede quedar después de él
    const preparciales = await preparcialesActivas(parcial._id);
    const quedanDespues = preparciales.filter((monitoria) => !terminaAntesDelParcial(monitoria, parcial));
    if (quedanDespues.length) {
      throw new AppError(
        409,
        `Con esa fecha, ${quedanDespues.length} monitoría(s) preparcial quedarían después del parcial. Cámbialas o cancélalas primero`,
      );
    }
  }

  await parcial.save();
  return presentar(parcial);
}

export async function eliminar(id) {
  const parcial = await Parcial.findById(id);
  if (!parcial) throw new AppError(404, NO_ENCONTRADO);

  const activas = await preparcialesActivas(parcial._id).countDocuments();
  if (activas) {
    throw new AppError(
      409,
      `Este parcial tiene ${activas} monitoría(s) preparcial programada(s). Cancélalas primero`,
    );
  }

  await parcial.deleteOne();
}

/** Parciales en un rango de fechas (para el calendario). */
export async function enRango(inicio, fin) {
  const parciales = await Parcial.find({ fecha: { $gte: inicio, $lte: fin } }).sort({ fecha: 1, hora: 1 });
  return parciales.map(presentar);
}
