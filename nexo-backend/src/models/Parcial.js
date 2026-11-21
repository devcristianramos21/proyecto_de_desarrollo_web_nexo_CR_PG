import mongoose from 'mongoose';
import { FORMATO_HORA } from '../utils/horas.js';

// Fecha de un parcial, publicada por la administración para programar monitorías preparcial.
const parcialSchema = new mongoose.Schema(
  {
    materia: {
      type: String,
      required: [true, 'La materia es obligatoria'],
      trim: true,
      maxlength: [100, 'La materia no puede superar los 100 caracteres'],
    },
    // Ej.: "Primer parcial", "Parcial final"
    nombre: {
      type: String,
      required: [true, 'El nombre del parcial es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede superar los 100 caracteres'],
    },
    // Día del parcial (medianoche UTC), igual que en las monitorías
    fecha: {
      type: Date,
      required: [true, 'La fecha es obligatoria'],
    },
    // Hora de inicio, en hora de Colombia. Opcional: sin hora se asume que empieza a las 00:00.
    hora: {
      type: String,
      match: [FORMATO_HORA, 'La hora debe tener el formato HH:mm'],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede superar los 500 caracteres'],
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
  },
  { timestamps: true },
);

parcialSchema.index({ fecha: 1 });

export const Parcial = mongoose.model('Parcial', parcialSchema);
