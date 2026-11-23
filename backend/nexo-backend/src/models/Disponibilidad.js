import mongoose from 'mongoose';
import { esHoraValida, FORMATO_HORA } from '../utils/horas.js';

// Sin tildes para evitar diferencias de escritura entre frontend y backend
export const DIAS_SEMANA = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

// Franja semanal en la que un tutor puede dar monitorías. Ej.: martes de 14:00 a 16:00.
const disponibilidadSchema = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    diaSemana: {
      type: String,
      required: [true, 'El día de la semana es obligatorio'],
      enum: {
        values: DIAS_SEMANA,
        message: `El día debe ser uno de: ${DIAS_SEMANA.join(', ')}`,
      },
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
  },
  { timestamps: true },
);

disponibilidadSchema.pre('validate', function () {
  if (esHoraValida(this.horaInicio) && esHoraValida(this.horaFin) && this.horaFin <= this.horaInicio) {
    this.invalidate('horaFin', 'La hora de fin debe ser posterior a la hora de inicio');
  }
});

/** Ordena franjas de lunes a domingo y, dentro de cada día, por hora de inicio. */
export function ordenarPorDia(franjas) {
  return franjas.sort(
    (a, b) =>
      DIAS_SEMANA.indexOf(a.diaSemana) - DIAS_SEMANA.indexOf(b.diaSemana) ||
      a.horaInicio.localeCompare(b.horaInicio),
  );
}

export const Disponibilidad = mongoose.model('Disponibilidad', disponibilidadSchema);
