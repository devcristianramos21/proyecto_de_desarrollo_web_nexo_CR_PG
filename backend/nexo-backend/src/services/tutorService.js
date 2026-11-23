import { Disponibilidad, ordenarPorDia } from '../models/Disponibilidad.js';
import { Evaluacion } from '../models/Evaluacion.js';
import { CAMPOS_PUBLICOS_TUTOR, Usuario } from '../models/Usuario.js';
import { AppError } from '../utils/AppError.js';
import { regexBusqueda } from '../utils/escaparRegex.js';

/**
 * Busca tutores. Filtros opcionales (sin distinguir mayúsculas ni tildes):
 * - materia: parte del nombre de una materia que dicta ("calculo" encuentra "Cálculo Diferencial")
 * - nombre: parte del nombre del tutor
 */
export async function buscar({ materia, nombre } = {}) {
  const filtro = { rol: 'tutor' };

  if (materia) filtro.materias = regexBusqueda(materia);
  if (nombre) filtro.nombre = regexBusqueda(nombre);

  const tutores = await Usuario.find(filtro)
    .select(CAMPOS_PUBLICOS_TUTOR)
    .sort({ nombre: 1 });
  return enriquecerDatosPublicos(tutores);
}

export async function obtenerPorId(id) {
  const tutor = await Usuario.findOne({ _id: id, rol: 'tutor' }).select(CAMPOS_PUBLICOS_TUTOR);

  if (!tutor) {
    throw new AppError(404, 'Tutor no encontrado');
  }

  const [tutorEnriquecido] = await enriquecerDatosPublicos([tutor]);
  return tutorEnriquecido;
}

export async function obtenerDisponibilidad(id) {
  if (!await Usuario.exists({ _id: id, rol: 'tutor' })) {
    throw new AppError(404, 'Tutor no encontrado');
  }
  return ordenarPorDia(await Disponibilidad.find({ tutor: id }));
}

export async function enriquecerDatosPublicos(tutores) {
  if (tutores.length === 0) return [];

  const ids = tutores.map((tutor) => tutor._id);
  const [franjasSinOrdenar, evaluaciones] = await Promise.all([
    Disponibilidad.find({ tutor: { $in: ids } })
      .select('tutor diaSemana horaInicio horaFin')
      .lean(),
    Evaluacion.aggregate([
      { $match: { tutor: { $in: ids } } },
      {
        $group: {
          _id: '$tutor',
          calificacion: { $avg: '$calificacionGeneral' },
          resenas: { $sum: 1 },
        },
      },
    ]),
  ]);
  const franjas = ordenarPorDia(franjasSinOrdenar);
  const franjasPorTutor = new Map();
  const evaluacionesPorTutor = new Map(
    evaluaciones.map((evaluacion) => [String(evaluacion._id), evaluacion]),
  );

  for (const franja of franjas) {
    const idTutor = String(franja.tutor);
    const horarios = franjasPorTutor.get(idTutor) ?? [];
    horarios.push({
      diaSemana: franja.diaSemana,
      horaInicio: franja.horaInicio,
      horaFin: franja.horaFin,
    });
    franjasPorTutor.set(idTutor, horarios);
  }

  return tutores.map((tutor) => {
    const datosEvaluacion = evaluacionesPorTutor.get(String(tutor._id));
    return {
      ...tutor.toObject(),
      calificacion: datosEvaluacion ? Number(datosEvaluacion.calificacion.toFixed(1)) : null,
      resenas: datosEvaluacion?.resenas ?? 0,
      horarios: franjasPorTutor.get(String(tutor._id)) ?? [],
    };
  });
}
