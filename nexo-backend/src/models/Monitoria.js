import mongoose from 'mongoose';

// Formato de 24 horas: "08:00", "14:30"
const FORMATO_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

export const MODALIDADES = ['presencial', 'virtual'];
export const ESTADOS = ['programada', 'en_curso', 'finalizada', 'cancelada'];

const monitoriaSchema = new mongoose.Schema(
  {
    materia: {
      type: String,
      required: [true, 'La materia es obligatoria'],
      trim: true,
    },
    tema: {
      type: String,
      trim: true,
    },
    // Nombre del tutor. Cuando exista el modelo Usuario pasará a ser una referencia.
    tutor: {
      type: String,
      required: [true, 'El tutor es obligatorio'],
      trim: true,
    },
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
      enum: {
        values: MODALIDADES,
        message: 'La modalidad debe ser presencial o virtual',
      },
    },
    estado: {
      type: String,
      enum: {
        values: ESTADOS,
        message: `El estado debe ser uno de: ${ESTADOS.join(', ')}`,
      },
      default: 'programada',
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede superar los 500 caracteres'],
    },
  },
  { timestamps: true },
);

// Se valida aquí y no en el campo para que también se revise al cambiar solo horaInicio.
monitoriaSchema.pre('validate', function () {
  const horasValidas = FORMATO_HORA.test(this.horaInicio) && FORMATO_HORA.test(this.horaFin);

  if (horasValidas && this.horaFin <= this.horaInicio) {
    this.invalidate('horaFin', 'La hora de fin debe ser posterior a la hora de inicio');
  }
});

export const Monitoria = mongoose.model('Monitoria', monitoriaSchema);
