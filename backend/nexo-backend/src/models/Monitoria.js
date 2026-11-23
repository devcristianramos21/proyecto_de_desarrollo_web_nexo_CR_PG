import mongoose from 'mongoose';
import { esHoraValida, FORMATO_HORA } from '../utils/horas.js';

export const MODALIDADES = ['presencial', 'virtual'];

/**
 * - par: un estudiante la solicita a un tutor específico; el tutor acepta o rechaza.
 * - obligatoria: la crea el admin y asigna a los estudiantes; el estudiante puede cambiarse de grupo.
 * - preparcial: la crea el admin; los estudiantes se inscriben.
 * - saber_pro: preparación Pruebas Saber Pro; la crea el admin; mínimo 7 y máximo 20 estudiantes.
 */
export const TIPOS = ['par', 'obligatoria', 'preparcial', 'saber_pro'];
export const TIPOS_GRUPALES = ['obligatoria', 'preparcial', 'saber_pro'];
// Tipos en los que el estudiante se inscribe por su cuenta (en la obligatoria lo asigna el admin)
export const TIPOS_CON_INSCRIPCION = ['preparcial', 'saber_pro'];

// Cupos por tipo. "minimo" es cuántos inscritos necesita para realizarse.
export const REGLAS_CUPO = {
  par: { minimo: 1, maximoPermitido: 1, porDefecto: 1 },
  obligatoria: { minimo: 1, maximoPermitido: 100, porDefecto: 20 },
  preparcial: { minimo: 1, maximoPermitido: 100, porDefecto: 20 },
  saber_pro: { minimo: 7, maximoPermitido: 20, porDefecto: 20 },
};

/**
 * - solicitada: monitoría par esperando respuesta del tutor
 * - rechazada: el tutor rechazó la solicitud
 * - programada: aceptada (par) o creada por el admin (grupales)
 * - cancelada / finalizada
 */
export const ESTADOS = ['solicitada', 'rechazada', 'programada', 'cancelada', 'finalizada'];
export const ESTADOS_PROPUESTA_HORARIO = ['pendiente', 'aceptada', 'rechazada'];
// Estados que ocupan el horario de sus participantes
export const ESTADOS_ACTIVOS = ['solicitada', 'programada'];

const propuestaHorarioSchema = new mongoose.Schema(
  {
    fechaPrincipal: { type: Date, required: true },
    horaInicioPrincipal: { type: String, required: true, match: FORMATO_HORA },
    horaFinPrincipal: { type: String, required: true, match: FORMATO_HORA },
    fechaAlternativa: { type: Date, required: true },
    horaInicioAlternativa: { type: String, required: true, match: FORMATO_HORA },
    horaFinAlternativa: { type: String, required: true, match: FORMATO_HORA },
    nota: { type: String, trim: true, maxlength: 500, default: '' },
    estado: { type: String, enum: ESTADOS_PROPUESTA_HORARIO, default: 'pendiente' },
    horarioSeleccionado: { type: String, enum: ['principal', 'alternativo'] },
    respondidaEn: { type: Date },
  },
  { _id: false },
);

const monitoriaSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: [true, 'El tipo es obligatorio'],
      enum: { values: TIPOS, message: `El tipo debe ser uno de: ${TIPOS.join(', ')}` },
    },
    materia: {
      type: String,
      required: [true, 'La materia es obligatoria'],
      trim: true,
      maxlength: [100, 'La materia no puede superar los 100 caracteres'],
    },
    tema: {
      type: String,
      trim: true,
      maxlength: [200, 'El tema no puede superar los 200 caracteres'],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede superar los 500 caracteres'],
    },
    // Para distinguir grupos de una misma obligatoria (ej. "A", "B")
    grupo: {
      type: String,
      trim: true,
      maxlength: [20, 'El grupo no puede superar los 20 caracteres'],
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El tutor es obligatorio'],
    },
    estudiantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
    cupoMaximo: {
      type: Number,
      min: [1, 'El cupo máximo debe ser al menos 1'],
    },
    // Día de la monitoría (medianoche UTC). La hora va en horaInicio/horaFin, en hora de Colombia.
    fecha: {
      type: Date,
      required: [true, 'La fecha es obligatoria'],
    },
    horaInicio: {
      type: String,
      required: [true, 'La hora de inicio es obligatoria'],
      match: [FORMATO_HORA, 'La hora de inicio debe tener el formato HH:mm'],
    },
    horaFin: {
      type: String,
      required: [true, 'La hora de fin es obligatoria'],
      match: [FORMATO_HORA, 'La hora de fin debe tener el formato HH:mm'],
    },
    modalidad: {
      type: String,
      required: [true, 'La modalidad es obligatoria'],
      enum: { values: MODALIDADES, message: 'La modalidad debe ser presencial o virtual' },
    },
    // Salón o enlace de la reunión
    lugar: {
      type: String,
      trim: true,
      maxlength: [300, 'El lugar no puede superar los 300 caracteres'],
    },
    estado: {
      type: String,
      enum: ESTADOS,
      default: 'programada',
    },
    // Quién la creó: el estudiante (par) o el administrador (grupales)
    creadaPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    // Solo en las preparcial: el parcial para el que prepara
    parcial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parcial',
    },
    // Motivo de rechazo o cancelación
    motivo: {
      type: String,
      trim: true,
      maxlength: [500, 'El motivo no puede superar los 500 caracteres'],
    },
    propuestaHorario: {
      type: propuestaHorarioSchema,
    },
  },
  { timestamps: true },
);

// Índices para las consultas más frecuentes: cruces de horario y "mis monitorías"
monitoriaSchema.index({ tutor: 1, fecha: 1 });
monitoriaSchema.index({ estudiantes: 1, fecha: 1 });
monitoriaSchema.index({ parcial: 1 });

monitoriaSchema.pre('validate', function () {
  if (esHoraValida(this.horaInicio) && esHoraValida(this.horaFin) && this.horaFin <= this.horaInicio) {
    this.invalidate('horaFin', 'La hora de fin debe ser posterior a la hora de inicio');
  }

  if (this.tipo === 'preparcial' && !this.parcial) {
    this.invalidate('parcial', 'Una monitoría preparcial debe indicar el parcial para el que prepara');
  }
  if (this.tipo !== 'preparcial' && this.parcial) {
    this.parcial = undefined;
  }

  const reglas = REGLAS_CUPO[this.tipo];
  if (!reglas) return;

  if (this.cupoMaximo == null) this.cupoMaximo = reglas.porDefecto;

  if (this.cupoMaximo < reglas.minimo || this.cupoMaximo > reglas.maximoPermitido) {
    this.invalidate(
      'cupoMaximo',
      reglas.minimo === reglas.maximoPermitido
        ? `El cupo de una monitoría ${this.tipo} es ${reglas.minimo}`
        : `El cupo máximo debe estar entre ${reglas.minimo} y ${reglas.maximoPermitido}`,
    );
  } else if (this.estudiantes.length > this.cupoMaximo) {
    this.invalidate('cupoMaximo', `Hay ${this.estudiantes.length} inscritos y el cupo máximo es ${this.cupoMaximo}`);
  }
});

export const Monitoria = mongoose.model('Monitoria', monitoriaSchema);
