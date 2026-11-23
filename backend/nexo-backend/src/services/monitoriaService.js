import mongoose from 'mongoose';
import { Disponibilidad } from '../models/Disponibilidad.js';
import {
  ESTADOS,
  ESTADOS_ACTIVOS,
  Monitoria,
  REGLAS_CUPO,
  TIPOS,
  TIPOS_CON_INSCRIPCION,
  TIPOS_GRUPALES,
} from '../models/Monitoria.js';
import { Usuario } from '../models/Usuario.js';
import { AppError } from '../utils/AppError.js';
import { elegirCampos } from '../utils/elegirCampos.js';
import { regexBusqueda } from '../utils/escaparRegex.js';
import {
  aTextoFecha,
  diaSemanaDe,
  hoyEnColombia,
  momentoEnColombia,
  parsearFecha,
} from '../utils/fechas.js';
import { esHoraValida } from '../utils/horas.js';
import * as parcialService from './parcialService.js';

const POBLAR = [
  { path: 'tutor', select: 'nombre foto materias' },
  { path: 'estudiantes', select: 'nombre correo carrera semestre' },
  { path: 'parcial', select: 'materia nombre fecha hora' },
];
const CAMPOS_PAR = ['materia', 'tema', 'descripcion', 'modalidad', 'lugar'];
const CAMPOS_GRUPAL = ['tipo', 'materia', 'tema', 'descripcion', 'grupo', 'modalidad', 'lugar', 'cupoMaximo'];
const CAMPOS_EDITABLES_GRUPAL = ['materia', 'tema', 'descripcion', 'grupo', 'modalidad', 'lugar', 'cupoMaximo'];
const MAX_DIAS_CALENDARIO = 92;
const NO_ENCONTRADA = 'Monitoría no encontrada';

// ───────────────────────── Utilidades internas ─────────────────────────

const idDe = (valor) => String(valor?._id ?? valor);
const esTutorDe = (monitoria, usuario) => idDe(monitoria.tutor) === usuario.id;
const estaInscrito = (monitoria, usuario) => monitoria.estudiantes.some((e) => idDe(e) === usuario.id);
const yaEmpezo = (monitoria) => momentoEnColombia(monitoria.fecha, monitoria.horaInicio) <= new Date();

// "Cálculo Diferencial" y "calculo diferencial" se consideran la misma materia
const normalizar = (texto) =>
  String(texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

/**
 * Formato de respuesta. Agrega datos calculados de cupo.
 * La lista de inscritos solo la ven el administrador y el tutor de la monitoría.
 */
export function presentar(monitoria, usuario) {
  const resultado = monitoria.toObject({ versionKey: false });
  const inscritos = monitoria.estudiantes.length;
  const { minimo } = REGLAS_CUPO[monitoria.tipo];

  Object.assign(resultado, {
    fecha: aTextoFecha(monitoria.fecha),
    inscritos,
    cupoMinimo: minimo,
    cuposDisponibles: Math.max(monitoria.cupoMaximo - inscritos, 0),
    // En Saber Pro es false hasta llegar a 7 inscritos
    cupoMinimoAlcanzado: inscritos >= minimo,
    inscrito: estaInscrito(monitoria, usuario),
  });

  if (resultado.parcial?.fecha instanceof Date) {
    resultado.parcial.fecha = aTextoFecha(resultado.parcial.fecha);
  }

  if (usuario.rol !== 'admin' && !esTutorDe(monitoria, usuario)) {
    delete resultado.estudiantes;
  }

  return resultado;
}

async function obtenerPoblada(id) {
  const monitoria = await Monitoria.findById(id).populate(POBLAR);
  if (!monitoria) throw new AppError(404, NO_ENCONTRADA);
  return monitoria;
}

// Para modificar se trabaja sin poblar, y al final se devuelve la versión poblada
async function obtenerParaEditar(id) {
  const monitoria = await Monitoria.findById(id);
  if (!monitoria) throw new AppError(404, NO_ENCONTRADA);
  return monitoria;
}

function validarOpcion(valor, permitidos, campo) {
  if (valor !== undefined && !permitidos.includes(valor)) {
    throw new AppError(400, `El ${campo} debe ser uno de: ${permitidos.join(', ')}`);
  }
}

/** Valida fecha y horas, y que el inicio sea en el futuro. */
function leerHorario({ fecha, horaInicio, horaFin }) {
  const dia = parsearFecha(fecha);
  const errores = {};

  if (!dia) errores.fecha = 'La fecha debe tener el formato AAAA-MM-DD';
  if (!esHoraValida(horaInicio)) errores.horaInicio = 'La hora de inicio debe tener el formato HH:mm';
  if (!esHoraValida(horaFin)) errores.horaFin = 'La hora de fin debe tener el formato HH:mm';
  else if (esHoraValida(horaInicio) && horaFin <= horaInicio) {
    errores.horaFin = 'La hora de fin debe ser posterior a la hora de inicio';
  }

  if (Object.keys(errores).length) throw new AppError(400, 'Datos no válidos', errores);

  if (momentoEnColombia(dia, horaInicio) <= new Date()) {
    throw new AppError(400, 'La monitoría debe programarse para una fecha y hora futuras');
  }

  return { fecha: dia, horaInicio, horaFin };
}

/** Lanza 409 si la persona (como tutor o como estudiante) ya tiene una monitoría activa que se cruce. */
async function verificarCruce(idPersona, { fecha, horaInicio, horaFin }, mensaje, excluir = []) {
  const cruce = await Monitoria.exists({
    _id: { $nin: excluir },
    estado: { $in: ESTADOS_ACTIVOS },
    fecha,
    horaInicio: { $lt: horaFin },
    horaFin: { $gt: horaInicio },
    $or: [{ tutor: idPersona }, { estudiantes: idPersona }],
  });

  if (cruce) throw new AppError(409, mensaje);
}

async function obtenerTutor(idTutor) {
  if (!idTutor) throw new AppError(400, 'Datos no válidos', { tutor: 'El tutor es obligatorio' });
  if (!mongoose.isValidObjectId(idTutor)) throw new AppError(400, 'Identificador de tutor no válido');

  const tutor = await Usuario.findOne({ _id: idTutor, rol: 'tutor' });
  if (!tutor) throw new AppError(404, 'Tutor no encontrado');

  return tutor;
}

/** Verifica una lista de ids de estudiantes y devuelve los ids sin repetir. */
async function validarEstudiantes(ids, idTutor) {
  if (!Array.isArray(ids)) throw new AppError(400, 'estudiantes debe ser una lista de identificadores');

  const unicos = [...new Set(ids.map(String))];
  if (unicos.some((id) => !mongoose.isValidObjectId(id))) {
    throw new AppError(400, 'Hay identificadores de estudiante no válidos');
  }
  if (unicos.includes(String(idTutor))) {
    throw new AppError(400, 'El tutor no puede estar inscrito como estudiante en su propia monitoría');
  }

  const existentes = await Usuario.countDocuments({ _id: { $in: unicos }, rol: { $in: ['estudiante', 'tutor'] } });
  if (existentes !== unicos.length) {
    throw new AppError(400, 'Alguno de los estudiantes no existe');
  }

  return unicos;
}

/** Verifica que una preparcial termine antes de su parcial. */
function verificarAntesDelParcial(horario, parcial) {
  if (!parcialService.terminaAntesDelParcial(horario, parcial)) {
    throw new AppError(400, 'La monitoría preparcial debe terminar antes de que empiece el parcial');
  }
}

// Agrega un estudiante sin superar el cupo, aunque dos personas se inscriban al mismo tiempo
function agregarSiHayCupo(idMonitoria, idEstudiante, session) {
  return Monitoria.findOneAndUpdate(
    {
      _id: idMonitoria,
      estado: 'programada',
      estudiantes: { $ne: idEstudiante },
      $expr: { $lt: [{ $size: '$estudiantes' }, '$cupoMaximo'] },
    },
    { $push: { estudiantes: idEstudiante } },
    { session },
  );
}

// ───────────────────────── Monitorías par ─────────────────────────

/** Un estudiante (o un tutor actuando como estudiante) solicita una monitoría a un tutor. */
export async function solicitarPar(estudiante, datos) {
  const tutor = await obtenerTutor(datos.tutor);

  if (tutor.id === estudiante.id) {
    throw new AppError(400, 'No puedes solicitarte una monitoría a ti mismo');
  }
  if (!datos.materia || typeof datos.materia !== 'string') {
    throw new AppError(400, 'Datos no válidos', { materia: 'La materia es obligatoria' });
  }
  if (!tutor.materias.some((materia) => normalizar(materia) === normalizar(datos.materia))) {
    throw new AppError(400, `${tutor.nombre} no dicta ${datos.materia}`);
  }

  const horario = leerHorario(datos);

  const dentroDeDisponibilidad = await Disponibilidad.exists({
    tutor: tutor._id,
    diaSemana: diaSemanaDe(horario.fecha),
    horaInicio: { $lte: horario.horaInicio },
    horaFin: { $gte: horario.horaFin },
  });
  if (!dentroDeDisponibilidad) {
    throw new AppError(409, 'El horario no está dentro de la disponibilidad del tutor');
  }

  await verificarCruce(tutor._id, horario, 'El tutor ya tiene una monitoría en ese horario');
  await verificarCruce(estudiante.id, horario, 'Ya tienes otra monitoría en ese horario');

  const monitoria = await Monitoria.create({
    ...elegirCampos(datos, CAMPOS_PAR),
    ...horario,
    tipo: 'par',
    tutor: tutor._id,
    estudiantes: [estudiante.id],
    estado: 'solicitada',
    creadaPor: estudiante.id,
  });

  return presentar(await obtenerPoblada(monitoria.id), estudiante);
}

/** El tutor acepta o rechaza una solicitud par dirigida a él. */
export async function responderSolicitud(tutor, id, { aceptar, motivo }) {
  const monitoria = await Monitoria.findById(id);

  // Si no es su monitoría responde 404, sin revelar que existe
  if (!monitoria || !esTutorDe(monitoria, tutor)) throw new AppError(404, NO_ENCONTRADA);
  if (monitoria.estado !== 'solicitada') {
    throw new AppError(409, `La monitoría ya está ${monitoria.estado}`);
  }

  if (aceptar) {
    if (yaEmpezo(monitoria)) throw new AppError(409, 'La fecha de esta solicitud ya pasó');
    await verificarCruce(tutor.id, monitoria, 'Ya tienes otra monitoría en ese horario', [monitoria._id]);
    monitoria.estado = 'programada';
  } else {
    monitoria.set({ estado: 'rechazada', motivo });
  }

  await monitoria.save();
  return presentar(await obtenerPoblada(id), tutor);
}

// ───────────────────────── Monitorías grupales (admin) ─────────────────────────

export async function crearGrupal(admin, datos) {
  validarOpcion(datos.tipo, TIPOS_GRUPALES, 'tipo');
  if (!datos.tipo) {
    throw new AppError(400, `Indica el tipo: ${TIPOS_GRUPALES.join(', ')}`);
  }

  const tutor = await obtenerTutor(datos.tutor);
  const horario = leerHorario(datos);
  const estudiantes = await validarEstudiantes(datos.estudiantes ?? [], tutor.id);

  // La preparcial toma la materia de su parcial y debe terminar antes de él
  const datosPreparcial = {};
  if (datos.tipo === 'preparcial') {
    const parcial = await parcialService.obtenerParaPreparcial(datos.parcial);
    verificarAntesDelParcial(horario, parcial);
    Object.assign(datosPreparcial, { parcial: parcial._id, materia: parcial.materia });
  }

  await verificarCruce(tutor._id, horario, 'El tutor ya tiene una monitoría en ese horario');

  const monitoria = await Monitoria.create({
    ...elegirCampos(datos, CAMPOS_GRUPAL),
    ...horario,
    ...datosPreparcial,
    tutor: tutor._id,
    estudiantes,
    estado: 'programada',
    creadaPor: admin.id,
  });

  return presentar(await obtenerPoblada(monitoria.id), admin);
}

export async function actualizarGrupal(admin, id, datos) {
  const monitoria = await obtenerParaEditar(id);

  if (!TIPOS_GRUPALES.includes(monitoria.tipo)) {
    throw new AppError(409, 'Las monitorías par no se editan: se cancelan y se solicita otra');
  }
  if (monitoria.estado !== 'programada') {
    throw new AppError(409, 'Solo se pueden editar monitorías programadas');
  }

  monitoria.set(elegirCampos(datos, CAMPOS_EDITABLES_GRUPAL));

  const cambiaHorario = ['fecha', 'horaInicio', 'horaFin'].some((campo) => datos[campo] !== undefined);
  if (cambiaHorario) {
    monitoria.set(
      leerHorario({
        fecha: datos.fecha ?? aTextoFecha(monitoria.fecha),
        horaInicio: datos.horaInicio ?? monitoria.horaInicio,
        horaFin: datos.horaFin ?? monitoria.horaFin,
      }),
    );
  }

  if (datos.tutor !== undefined) {
    const tutor = await obtenerTutor(datos.tutor);
    if (estaInscrito(monitoria, tutor)) {
      throw new AppError(400, 'El nuevo tutor está inscrito como estudiante en esta monitoría');
    }
    monitoria.tutor = tutor._id;
  }

  // En una preparcial la materia siempre es la del parcial
  if (monitoria.tipo === 'preparcial' && (cambiaHorario || datos.parcial !== undefined || datos.materia !== undefined)) {
    const parcial = await parcialService.obtenerParaPreparcial(datos.parcial ?? monitoria.parcial);
    verificarAntesDelParcial(monitoria, parcial);
    monitoria.set({ parcial: parcial._id, materia: parcial.materia });
  }

  if (cambiaHorario || datos.tutor !== undefined) {
    await verificarCruce(monitoria.tutor, monitoria, 'El tutor ya tiene una monitoría en ese horario', [monitoria._id]);
  }

  await monitoria.save();
  return presentar(await obtenerPoblada(id), admin);
}

export async function agregarEstudiantes(admin, id, ids) {
  const monitoria = await obtenerParaEditar(id);

  if (!TIPOS_GRUPALES.includes(monitoria.tipo)) {
    throw new AppError(400, 'Solo se asignan estudiantes en monitorías grupales');
  }
  if (monitoria.estado !== 'programada') {
    throw new AppError(409, 'Solo se asignan estudiantes en monitorías programadas');
  }

  const validos = await validarEstudiantes(ids, monitoria.tutor);
  const nuevos = validos.filter((idEstudiante) => !monitoria.estudiantes.some((e) => idDe(e) === idEstudiante));

  // El modelo valida que no se supere el cupo
  monitoria.estudiantes.push(...nuevos);
  await monitoria.save();

  return presentar(await obtenerPoblada(id), admin);
}

export async function quitarEstudiante(admin, id, idEstudiante) {
  const monitoria = await obtenerParaEditar(id);

  if (!estaInscrito(monitoria, { id: String(idEstudiante) })) {
    throw new AppError(404, 'Ese estudiante no está inscrito en esta monitoría');
  }

  await Monitoria.updateOne({ _id: monitoria._id }, { $pull: { estudiantes: idEstudiante } });
  return presentar(await obtenerPoblada(id), admin);
}

// ───────────────────────── Inscripciones (estudiante) ─────────────────────────

export async function inscribirse(usuario, id) {
  const monitoria = await obtenerParaEditar(id);

  if (!TIPOS_CON_INSCRIPCION.includes(monitoria.tipo)) {
    throw new AppError(
      400,
      monitoria.tipo === 'obligatoria'
        ? 'En las monitorías obligatorias te asigna la administración; puedes cambiarte de grupo'
        : 'Las monitorías par se solicitan directamente al tutor',
    );
  }
  if (monitoria.estado !== 'programada') throw new AppError(409, 'Esta monitoría no admite inscripciones');
  if (yaEmpezo(monitoria)) throw new AppError(409, 'Esta monitoría ya comenzó');
  if (esTutorDe(monitoria, usuario)) throw new AppError(400, 'Eres el tutor de esta monitoría');
  if (estaInscrito(monitoria, usuario)) throw new AppError(409, 'Ya estás inscrito en esta monitoría');
  if (monitoria.estudiantes.length >= monitoria.cupoMaximo) throw new AppError(409, 'No quedan cupos');

  await verificarCruce(usuario.id, monitoria, 'Ya tienes otra monitoría en ese horario', [monitoria._id]);

  if (!(await agregarSiHayCupo(monitoria._id, usuario.id))) {
    throw new AppError(409, 'No quedan cupos');
  }

  return presentar(await obtenerPoblada(id), usuario);
}

export async function cancelarInscripcion(usuario, id) {
  const monitoria = await obtenerParaEditar(id);

  if (monitoria.tipo === 'obligatoria') {
    throw new AppError(400, 'No puedes salir de una monitoría obligatoria; puedes cambiarte de grupo');
  }
  if (monitoria.tipo === 'par') {
    throw new AppError(400, 'Para una monitoría par usa la opción de cancelar');
  }
  if (!estaInscrito(monitoria, usuario)) throw new AppError(409, 'No estás inscrito en esta monitoría');
  if (monitoria.estado !== 'programada' || yaEmpezo(monitoria)) {
    throw new AppError(409, 'Ya no puedes cancelar tu inscripción en esta monitoría');
  }

  await Monitoria.updateOne({ _id: monitoria._id }, { $pull: { estudiantes: usuario.id } });
  return presentar(await obtenerPoblada(id), usuario);
}

/** Pasa al estudiante de un grupo de obligatoria a otro grupo de la misma materia. */
export async function cambiarGrupo(usuario, idOrigen, idDestino) {
  if (!idDestino) {
    throw new AppError(400, 'Datos no válidos', { destino: 'Indica el grupo de destino' });
  }

  const [origen, destino] = await Promise.all([Monitoria.findById(idOrigen), Monitoria.findById(idDestino)]);

  if (!origen || !estaInscrito(origen, usuario)) {
    throw new AppError(404, 'No estás inscrito en esa monitoría');
  }
  if (origen.tipo !== 'obligatoria') {
    throw new AppError(400, 'Solo puedes cambiarte de grupo en monitorías obligatorias');
  }
  if (
    !destino ||
    destino.id === origen.id ||
    destino.tipo !== 'obligatoria' ||
    normalizar(destino.materia) !== normalizar(origen.materia)
  ) {
    throw new AppError(400, 'El destino debe ser otro grupo de la monitoría obligatoria de la misma materia');
  }
  if (origen.estado !== 'programada' || destino.estado !== 'programada' || yaEmpezo(origen) || yaEmpezo(destino)) {
    throw new AppError(409, 'Solo puedes cambiarte entre grupos programados que no hayan comenzado');
  }
  if (esTutorDe(destino, usuario)) throw new AppError(400, 'Eres el tutor de ese grupo');
  if (destino.estudiantes.length >= destino.cupoMaximo) {
    throw new AppError(409, 'El grupo de destino no tiene cupos');
  }

  await verificarCruce(
    usuario.id,
    destino,
    'El nuevo grupo se cruza con otra de tus monitorías',
    [origen._id, destino._id],
  );

  // Entrar al nuevo grupo y salir del anterior: o pasan las dos cosas o ninguna
  await mongoose.connection.transaction(async (session) => {
    if (!(await agregarSiHayCupo(destino._id, usuario.id, session))) {
      throw new AppError(409, 'El grupo de destino no tiene cupos');
    }
    await Monitoria.updateOne({ _id: origen._id }, { $pull: { estudiantes: usuario.id } }, { session });
  });

  return presentar(await obtenerPoblada(destino.id), usuario);
}

// ───────────────────────── Cancelar y finalizar ─────────────────────────

export async function cancelar(usuario, id, { motivo } = {}) {
  const monitoria = await obtenerParaEditar(id);

  const puedeCancelar =
    usuario.rol === 'admin' ||
    esTutorDe(monitoria, usuario) ||
    (monitoria.tipo === 'par' && estaInscrito(monitoria, usuario));

  if (!puedeCancelar) throw new AppError(403, 'No puedes cancelar esta monitoría');
  if (!ESTADOS_ACTIVOS.includes(monitoria.estado)) {
    throw new AppError(409, `La monitoría ya está ${monitoria.estado}`);
  }
  if (yaEmpezo(monitoria)) throw new AppError(409, 'No se puede cancelar una monitoría que ya comenzó');

  monitoria.set({ estado: 'cancelada', motivo });
  await monitoria.save();

  return presentar(await obtenerPoblada(id), usuario);
}

export async function finalizar(usuario, id) {
  const monitoria = await obtenerParaEditar(id);

  if (usuario.rol !== 'admin' && !esTutorDe(monitoria, usuario)) {
    throw new AppError(403, 'Solo el tutor o un administrador pueden finalizar la monitoría');
  }
  if (monitoria.estado !== 'programada') {
    throw new AppError(409, `Solo se finalizan monitorías programadas; esta está ${monitoria.estado}`);
  }
  if (!yaEmpezo(monitoria)) throw new AppError(409, 'La monitoría aún no ha comenzado');

  const { minimo } = REGLAS_CUPO[monitoria.tipo];
  if (monitoria.estudiantes.length < minimo) {
    throw new AppError(409, `No se puede realizar: necesita al menos ${minimo} inscritos`);
  }

  monitoria.estado = 'finalizada';
  await monitoria.save();

  return presentar(await obtenerPoblada(id), usuario);
}

// ───────────────────────── Consultas ─────────────────────────

const ORDEN = { fecha: 1, horaInicio: 1 };

async function buscar(filtro, usuario) {
  const monitorias = await Monitoria.find(filtro).populate(POBLAR).sort(ORDEN);
  return monitorias.map((monitoria) => presentar(monitoria, usuario));
}

/** Administrador: todas, con filtros opcionales. */
export async function listarTodas(admin, { tipo, estado, materia, tutor } = {}) {
  validarOpcion(tipo, TIPOS, 'tipo');
  validarOpcion(estado, ESTADOS, 'estado');

  const filtro = {};
  if (tipo) filtro.tipo = tipo;
  if (estado) filtro.estado = estado;
  if (materia) filtro.materia = regexBusqueda(materia);
  if (tutor) {
    if (!mongoose.isValidObjectId(tutor)) throw new AppError(400, 'Identificador de tutor no válido');
    filtro.tutor = tutor;
  }

  return buscar(filtro, admin);
}

/** Catálogo "Monitorías": grupales programadas que aún no han comenzado. */
export async function listarDisponibles(usuario, { tipo, materia } = {}) {
  validarOpcion(tipo, TIPOS_GRUPALES, 'tipo');

  const filtro = {
    tipo: tipo ?? { $in: TIPOS_GRUPALES },
    estado: 'programada',
    fecha: { $gte: hoyEnColombia() },
  };
  if (materia) filtro.materia = regexBusqueda(materia);

  const monitorias = await Monitoria.find(filtro).populate(POBLAR).sort(ORDEN);
  return monitorias.filter((monitoria) => !yaEmpezo(monitoria)).map((monitoria) => presentar(monitoria, usuario));
}

/** "Mis tutorías": donde el usuario participa como estudiante. */
export async function listarComoEstudiante(usuario, { estado } = {}) {
  validarOpcion(estado, ESTADOS, 'estado');
  return buscar({ estudiantes: usuario.id, ...(estado && { estado }) }, usuario);
}

/** Monitorías que el usuario dicta como tutor (estado=solicitada para ver solicitudes pendientes). */
export async function listarComoTutor(usuario, { estado } = {}) {
  validarOpcion(estado, ESTADOS, 'estado');
  return buscar({ tutor: usuario.id, ...(estado && { estado }) }, usuario);
}

/** Preparciales programadas de un parcial que aún no han comenzado. */
export async function listarPreparcialesDe(usuario, idParcial) {
  await parcialService.obtenerPorId(idParcial);

  const monitorias = await Monitoria.find({ tipo: 'preparcial', parcial: idParcial, estado: 'programada' })
    .populate(POBLAR)
    .sort(ORDEN);

  return monitorias.filter((monitoria) => !yaEmpezo(monitoria)).map((monitoria) => presentar(monitoria, usuario));
}

export async function obtenerDetalle(usuario, id) {
  const monitoria = await obtenerPoblada(id);

  // Las par son privadas: solo las ven sus participantes y el administrador
  const puedeVer =
    monitoria.tipo !== 'par' ||
    usuario.rol === 'admin' ||
    esTutorDe(monitoria, usuario) ||
    estaInscrito(monitoria, usuario);

  if (!puedeVer) throw new AppError(404, NO_ENCONTRADA);
  return presentar(monitoria, usuario);
}

/** Calendario del usuario entre dos fechas (incluidas): sus monitorías y los parciales publicados. */
export async function calendario(usuario, { desde, hasta } = {}) {
  const inicio = parsearFecha(desde);
  const fin = parsearFecha(hasta);

  if (!inicio || !fin) {
    throw new AppError(400, 'Indica desde y hasta con el formato AAAA-MM-DD');
  }
  if (fin < inicio) throw new AppError(400, 'La fecha "hasta" debe ser igual o posterior a "desde"');
  if ((fin - inicio) / (24 * 60 * 60 * 1000) > MAX_DIAS_CALENDARIO) {
    throw new AppError(400, `El rango no puede superar ${MAX_DIAS_CALENDARIO} días`);
  }

  const monitorias = await Monitoria.find({
    fecha: { $gte: inicio, $lte: fin },
    // Las rechazadas y canceladas no ocupan el calendario
    estado: { $in: [...ESTADOS_ACTIVOS, 'finalizada'] },
    $or: [{ tutor: usuario.id }, { estudiantes: usuario.id }],
  })
    .populate(POBLAR)
    .sort(ORDEN);

  return {
    desde,
    hasta,
    monitorias: monitorias.map((monitoria) => ({
      ...presentar(monitoria, usuario),
      rolEnMonitoria: esTutorDe(monitoria, usuario) ? 'tutor' : 'estudiante',
    })),
    parciales: await parcialService.enRango(inicio, fin),
  };
}
